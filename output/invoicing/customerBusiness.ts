
//import { Customer, CustomerCreate, CustomerUpdate, CustomerPartial, CustomerView } from "./customerClasses"
import { ICustomerCreate, ICustomerUpdate, ICustomerPartial, ICustomerView } from "./customerInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CustomerBusiness extends Business<ICustomerView> {

    constructor(context:Context) {
        super(context, "customer");
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
  "address": {
    "required": false,
    "type": "str"
  },
  "contact": {
    "required": false,
    "type": "str"
  },
  "currency_id": {
    "required": false,
    "type": "str"
  },
  "payment_term": {
    "required": false,
    "type": "int"
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
  "address": {
    "required": false,
    "type": "str"
  },
  "contact": {
    "required": false,
    "type": "str"
  },
  "currency_id": {
    "required": false,
    "type": "str"
  },
  "payment_term": {
    "required": false,
    "type": "int"
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
  "address": {
    "required": false,
    "type": "str"
  },
  "contact": {
    "required": false,
    "type": "str"
  },
  "currency_id": {
    "required": false,
    "type": "str"
  },
  "payment_term": {
    "required": false,
    "type": "int"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, ICustomerView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ICustomerView>>;
    };

    override create = async (customer:ICustomerCreate):Promise<ICustomerView> => {
        return super.create(customer) as Promise<ICustomerView>;
    };

    override getById = async (id:string):Promise<ICustomerView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, customer:ICustomerUpdate):Promise<ICustomerView> => {
        return super.update(id, customer) as Promise<ICustomerView>;
    };

    override modify = async (id:string, customer:ICustomerPartial):Promise<ICustomerView> => {
        return super.modify(id, customer) as Promise<ICustomerView>;    
    };

    override delete = async (id:string):Promise<ICustomerView> => {
        return super.delete(id) as Promise<ICustomerView>;
    }; 
}