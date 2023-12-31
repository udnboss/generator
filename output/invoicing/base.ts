import { promises as fs } from 'fs';
import { Database } from 'sqlite3';

export enum Operator {
    Equals,
    NotEquals,
    GreaterThan,
    LessThan,
    IsNull,
    IsNotNull,
    IsIn,
    IsNotIn,
    StartsWith,
    EndsWith,
    Contains
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc'
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

export interface IQuery {
    sortby: string;
    sortdir: string;
    search: string;
    page: number;
    pageSize: number;
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
    createProperties: any;
    updateProperties: any;
    partialProperties: any;
    entityName: string;
    getAll?: () => Promise<IQueryResult<IQuery, TOutput>>;
    getById?: (id: string) => Promise<TOutput>;
    create?: <T extends IEntity>(entity: T) => Promise<TOutput>;
    update?: <T extends IEntity>(id: string, entity: T) => Promise<TOutput>;
    modify?: <T extends IEntity>(id: string, entity: T) => Promise<TOutput>;
    delete?: (id: string) => Promise<TOutput>;
    isEntity?: <T extends IEntity>(entity: T) => boolean;
}

export abstract class Business<TOutput extends IEntity> implements IBusiness<TOutput> {
    createProperties: { id: { type: "string", required: true } };
    updateProperties: { id: { type: "string", required: true } };
    partialProperties: { id: { type: "string", required: false } };
    private db: IDBProvider;
    private context: Context;
    entityName: string;

    constructor(context: Context, entityName: string) {
        this.context = context;
        this.db = context.db;
        this.entityName = entityName;
    }

    private implementsInterface = (obj: { [key: string]: any }, interfaceProperites: { [key: string]: any }): boolean => {
        if (obj == null) {
            return false; //empty or null object
        }

        let expectedKeys = interfaceProperites; //required keys
        for (let key in expectedKeys) {
            let isRequired = expectedKeys[key].required;
            if (isRequired && !(key in obj)) {
                return false; //missing required property
            }
            let value = obj[key];
            let expectedType = expectedKeys[key].type;
            if (expectedType != 'array' && typeof value !== expectedType) {
                return false; //primitive type not matching           
            } else {
                let expectedSubType = expectedKeys[key].subtype;
                if (!Array.isArray(value) || !value.every(item => typeof item === expectedSubType)) {
                    return false; //array type not matching or items not of expected subtype
                }
            }
        }

        for (let key in obj) {
            if (!expectedKeys.include(key)) {
                return false; //extra properties found
            }
        }

        return true;
    };

    isCreate = (obj: { [key: string]: any }): boolean => {
        return this.implementsInterface(obj, this.createProperties);
    };

    isUpdate = (obj: { [key: string]: any }): boolean => {
        return this.implementsInterface(obj, this.updateProperties);
    };

    isPartial = (obj: { [key: string]: any }): boolean => {
        return this.implementsInterface(obj, this.partialProperties);
    };

    getAll = async (): Promise<IQueryResult<IQuery, TOutput>> => {
        return this.db.dbSelect(this.entityName) as Promise<IQueryResult<IQuery, TOutput>>;
    };

    getById = async (id: string): Promise<TOutput> => {
        const dbResult = await this.db.dbSelect(this.entityName,
            [{ column: 'id', operator: Operator.Equals, value: id } as ICondition]);
        if (dbResult.count == 0) {
            throw new Error("Not Found");
        }
        return dbResult.result[0] as TOutput;
    };

    create = async (entity: IEntity): Promise<TOutput> => {
        const dbResult = await this.db.dbInsert(this.entityName, entity as IEntity) as TOutput;
        return dbResult;
    };

    update = async (id: string, entity: IEntity): Promise<TOutput> => {
        const dbResult = await this.db.dbUpdate(id, this.entityName, entity as IEntity) as TOutput;
        return dbResult;
    };

    modify = async (id: string, entity: IEntity): Promise<TOutput> => {
        const dbResult = await this.db.dbUpdate(id, this.entityName, entity as IEntity) as TOutput;
        return dbResult;
    };

    delete = async (id: string): Promise<TOutput> => {
        const entity = await this.getById(id) as TOutput;
        const deleted = await this.db.dbDelete(this.entityName, id);
        if (!deleted) {
            throw new Error("Could not Delete");
        }
        return entity;
    };


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
    dbSelect: (table: string, where?: ICondition[], sort?: ISort[]) => Promise<IQueryResult<IQuery, IEntity>>;
    dbInsert: (table: string, record: IEntity) => Promise<IEntity>;
    dbUpdate: (table: string, id: string, record: IEntity) => Promise<IEntity>;
    dbDelete: (table: string, id: string) => Promise<boolean>;
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

    dbSelect = async (table: string, where: ICondition[] = [], sort: ISort[] = []) => {
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

        return { result: results, count: results.length, total: results.length } as IQueryResult<IQuery, IEntity>;
    };

    dbInsert = async (table: string, record: IEntity) => {
        const db = await this.dbConnect();
        db[table].push(record);
        return record;
    };

    dbDelete = async (table: string, id: string) => {
        const db = await this.dbConnect();
        const index = db[table].findIndex((x: IEntity) => x.id == id);
        if (index > -1) {
            (db[table] as []).splice(index, 1);
            return true;
        }
        return false;
    };

    dbUpdate = async (table: string, id: string, record: IEntity) => {
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
            if (cond.value == null) {
                conditions.push(`${cond.column} is null`);
                continue;
            }

            switch (cond.operator) {
                case Operator.Equals:
                    if (cond.value == null) {
                        conditions.push(`${cond.column} is null`);
                    } else {
                        conditions.push(`${cond.column} = ${this.prepareValue(cond.value)}`);
                    }
                    break;
                case Operator.Contains:
                    conditions.push(`${cond.column} like '%' || ${this.prepareValue(cond.value)} || '%'`);
                    break;
                case Operator.StartsWith:
                    conditions.push(`${cond.column} like '%' || ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.EndsWith:
                    conditions.push(`${cond.column} like ${this.prepareValue(cond.value)} || '%'`);
                    break;
                case Operator.NotEquals:
                    if (cond.value == null) {
                        conditions.push(`${cond.column} is not null`);
                    } else {
                        conditions.push(`${cond.column} <> ${this.prepareValue(cond.value)}`);
                    }
                    break;
                case Operator.GreaterThan:
                    conditions.push(`${cond.column} > ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.LessThan:
                    conditions.push(`${cond.column} < ${this.prepareValue(cond.value)}`);
                    break;
                case Operator.IsIn:
                    conditions.push(`${cond.column} in (${this.prepareValue(cond.value)})`);
                    break;
                case Operator.IsNotIn:
                    conditions.push(`${cond.column} not in (${this.prepareValue(cond.value)})`);
                    break;
                case Operator.IsNull:
                    conditions.push(`${cond.column} is null`);
                    break;
                case Operator.IsNotNull:
                    conditions.push(`${cond.column} is not null`);
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
                var sql = `select * from ${table} where ${conditions}`;
                if (orders.length) {
                    sql += ` order by ${orders.join(', ')}`;
                }
                if (limit > 0) {
                    sql += ` limit ${limit}`;
                }
                db.all(sql, (err, data) => {
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

    dbInsert = async (table: string, record: IEntity): Promise<IEntity> => {
        const db = await this.dbConnect();
        const dbTableCols = await this.dbTableColumns(table);
        const columns = Object.entries(record).map(x => x[0]).filter(c => dbTableCols.indexOf(c) > -1).join(', ');
        const values = Object.entries(record).filter(x => dbTableCols.indexOf(x[0]) > -1).map(x => this.prepareValue(x[1])).join(', ');
        return new Promise((resolve, reject) => {
            db.run(`insert into ${table}(${columns}) select ${values}`, (err: Error) => {
                if (err) {
                    return reject(err.message);
                }

                return resolve(record);
            });
        });
    };

    dbDelete = async (table: string, id: string): Promise<boolean> => {
        const db = await this.dbConnect();
        return new Promise((resolve, reject) => {
            db.run(`delete from ${table} where id = ${this.prepareValue(id)}`, (err: Error) => {
                if (err) {
                    return reject(err.message);
                }
                return resolve(true);
            });
        });
    };

    dbUpdate = async (table: string, id: string, record: IEntity): Promise<IEntity> => {
        const db = await this.dbConnect();
        const dbTableCols = await this.dbTableColumns(table);
        const values = Object.entries(record)
            .filter(x => dbTableCols.indexOf(x[0]) > -1)
            .map(x => `${x[0]} = ${this.prepareValue(x[1])}`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(`update ${table} set ${values} where id = ${this.prepareValue(id)}`, (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    return reject(err.message);
                }
                return resolve(record);
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
}
