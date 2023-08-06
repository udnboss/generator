import { ICurrencyView } from "./currencyInterfaces";
import { ISaleView } from "./saleInterfaces";

export interface ICustomer {
    id:string;
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerCreate {
    id:string;
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerUpdate {
    id:string;
    name:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerPartial {
    id?:string;
    name?:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    payment_term?:number;
}

export interface ICustomerView {
    id?:string;
    name?:string;
    address?:string;
    contact?:string;
    currency_id?:string;
    currency?:ICurrencyView;
    payment_term?:number;
    sales?:ISaleView[];
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

export const isCustomerCreate = (obj: any): obj is ICustomerCreate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
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
    return implementsInterface(obj, interfaceProperites);
}

export const isCustomerUpdate = (obj: any): obj is ICustomerUpdate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
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
    return implementsInterface(obj, interfaceProperites);
}

export const isCustomerPartial = (obj: any): obj is ICustomerPartial => {
    let interfaceProperites = {
  "id": {
    "required": false,
    "type": "string"
  },
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
    return implementsInterface(obj, interfaceProperites);
}