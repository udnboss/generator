
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
    "type": "str"
  },
  "label": {
    "required": true,
    "type": "str"
  },
  "bank_name": {
    "required": true,
    "type": "str"
  },
  "bank_address": {
    "required": true,
    "type": "str"
  },
  "bank_swift": {
    "required": true,
    "type": "str"
  },
  "account_name": {
    "required": true,
    "type": "str"
  },
  "account_iban": {
    "required": true,
    "type": "str"
  },
  "account_address": {
    "required": true,
    "type": "str"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "label": {
    "required": true,
    "type": "str"
  },
  "bank_name": {
    "required": true,
    "type": "str"
  },
  "bank_address": {
    "required": true,
    "type": "str"
  },
  "bank_swift": {
    "required": true,
    "type": "str"
  },
  "account_name": {
    "required": true,
    "type": "str"
  },
  "account_iban": {
    "required": true,
    "type": "str"
  },
  "account_address": {
    "required": true,
    "type": "str"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "str"
  },
  "label": {
    "required": false,
    "type": "str"
  },
  "bank_name": {
    "required": false,
    "type": "str"
  },
  "bank_address": {
    "required": false,
    "type": "str"
  },
  "bank_swift": {
    "required": false,
    "type": "str"
  },
  "account_name": {
    "required": false,
    "type": "str"
  },
  "account_iban": {
    "required": false,
    "type": "str"
  },
  "account_address": {
    "required": false,
    "type": "str"
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