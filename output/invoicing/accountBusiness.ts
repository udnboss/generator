
//import { Account, AccountCreate, AccountUpdate, AccountPartial, AccountView } from "./accountClasses"
import { IAccountCreate, IAccountUpdate, IAccountPartial, IAccountView } from "./accountInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class AccountBusiness extends Business<IAccountView> {

    constructor(context:Context) {
        super(context, "account");
    }

    override createProperties: any = {
  "id": {
    "required": true,
    "type": "string"
  },
  "label": {
    "required": true,
    "type": "string"
  },
  "bank_name": {
    "required": true,
    "type": "string"
  },
  "bank_address": {
    "required": true,
    "type": "string"
  },
  "bank_swift": {
    "required": true,
    "type": "string"
  },
  "account_name": {
    "required": true,
    "type": "string"
  },
  "account_iban": {
    "required": true,
    "type": "string"
  },
  "account_address": {
    "required": true,
    "type": "string"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "string"
  },
  "label": {
    "required": true,
    "type": "string"
  },
  "bank_name": {
    "required": true,
    "type": "string"
  },
  "bank_address": {
    "required": true,
    "type": "string"
  },
  "bank_swift": {
    "required": true,
    "type": "string"
  },
  "account_name": {
    "required": true,
    "type": "string"
  },
  "account_iban": {
    "required": true,
    "type": "string"
  },
  "account_address": {
    "required": true,
    "type": "string"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "string"
  },
  "label": {
    "required": false,
    "type": "string"
  },
  "bank_name": {
    "required": false,
    "type": "string"
  },
  "bank_address": {
    "required": false,
    "type": "string"
  },
  "bank_swift": {
    "required": false,
    "type": "string"
  },
  "account_name": {
    "required": false,
    "type": "string"
  },
  "account_iban": {
    "required": false,
    "type": "string"
  },
  "account_address": {
    "required": false,
    "type": "string"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, IAccountView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, IAccountView>>;
    };

    override create = async (account:IAccountCreate):Promise<IAccountView> => {
        return super.create(account) as Promise<IAccountView>;
    };

    override getById = async (id:string):Promise<IAccountView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, account:IAccountUpdate):Promise<IAccountView> => {
        return super.update(id, account) as Promise<IAccountView>;
    };

    override modify = async (id:string, account:IAccountPartial):Promise<IAccountView> => {
        return super.modify(id, account) as Promise<IAccountView>;    
    };

    override delete = async (id:string):Promise<IAccountView> => {
        return super.delete(id) as Promise<IAccountView>;
    }; 
}