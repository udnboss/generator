import { promises as fs } from 'fs';
import { Database } from 'sqlite3';

export enum Operator {
    Equals,
    NotEquals,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    IsNull,
    IsNotNull,
    IsIn,
    IsNotIn,
    StartsWith,
    EndsWith,
    Contains,
    Between,
    NotBetween
}

export enum ClientOperator {
    Contains            = 'like',
    Equals              = 'e',
    NotEquals           = 'ne',
    IsIn                = 'in',
    IsNotIn             = 'nin',
    IsNull              = 'nul',
    IsNotNull           = 'nnul',
    GreaterThan         = 'gt',
    GreaterThanOrEqual  = 'gte',
    LessThan            = 'lt',
    LessThanOrEqual     = 'lte',
    StartsWith          = 'sw',
    EndsWith            = 'ew',
    Between             = 'bt',
    NotBetween          = 'nbt',
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc'
}

export enum ErrorCodes {
    EntityNotFound, //404
    EntityTypeMismatch, //400
    PropertyTypeMismatch, //400
    QueryValidationError, //405
    DataValidationError, //405
    DatabaseNotFound, //500
    DatabaseLocked, //500
    UnhandledException, //500
    Unauthenticated, //401
    Unauthorized, //403
    RelationalConstraintViolation, //405
    UniqueConstraintViolation, //405
}

export interface ISort {
    column: string;
    direction: SortDirection;
}

export interface ICondition {
    column: string;
    operator: Operator;
    value: string | number | boolean | string[] | number[];
}

export interface IClientCondition {
    operator: string;
    value:string;
}

export interface IQuery {
    sortby: string;
    sortdir: string;
    search: string;
    page: number;
    pageSize: number;    
}

export interface IClientQuery {
    $sort?: string;
    $order?: string;
    $page?: number;
    $size?: number;
}

export interface IDataQuery {
    sort?: ISort[];
    where: ICondition[];
    limit: number;
    offset: number;
}

export interface IQueryResult<Q, T> {
    query: Q;
    count: number;
    total: number;
    result: T[]
}

export interface IEntity {
    id?: string;
}

export abstract class Entity {
    id?: string;
}

export interface IBusiness<TOutput extends IEntity> {
    idProperty:string;
    createProperties: any;
    updateProperties: any;
    partialProperties: any;
    queryProperties: any;
    entityName: string;
    getAll?: (query?:IDataQuery) => Promise<IQueryResult<IQuery, TOutput>>;
    getById?: (id: string) => Promise<TOutput>;
    create?: <T extends IEntity>(entity: T) => Promise<TOutput>;
    update?: <T extends IEntity>(id: string, entity: T) => Promise<TOutput>;
    modify?: <T extends IEntity>(id: string, entity: T) => Promise<TOutput>;
    delete?: (id: string) => Promise<TOutput>;
    isEntity?: <T extends IEntity>(entity: T) => boolean;
}

export abstract class Business<TOutput extends IEntity> implements IBusiness<TOutput> {
    idProperty:string = 'id';
    createProperties: { id: { type: "string", required: true } };
    updateProperties: { id: { type: "string", required: true } };
    partialProperties: { id: { type: "string", required: false } };
    queryProperties: { id: { type: "string", required: false } }; 
    sortableProperties:string[] = [];
    private db: IDBProvider;
    context: Context;
    entityName: string;

    constructor(context: Context, entityName: string) {
        this.context = context;
        this.db = context.db;
        this.entityName = entityName;
    }

    /**
     * Check if an object implements an interface based on its properties and values types
     * @param obj incoming object
     * @param interfaceProperites interface to check against
     * @returns true if it implements it, throws an error if not
     */
    private implementsInterface(obj: { [key: string]: any }, interfaceProperites: { [key: string]: any }): boolean {
        if (obj == null) {
            return false; //empty or null object
        }

        let expectedKeys = interfaceProperites; //required keys
        for (let key in expectedKeys) {
            let isRequired = expectedKeys[key].required;
            if (isRequired && !(key in obj)) {
                throw new Error(`missing required property ${key}`);
                return false; //missing required property
            }
            let value = obj[key];
            let nullOrUndefined = value === null || value === undefined;
            if (isRequired && (nullOrUndefined || value === "")) {
                throw new Error(`no value provided for required property ${key}`);
                return false; //no value provided for required property
            }
            
            let expectedType = expectedKeys[key].type;
            if (expectedType != 'array') {
                let incomingType = typeof value;
                if (!nullOrUndefined && incomingType !== expectedType) {
                    throw new Error(`property ${key}: expected type ${expectedType} does not match provided type ${incomingType}`);
                    return false; //primitive type not matching           
                }
            } else {
                let expectedSubType = expectedKeys[key].subtype;
                if (!Array.isArray(value) || !value.every(v => v === null || v === undefined || typeof v === expectedSubType)) {
                    throw new Error(`property ${key}: expected array subtype ${expectedSubType} does not match provided subtype`);
                    return false; //array type not matching or items not of expected subtype
                }
            }
        }

        for (let key in obj) {
            if (!(key in expectedKeys)) {
                throw new Error(`received unexpected property ${key}`);
                return false; //extra properties found
            }
        }

        return true;
    }    

    convertToDataQuery(query:IClientQuery):IDataQuery {
        const operatorMap = {
            'like': Operator.Contains,
            'e': Operator.Equals,
            'ne': Operator.NotEquals,
            'in': Operator.IsIn,
            'nin': Operator.IsNotIn,
            'nul': Operator.IsNull,
            'nnul': Operator.IsNotNull,
            'gt': Operator.GreaterThan,
            'gte': Operator.GreaterThanOrEqual,
            'lt': Operator.LessThan,
            'lte': Operator.LessThanOrEqual,
            'sw': Operator.StartsWith,
            'ew': Operator.EndsWith,
            'bt': Operator.Between,
            'nbt': Operator.NotBetween,
        };

        const arrayValueOperators = ['e', 'in', 'nin', 'bt', 'nbt'];
        
        if (query.$size && isNaN(query.$size as any)) { throw new Error(`${this.entityName} Entity query: Found invalid $size parameter ${query.$size}`); }
        if (query.$page && isNaN(query.$page as any)) { throw new Error(`${this.entityName} Entity query: Found invalid $page parameter ${query.$page}`); }
        
        if (query.$sort && !this.sortableProperties.includes(query.$sort)) {
            throw new Error(`${this.entityName} Entity query: Found unsupported $sort parameter ${query.$sort}`);
        }

        const dataQuery:IDataQuery = {
            // table: this.entityName,
            limit: query.$size || 0,
            offset: (query.$size || 0) / (query.$page || 1),
            where: [],
            sort: query.$sort ? [{ column: query.$sort, direction: query.$order ?? SortDirection.Asc } as ISort] : []
        };

        const ignoreProps = ['$sort', '$order', '$page', '$size'];

        for (let prop in query) {
            if (ignoreProps.includes(prop)) { continue; }


            
            let v = (query as any)[prop];
            if (v === undefined && v === null && v === '') continue;    
                                    
            var propName = prop;
            var op = "e";
            // if (prop.includes('|')) [ propName, op ] = prop.split('|');  
            const validProps = (this.queryProperties as any);

            if (!(propName in validProps)) { throw new Error(`${this.entityName} Entity query: Found unsupported property ${propName}`); }
            
            if (!('operator' in validProps[propName])) { throw new Error(`${this.entityName} Entity query: Property ${propName} does not have a filter operator defined`); }
            
            op = validProps[propName].operator;

            if (!(op in operatorMap)) { throw new Error(`${this.entityName} Entity query: Found unsupported operator ${op} for property ${propName}`); }
                        
            const propType = validProps[propName].type;
            if (arrayValueOperators.includes(op)) { 
                const values = v.split(',');
                if (propType === "number") { 
                    v = values.map( (x:any) => isNaN(x) ? 0 : Number(x)); 
                } else if (propType === "boolean") { 
                    v = values.map( (x:any) => Boolean(x)); 
                }
            } else {
                if (propType === "number") { 
                    v = isNaN(v) ? 0 : Number(v); 
                } else if (propType === "boolean") { 
                    v = Boolean(v); 
                }
            }

            const condition = { column: prop, operator: (operatorMap as any)[op], value: v } as ICondition;
            dataQuery.where.push(condition);

        }

        return dataQuery;
    }

    isCreate(obj: { [key: string]: any }): boolean {
        return this.implementsInterface(obj, this.createProperties);
    }

    isUpdate(obj: { [key: string]: any }): boolean {
        return this.implementsInterface(obj, this.updateProperties);
    }

    isPartial(obj: { [key: string]: any }): boolean {
        return this.implementsInterface(obj, this.partialProperties);
    }

    async getAll(query?:IDataQuery, maxDepth:number = 2): Promise<IQueryResult<IQuery, TOutput>> {
        if (maxDepth < 1) {
            return new Promise((resolve) => { resolve({ count: 0, result: [], total: 0, query: { page: 1 } } as IQueryResult<IQuery, TOutput>); });
        }
        return this.db.dbSelect(this.entityName, query?.where, query?.sort) as Promise<IQueryResult<IQuery, TOutput>>;
    }

    async getById(id: string, maxDepth:number = 2): Promise<TOutput> {
        if (maxDepth < 1) {
            return new Promise((resolve) => { resolve(null as any as TOutput); });
        }
        const dbResult = await this.db.dbSelect(this.entityName,
            [{ column: this.idProperty, operator: Operator.Equals, value: id } as ICondition]);
        if (dbResult.count == 0) {
            throw new Error("ENTITY_NOT_FOUND: Entity Not Found");
        }
        return dbResult.result[0] as TOutput;
    }

    async create(entity: IEntity): Promise<TOutput> {       
        await this.db.dbBegin(); 
        try {
            const dbResult = await this.db.dbInsert(this.entityName, this.idProperty, entity as IEntity) as TOutput;            
            await this.db.dbCommit();
            return dbResult;
        } catch (err) {
            await this.db.dbRollback();
            throw err;
        }        
    }

    async update(id: string, entity: IEntity): Promise<TOutput> {
        await this.db.dbBegin(); 
        try {
            const dbResult = await this.db.dbUpdate(this.entityName, this.idProperty, id, entity as IEntity) as TOutput;
            await this.db.dbCommit();
            return dbResult;
        } catch (err) {
            await this.db.dbRollback();
            throw err;
        } 
    }

    async modify(id: string, entity: IEntity): Promise<TOutput> {
        await this.db.dbBegin(); 
        try {
            const dbResult = await this.db.dbUpdate(this.entityName, this.idProperty, id, entity as IEntity) as TOutput;
            await this.db.dbCommit();
            return dbResult;
        } catch (err) {
            await this.db.dbRollback();
            throw err;
        }
    }

    async delete(id: string): Promise<TOutput> {
        await this.db.dbBegin(); 
        try {
            const entity = await this.getById(id) as TOutput;
            const deleted = await this.db.dbDelete(this.entityName, this.idProperty, id);
            if (!deleted) {
                throw new Error("Could not Delete");
            }
            
            await this.db.dbCommit();
            return entity;
        } catch (err) {
            await this.db.dbRollback();
            throw err;
        }        
    }
}

export enum DBProviderType {
    JSON,
    Sqlite
}

export class Environment {
    dbProviderType: DBProviderType = DBProviderType.Sqlite;
    dbFile: string = "./db/db.sqlite3";
    apiPort: number = 3001;
}

interface IDBProvider {
    dbConnect: () => {};
    clearCache: () => void;
    dbCount: (table: string, where?: ICondition[]) => Promise<Number>;
    dbSelect: (table: string, where?: ICondition[], sort?: ISort[], offset?:number, limit?: number) => Promise<IQueryResult<IQuery, IEntity>>;
    dbInsert: (table: string, idCol:string, record: IEntity) => Promise<IEntity>;
    dbUpdate: (table: string, idCol:string, id: string, record: IEntity) => Promise<IEntity>;
    dbDelete: (table: string, idCol:string, id: string) => Promise<boolean>;
    dbCommit: () => Promise<any>;
    dbBegin: () => Promise<any>;
    dbRollback: () => Promise<any>;
}

class DBJSONProvider implements IDBProvider {
    dbFile: string;

    constructor(dbFile: string) {
        this.dbFile = dbFile;
    }

    _db: any = null;

    dbConnect = async () => {
        if (this._db)
            return this._db;

        const result = await fs.readFile(this.dbFile, 'utf-8');
        const db = JSON.parse(result);
        this._db = db;
        return db;
    };

    clearCache = () => {
        this._db = null;
    };

    dbCount = async (table: string, where: ICondition[] = []) => {
        const db = await this.dbConnect();
        return (db[table] as any[]).filter((x) => {
            for (const cond of where) {
                const value = x[cond.column];

                switch (cond.operator) {
                    case Operator.Equals:
                        if (value !== cond.value)
                            return false;
                        break;
                    case Operator.Contains:
                        if ((value as string).indexOf(cond.value as string) === -1)
                            return false;
                        break;
                    case Operator.StartsWith:
                        if (!(value as string).startsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.EndsWith:
                        if (!(value as string).endsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.NotEquals:
                        if (value === cond.value)
                            return false;
                        break;
                    case Operator.GreaterThan:
                        if (!(value > cond.value))
                            return false;
                        break;
                    case Operator.LessThan:
                        if (!(value < cond.value))
                            return false;
                        break;
                    case Operator.IsIn:
                        if ((cond.value as unknown as any[]).indexOf(value) === -1)
                            return false;
                        break;
                    case Operator.IsNotIn:
                        if ((cond.value as unknown as any[]).indexOf(value) !== -1)
                            return false;
                        break;
                    case Operator.IsNull:
                        if (value !== null)
                            return false;
                        break;
                    case Operator.IsNotNull:
                        if (value === null)
                            return false;
                        break;
                }
            }
            return true;
        }).length;
    };

    dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = [], offset:number = 0, limit: number = 0) => {
        const db = await this.dbConnect();

        const results = (db[table] as any[]).filter((x) => {
            for (const cond of where) {
                const value = x[cond.column];

                switch (cond.operator) {
                    case Operator.Equals:
                        if (value !== cond.value)
                            return false;
                        break;
                    case Operator.Contains:
                        if ((value as string).indexOf(cond.value as string) === -1)
                            return false;
                        break;
                    case Operator.StartsWith:
                        if (!(value as string).startsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.EndsWith:
                        if (!(value as string).endsWith(cond.value as string))
                            return false;
                        break;
                    case Operator.NotEquals:
                        if (value === cond.value)
                            return false;
                        break;
                    case Operator.GreaterThan:
                        if (!(value > cond.value))
                            return false;
                        break;
                    case Operator.LessThan:
                        if (!(value < cond.value))
                            return false;
                        break;
                    case Operator.IsIn:
                        if ((cond.value as unknown as any[]).indexOf(value) === -1)
                            return false;
                        break;
                    case Operator.IsNotIn:
                        if ((cond.value as unknown as any[]).indexOf(value) !== -1)
                            return false;
                        break;
                    case Operator.IsNull:
                        if (value !== null)
                            return false;
                        break;
                    case Operator.IsNotNull:
                        if (value === null)
                            return false;
                        break;
                }
            }
            return true;
        });

        console.log('RESULTS:');
        console.dir(results);

        if (sort.length > 0) {
            results.sort((a, b) => {
                for (const s of sort) {
                    const av = a[s.column];
                    const bv = b[s.column];
                    if (av < bv)
                        return s.direction == SortDirection.Asc ? -1 : 1;
                    if (av > bv)
                        return s.direction == SortDirection.Asc ? 1 : -1;
                }

                return 0;
            });
        }

        //TODO: DBJSON offset and limit
        const page = limit > 0 ? ((offset / limit) || 1) : 1;

        return { result: results, count: results.length, total: results.length, query: { page: page, pageSize: limit } } as IQueryResult<IQuery, IEntity>;
    };

    dbInsert = async (table: string, idCol:string, record: IEntity) => {
        const db = await this.dbConnect();
        db[table].push(record);
        return record;
    };

    dbDelete = async (table: string, idCol:string, id: string) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex((x: IEntity) => x.id == id);
        if (index > -1) {
            (db[table] as []).splice(index, 1);
            return true;
        }
        return false;
    };

    dbUpdate = async (table: string, idCol:string, id: string, record: IEntity) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex((x: IEntity) => x.id == id);
        if (index > -1) {
            db[table][index] = record;
        }
        return record;

    };

    dbBegin = async () => {
        return new Promise((resolve) => {
            return resolve(true);
        });
    };

    dbRollback = async () => {
        return new Promise((resolve) => {
            return resolve(true);
        });
    };

    dbCommit = async (): Promise<any> => {
        await fs.writeFile('db.json', JSON.stringify(this._db, null, 4));
        this.clearCache();
    };
}

class DBSqliteProvider implements IDBProvider {
    dbFile: string;

    constructor(dbFile: string) {
        this.dbFile = dbFile;
    }

    _db: Database | null = null;

    dbConnect = async () => {
        if (this._db)
            return this._db;

        const db = new Database(this.dbFile);
        this._db = db;
        return db;
    };

    dbDisconnect = async () => {
        if (this._db) {
            this._db.close();
        }
    };

    clearCache = () => {
        this._db = null;
    };

    private prepareValue = (value: any): string => {
        if (value == null) {
            return `null`;
        } else if (typeof value == 'string') {
            return `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value == 'boolean') {
            return `${value ? 1 : 0}`;
        } else if (Array.isArray(value)) {
            return value.map(v => this.prepareValue(v)).join(', ');
        }

        return value;
    };

    private buildWhere = (where: ICondition[]) => {
        const conditions: string[] = ['1 = 1'];

        for (const cond of where) {
            const condColSql = `[${cond.column}]`;
            if (cond.value == null) {
                conditions.push(`${condColSql} is null`);
                continue;
            }

            switch (cond.operator) {
                case Operator.Equals:
                    if (cond.value == null) {
                        conditions.push(`${condColSql} is null`);
                    } else {
                        conditions.push(`${condColSql} = ${this.prepareValue(cond.value)}`);
                    }
                    break;
                case Operator.Contains:
                    conditions.push(`${condColSql} like '%' || ${this.prepareValue(cond.value)} || '%'`);
                    break;
                case Operator.StartsWith:
                    conditions.push(`${condColSql} like '%' || ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.EndsWith:
                    conditions.push(`${condColSql} like ${this.prepareValue(cond.value)} || '%'`);
                    break;
                case Operator.NotEquals:
                    if (cond.value == null) {
                        conditions.push(`${condColSql} is not null`);
                    } else {
                        conditions.push(`${condColSql} <> ${this.prepareValue(cond.value)}`);
                    }
                    break;
                case Operator.GreaterThan:
                    conditions.push(`${condColSql} > ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.LessThan:
                    conditions.push(`${condColSql} < ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.IsIn:
                    conditions.push(`${condColSql} in (${this.prepareValue(cond.value)})`);
                    break;
                case Operator.IsNotIn:
                    conditions.push(`${condColSql} not in (${this.prepareValue(cond.value)})`);
                    break;
                case Operator.IsNull:
                    conditions.push(`${condColSql} is null`);
                    break;
                case Operator.IsNotNull:
                    conditions.push(`${condColSql} is not null`);
                    break;
            }
        }
        return conditions.join(' and ');
    };

    dbTableColumns = async (table: string): Promise<string[]> => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.all(`select * from pragma_table_info('${table}')`, (err, data: any[]) => {
                if (err) {
                    return reject(err.message);
                }
                return resolve(data.map(c => c.name));
            });
        });
    };

    dbCount = async (table: string, where: ICondition[] = []): Promise<number> => {
        const db = await this.dbConnect();
        const conditions = this.buildWhere(where);
        return new Promise((resolve, reject) => {
            db.all(`select count(*) as total from ${table} where ${conditions}`, (err: Error, data: any[]) => {
                if (err) {
                    return reject(err.message);
                }
                return resolve(data[0].total as number);
            });
        });
    };

    dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = [], limit: number = 0) => {
        const db = await this.dbConnect();
        const conditions = this.buildWhere(where);
        const orders: string[] = [];
        for (const s of sort) {
            orders.push(`${s.column} ${s.direction == SortDirection.Desc ? 'desc' : ''}`);
        }

        const fetchData = async (): Promise<IEntity[]> => {
            return new Promise((resolve, reject) => {
                var sql = `select * from [${table}] where ${conditions}`;
                // console.log(table);
                // console.log(sql);
                if (orders.length) {
                    sql += ` order by ${orders.join(', ')}`;
                }
                if (limit > 0) {
                    sql += ` limit ${limit}`;
                }
                db.all(sql, async (err, data) => {
                    if (err) {
                        return reject(err.message + ' ' + sql);
                    }
                    return resolve(data as IEntity[]);
                });
            });
        };

        const results = await fetchData();
        // console.log('RESULTS:');
        // console.dir(results);        

        return { result: results, count: results.length, total: results.length } as IQueryResult<IQuery, IEntity>;
    };

    dbBegin = async () => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run('BEGIN', (err: Error) => {
                console.log('begin transaction');
                if (err) {
                    return reject(err.message);
                }

                return resolve(true);
            });
        });
    };

    dbCommit = async (): Promise<any> => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run('COMMIT', (err: Error) => {
                console.log('commit transaction');
                if (err) {
                    return reject(err.message);
                }
                this.clearCache();
                return resolve(true);
            });
        });
    };

    dbRollback = async () => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run('ROLLBACK', (err: Error) => {
                console.log('rollback transaction');
                if (err) {
                    return reject(err.message);
                }

                return resolve(true);
            });
        });
    };

    dbInsert = async (table: string, idCol:string, record: IEntity): Promise<IEntity> => {
        const db = await this.dbConnect();
        const dbTableCols = await this.dbTableColumns(table);
        const columns = Object.entries(record)
            .map(x => x[0])
            .filter(c => dbTableCols.indexOf(c) > -1)
            .join(', ');
        const values = Object.entries(record)
            .filter(x => dbTableCols.indexOf(x[0]) > -1)
            .map(x => this.prepareValue(x[1]))
            .join(', ');
        return new Promise((resolve, reject) => {
            db.run(`insert into [${table}](${columns}) values (${values})`, async (err: Error) => {
                if (err) {
                    return reject(err.message);
                }
                // if (!(db as any).changes) {
                //     return reject("Nothing inserted");
                // }

                const newid = record.id as string;
                const updatedResult = await this.dbSelect(table, [{ column: idCol, operator: Operator.Equals, value: newid } as ICondition], [], 1);
                let insertedRecord = updatedResult.count > 0 ? updatedResult.result[0] : null;
                if (!insertedRecord) {
                    return reject("could not retrieve inserted record");
                }
                return resolve(insertedRecord);
            });
        });
    };

    dbDelete = async (table: string, idCol:string, id: string): Promise<boolean> => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run(`delete from [${table}] where [${idCol}] = ${this.prepareValue(id)}`, (err: Error) => {
                if (err) {
                    return reject(err.message);
                }
                // if (!(db as any).changes) {
                //     return reject("Nothing deleted");
                // }
                return resolve(true);
            });
        });
    };

    dbUpdate = async (table: string, idCol:string, id: string, record: IEntity): Promise<IEntity> => {
        const db = await this.dbConnect();
        const dbTableCols = await this.dbTableColumns(table);
        const values = Object.entries(record)
            .filter(x => dbTableCols.indexOf(x[0]) > -1)
            .map(x => `[${x[0]}] = ${this.prepareValue(x[1])}`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(`update [${table}] set ${values} where [${idCol}] = ${this.prepareValue(id)}`, async (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    return reject(err.message);
                }

                // if (!(db as any).changes) {
                //     return reject("Nothing Updated");
                // }

                const newid = record.id || id as string;
                const updatedResult = await this.dbSelect(table, [{ column: idCol, operator: Operator.Equals, value: newid } as ICondition], [], 1);
                let updatedRecord = updatedResult.count > 0 ? updatedResult.result[0] : null;
                if (!updatedRecord) {
                    return reject("could not retrieve updated record");
                }
                return resolve(updatedRecord);
            });
        });
    };

}

export class Context {
    db: IDBProvider;

    constructor(env: Environment) {
        this.switchDBProvider(env.dbProviderType, env.dbFile);
    }

    switchDBProvider(dbProviderType: DBProviderType, dbFile: string) {
        switch (dbProviderType) {
            case DBProviderType.JSON:
                this.db = new DBJSONProvider(dbFile);
                break;
            case DBProviderType.Sqlite:
                this.db = new DBSqliteProvider(dbFile);
                break;
            default:
                this.db = new DBSqliteProvider(dbFile);
        }
    }
}

export interface MessageResponse {
    success: boolean;
    message: string;
    data: any;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    stack?: any;
}
