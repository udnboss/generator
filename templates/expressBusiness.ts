
//import { __EntityNameCapitalized__, __EntityNameCapitalized__Create, __EntityNameCapitalized__Update, __EntityNameCapitalized__Partial, __EntityNameCapitalized__View } from "./__EntityName__Classes"
import { I__EntityNameCapitalized__Create, I__EntityNameCapitalized__Update, I__EntityNameCapitalized__Partial, I__EntityNameCapitalized__View } from "./__EntityName__Interfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class __EntityNameCapitalized__Business extends Business<I__EntityNameCapitalized__View> {

    constructor(context:Context) {
        super(context, "__EntityName__");
    }

    override createProperties: any = __EntityCreateTypeProperties__;
    override updateProperties: any = __EntityUpdateTypeProperties__;
    override partialProperties: any = __EntityPartialTypeProperties__;
    
    override async getAll():Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>> {
        return super.getAll() as Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>>;
    }

    override async create(__EntityName__:I__EntityNameCapitalized__Create):Promise<I__EntityNameCapitalized__View> {
        return super.create(__EntityName__) as Promise<I__EntityNameCapitalized__View>;
    }

    override async getById(id:string):Promise<I__EntityNameCapitalized__View> {
        return super.getById(id) as any;    
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