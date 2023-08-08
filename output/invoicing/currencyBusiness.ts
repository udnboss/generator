
//import { Currency, CurrencyCreate, CurrencyUpdate, CurrencyPartial, CurrencyView } from "./currencyClasses"
import { ICurrencyCreate, ICurrencyUpdate, ICurrencyPartial, ICurrencyView } from "./currencyInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CurrencyBusiness extends Business<ICurrencyView> {

    constructor(context:Context) {
        super(context, "currency");
    }

    override createProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "name": {
    "required": true,
    "type": "str"
  },
  "symbol": {
    "required": true,
    "type": "str"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "name": {
    "required": true,
    "type": "str"
  },
  "symbol": {
    "required": true,
    "type": "str"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "str"
  },
  "name": {
    "required": false,
    "type": "str"
  },
  "symbol": {
    "required": false,
    "type": "str"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, ICurrencyView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ICurrencyView>>;
    };

    override create = async (currency:ICurrencyCreate):Promise<ICurrencyView> => {
        return super.create(currency) as Promise<ICurrencyView>;
    };

    override getById = async (id:string):Promise<ICurrencyView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, currency:ICurrencyUpdate):Promise<ICurrencyView> => {
        return super.update(id, currency) as Promise<ICurrencyView>;
    };

    override modify = async (id:string, currency:ICurrencyPartial):Promise<ICurrencyView> => {
        return super.modify(id, currency) as Promise<ICurrencyView>;    
    };

    override delete = async (id:string):Promise<ICurrencyView> => {
        return super.delete(id) as Promise<ICurrencyView>;
    }; 
}