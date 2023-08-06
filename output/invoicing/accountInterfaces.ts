

export interface IAccount {
    id:string;
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountCreate {
    id:string;
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountUpdate {
    id:string;
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export interface IAccountPartial {
    id?:string;
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
}

export interface IAccountView {
    id?:string;
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
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

export const isAccountCreate = (obj: any): obj is IAccountCreate => {
    let interfaceProperites = {
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
    return implementsInterface(obj, interfaceProperites);
}

export const isAccountUpdate = (obj: any): obj is IAccountUpdate => {
    let interfaceProperites = {
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
    return implementsInterface(obj, interfaceProperites);
}

export const isAccountPartial = (obj: any): obj is IAccountPartial => {
    let interfaceProperites = {
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
    return implementsInterface(obj, interfaceProperites);
}