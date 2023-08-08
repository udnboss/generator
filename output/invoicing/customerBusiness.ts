
//import { Customer, CustomerCreate, CustomerUpdate, CustomerPartial, CustomerView } from "./customerClasses"
import { ICustomerCreate, ICustomerUpdate, ICustomerPartial, ICustomerView } from "./customerInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CustomerBusiness extends Business<ICustomerView> {

    constructor(context:Context) {
        super(context, "customer");
    }

    override createProperties: any = {
  "name": {
    "required": true,
    "type": "string"
  },
  "address": {
    "required": false,
    "type": "string"
  },
  "contact": {
    "required": false,
    "type": "string"
  },
  "currency_id": {
    "required": false,
    "type": "string"
  },
  "payment_term": {
    "required": false,
    "type": "integer"
  }
};
    override updateProperties: any = {
  "name": {
    "required": true,
    "type": "string"
  },
  "address": {
    "required": false,
    "type": "string"
  },
  "contact": {
    "required": false,
    "type": "string"
  },
  "currency_id": {
    "required": false,
    "type": "string"
  },
  "payment_term": {
    "required": false,
    "type": "integer"
  }
};
    override partialProperties: any = {
  "name": {
    "required": false,
    "type": "string"
  },
  "address": {
    "required": false,
    "type": "string"
  },
  "contact": {
    "required": false,
    "type": "string"
  },
  "currency_id": {
    "required": false,
    "type": "string"
  },
  "payment_term": {
    "required": false,
    "type": "integer"
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