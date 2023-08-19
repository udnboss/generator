
//import { __EntityNameCapitalized__, __EntityNameCapitalized__Create, __EntityNameCapitalized__Update, __EntityNameCapitalized__Partial, __EntityNameCapitalized__View } from "./__EntityName__Classes"
import { I__EntityNameCapitalized__Create, I__EntityNameCapitalized__Update, I__EntityNameCapitalized__Partial, I__EntityNameCapitalized__View } from "./__EntityName__Interfaces";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IQueryResult, IQuery, Context, Business, IDataQuery, ICondition, Operator } from "./base";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { randomUUID } from "crypto";

__EntityBusinessImports__

export class __EntityNameCapitalized__Business extends Business<I__EntityNameCapitalized__View> {

    constructor(context:Context) {
        super(context, "__EntityName__");
    }
    // override idProperty:string = 'id';
    override createProperties: any = __EntityCreateTypeProperties__;
    override updateProperties: any = __EntityUpdateTypeProperties__;
    override partialProperties: any = __EntityPartialTypeProperties__;
    override queryProperties: any = __EntityQueryTypeProperties__;
    override sortableProperties: any = [__EntitySortableProperties__];
    
    override async getAll(query:IDataQuery, maxDepth:number = 1):Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>> {
        return super.getAll(query, maxDepth) as Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>>;
    }

    override async create(__EntityName__:I__EntityNameCapitalized__Create):Promise<I__EntityNameCapitalized__View> {        
        
        __EntityAutoCreateId__

        return super.create(__EntityName__) as Promise<I__EntityNameCapitalized__View>;
    }

    override async getById(id:string, maxDepth:number = 1):Promise<I__EntityNameCapitalized__View> {
        const __EntityName__ = await super.getById(id);

        maxDepth--;

        __GetReferencedEntitiesById__

        return __EntityName__;    
    }

    override async update(id:string, __EntityName__:I__EntityNameCapitalized__Update):Promise<I__EntityNameCapitalized__View> {
        return super.update(id, __EntityName__) as Promise<I__EntityNameCapitalized__View>;
    }

    override async modify(id:string, __EntityName__:I__EntityNameCapitalized__Partial):Promise<I__EntityNameCapitalized__View> {
        return super.modify(id, __EntityName__) as Promise<I__EntityNameCapitalized__View>;    
    }

    override async delete(id:string):Promise<I__EntityNameCapitalized__View> {
        return super.delete(id) as Promise<I__EntityNameCapitalized__View>;
    }
}