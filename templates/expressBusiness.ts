
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
    
    override getAll = async ():Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, I__EntityNameCapitalized__View>>;
    };

    override create = async (__EntityName__:I__EntityNameCapitalized__Create):Promise<I__EntityNameCapitalized__View> => {
        return super.create(__EntityName__) as Promise<I__EntityNameCapitalized__View>;
    };

    override getById = async (id:string):Promise<I__EntityNameCapitalized__View> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, __EntityName__:I__EntityNameCapitalized__Update):Promise<I__EntityNameCapitalized__View> => {
        return super.update(id, __EntityName__) as Promise<I__EntityNameCapitalized__View>;
    };

    override modify = async (id:string, __EntityName__:I__EntityNameCapitalized__Partial):Promise<I__EntityNameCapitalized__View> => {
        return super.modify(id, __EntityName__) as Promise<I__EntityNameCapitalized__View>;    
    };

    override delete = async (id:string):Promise<I__EntityNameCapitalized__View> => {
        return super.delete(id) as Promise<I__EntityNameCapitalized__View>;
    }; 
}