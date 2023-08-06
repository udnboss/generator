

export interface ICurrency {
    id:string;
    name:string;
    symbol:string;
}

export interface ICurrencyCreate {
    id:string;
    name:string;
    symbol:string;
}

export interface ICurrencyUpdate {
    id:string;
    name:string;
    symbol:string;
}

export interface ICurrencyPartial {
    id?:string;
    name?:string;
    symbol?:string;
}

export interface ICurrencyView {
    id?:string;
    name?:string;
    symbol?:string;
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

export const isCurrencyCreate = (obj: any): obj is ICurrencyCreate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "name": {
    "required": true,
    "type": "string"
  },
  "symbol": {
    "required": true,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isCurrencyUpdate = (obj: any): obj is ICurrencyUpdate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "name": {
    "required": true,
    "type": "string"
  },
  "symbol": {
    "required": true,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isCurrencyPartial = (obj: any): obj is ICurrencyPartial => {
    let interfaceProperites = {
  "id": {
    "required": false,
    "type": "string"
  },
  "name": {
    "required": false,
    "type": "string"
  },
  "symbol": {
    "required": false,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}