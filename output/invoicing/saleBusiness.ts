
//import { Sale, SaleCreate, SaleUpdate, SalePartial, SaleView } from "./saleClasses"
import { ISaleCreate, ISaleUpdate, ISalePartial, ISaleView } from "./saleInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class SaleBusiness extends Business<ISaleView> {

    constructor(context:Context) {
        super(context, "sale");
    }

    override createProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "company_id": {
    "required": true,
    "type": "str"
  },
  "account_id": {
    "required": true,
    "type": "str"
  },
  "customer_id": {
    "required": true,
    "type": "str"
  },
  "place": {
    "required": false,
    "type": "str"
  },
  "number": {
    "required": true,
    "type": "int"
  },
  "date": {
    "required": true,
    "type": "date"
  },
  "currency_id": {
    "required": true,
    "type": "str"
  },
  "reference": {
    "required": false,
    "type": "str"
  },
  "confirmed": {
    "required": true,
    "type": "bool"
  },
  "reference_date": {
    "required": false,
    "type": "date"
  },
  "due_date": {
    "required": false,
    "type": "date"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "company_id": {
    "required": true,
    "type": "str"
  },
  "account_id": {
    "required": true,
    "type": "str"
  },
  "customer_id": {
    "required": true,
    "type": "str"
  },
  "place": {
    "required": false,
    "type": "str"
  },
  "number": {
    "required": true,
    "type": "int"
  },
  "currency_id": {
    "required": true,
    "type": "str"
  },
  "reference": {
    "required": false,
    "type": "str"
  },
  "confirmed": {
    "required": true,
    "type": "bool"
  },
  "reference_date": {
    "required": false,
    "type": "date"
  },
  "due_date": {
    "required": false,
    "type": "date"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "str"
  },
  "company_id": {
    "required": false,
    "type": "str"
  },
  "account_id": {
    "required": false,
    "type": "str"
  },
  "customer_id": {
    "required": false,
    "type": "str"
  },
  "place": {
    "required": false,
    "type": "str"
  },
  "number": {
    "required": false,
    "type": "int"
  },
  "currency_id": {
    "required": false,
    "type": "str"
  },
  "reference": {
    "required": false,
    "type": "str"
  },
  "confirmed": {
    "required": false,
    "type": "bool"
  },
  "reference_date": {
    "required": false,
    "type": "date"
  },
  "due_date": {
    "required": false,
    "type": "date"
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