
//import { Sale, SaleCreate, SaleUpdate, SalePartial, SaleView } from "./saleClasses"
import { ISaleCreate, ISaleUpdate, ISalePartial, ISaleView } from "./saleInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class SaleBusiness extends Business<ISaleView> {

    constructor(context:Context) {
        super(context, "sale");
    }

    override createProperties: any = {
  "company_id": {
    "required": true,
    "type": "string"
  },
  "account_id": {
    "required": true,
    "type": "string"
  },
  "customer_id": {
    "required": true,
    "type": "string"
  },
  "place": {
    "required": false,
    "type": "string"
  },
  "date": {
    "required": true,
    "type": "string"
  },
  "currency_id": {
    "required": true,
    "type": "string"
  },
  "reference": {
    "required": false,
    "type": "string"
  },
  "confirmed": {
    "required": true,
    "type": "boolean"
  },
  "reference_date": {
    "required": false,
    "type": "string"
  },
  "due_date": {
    "required": false,
    "type": "string"
  }
};
    override updateProperties: any = {
  "company_id": {
    "required": true,
    "type": "string"
  },
  "account_id": {
    "required": true,
    "type": "string"
  },
  "customer_id": {
    "required": true,
    "type": "string"
  },
  "place": {
    "required": false,
    "type": "string"
  },
  "currency_id": {
    "required": true,
    "type": "string"
  },
  "reference": {
    "required": false,
    "type": "string"
  },
  "confirmed": {
    "required": true,
    "type": "boolean"
  },
  "reference_date": {
    "required": false,
    "type": "string"
  },
  "due_date": {
    "required": false,
    "type": "string"
  }
};
    override partialProperties: any = {
  "company_id": {
    "required": false,
    "type": "string"
  },
  "account_id": {
    "required": false,
    "type": "string"
  },
  "customer_id": {
    "required": false,
    "type": "string"
  },
  "place": {
    "required": false,
    "type": "string"
  },
  "currency_id": {
    "required": false,
    "type": "string"
  },
  "reference": {
    "required": false,
    "type": "string"
  },
  "confirmed": {
    "required": false,
    "type": "boolean"
  },
  "reference_date": {
    "required": false,
    "type": "string"
  },
  "due_date": {
    "required": false,
    "type": "string"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, ISaleView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ISaleView>>;
    };

    override create = async (sale:ISaleCreate):Promise<ISaleView> => {
        return super.create(sale) as Promise<ISaleView>;
    };

    override getById = async (id:string):Promise<ISaleView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, sale:ISaleUpdate):Promise<ISaleView> => {
        return super.update(id, sale) as Promise<ISaleView>;
    };

    override modify = async (id:string, sale:ISalePartial):Promise<ISaleView> => {
        return super.modify(id, sale) as Promise<ISaleView>;    
    };

    override delete = async (id:string):Promise<ISaleView> => {
        return super.delete(id) as Promise<ISaleView>;
    }; 
}