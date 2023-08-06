import { ICurrencyView } from "./currencyInterfaces";
import { ICustomerView } from "./customerInterfaces";
import { IAccountView } from "./accountInterfaces";
import { ICompanyView } from "./companyInterfaces";
import { ISaleitemView } from "./saleItemInterfaces";

export interface ISale {
    id:string;
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    date:string;
    currency_id:string;
    total:number;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleCreate {
    id:string;
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    date:string;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleUpdate {
    id:string;
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISalePartial {
    id?:string;
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    number?:number;
    currency_id?:string;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
}

export interface ISaleView {
    id?:string;
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    number?:number;
    date?:string;
    currency_id?:string;
    total?:number;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
    currency?:ICurrencyView;
    customer?:ICustomerView;
    account?:IAccountView;
    company?:ICompanyView;
    items?:ISaleitemView[];
}

const implementsInterface = (obj: any, interfaceProperites): boolean => {
    if (obj == null) {
        return false; //empty or null object
    }

    let expectedKeys = interfaceProperites; //required keys
    for (let key of expectedKeys) {
        let isRequired = expectedKeys[key].required;
        if (isRequired && !(key in obj)) {
            return false; //missing required property
        }
        let value = obj[key];
        let expectedType = expectedKeys[key].type;
        if(expectedType != 'array' && typeof value !== expectedType) {
            return false; //primitive type not matching           
        }
        else {
            let expectedSubType = expectedKeys[key].subtype;
            if(!Array.isArray(value) || !value.every(item => typeof item === expectedSubType)) {
                return false; //array type not matching or items not of expected subtype
            }
        }
    }

    for (let key in obj) {
        if(!expectedKeys.include(key)){
            return false; //extra properties found
        }
    }

    return true;
}

export const isSaleCreate = (obj: any): obj is ISaleCreate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
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
  "number": {
    "required": true,
    "type": "integer"
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
    return implementsInterface(obj, interfaceProperites);
}

export const isSaleUpdate = (obj: any): obj is ISaleUpdate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
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
  "number": {
    "required": true,
    "type": "integer"
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
    return implementsInterface(obj, interfaceProperites);
}

export const isSalePartial = (obj: any): obj is ISalePartial => {
    let interfaceProperites = {
  "id": {
    "required": false,
    "type": "string"
  },
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
  "number": {
    "required": false,
    "type": "integer"
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
    return implementsInterface(obj, interfaceProperites);
}