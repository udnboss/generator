

export interface ICompany {
    id:string;
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyCreate {
    id:string;
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyUpdate {
    id:string;
    name:string;
    address:string;
    crn:string;
    trn:string;
    contact:string;
    mobile:string;
    email:string;
}

export interface ICompanyPartial {
    id?:string;
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
}

export interface ICompanyView {
    id?:string;
    name?:string;
    address?:string;
    crn?:string;
    trn?:string;
    contact?:string;
    mobile?:string;
    email?:string;
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

export const isCompanyCreate = (obj: any): obj is ICompanyCreate => {
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
    "required": true,
    "type": "string"
  },
  "crn": {
    "required": true,
    "type": "string"
  },
  "trn": {
    "required": true,
    "type": "string"
  },
  "contact": {
    "required": true,
    "type": "string"
  },
  "mobile": {
    "required": true,
    "type": "string"
  },
  "email": {
    "required": true,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isCompanyUpdate = (obj: any): obj is ICompanyUpdate => {
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
    "required": true,
    "type": "string"
  },
  "crn": {
    "required": true,
    "type": "string"
  },
  "trn": {
    "required": true,
    "type": "string"
  },
  "contact": {
    "required": true,
    "type": "string"
  },
  "mobile": {
    "required": true,
    "type": "string"
  },
  "email": {
    "required": true,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isCompanyPartial = (obj: any): obj is ICompanyPartial => {
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
  "crn": {
    "required": false,
    "type": "string"
  },
  "trn": {
    "required": false,
    "type": "string"
  },
  "contact": {
    "required": false,
    "type": "string"
  },
  "mobile": {
    "required": false,
    "type": "string"
  },
  "email": {
    "required": false,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}