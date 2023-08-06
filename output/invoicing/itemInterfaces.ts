import { ICategoryView } from "./categoryInterfaces";

export interface IItem {
    id:string;
    name:string;
    category_id?:string;
}

export interface IItemCreate {
    id:string;
    name:string;
    category_id?:string;
}

export interface IItemUpdate {
    id:string;
    name:string;
    category_id?:string;
}

export interface IItemPartial {
    id?:string;
    name?:string;
    category_id?:string;
}

export interface IItemView {
    id?:string;
    name?:string;
    category_id?:string;
    category?:ICategoryView;
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

export const isItemCreate = (obj: any): obj is IItemCreate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "name": {
    "required": true,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isItemUpdate = (obj: any): obj is IItemUpdate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "name": {
    "required": true,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isItemPartial = (obj: any): obj is IItemPartial => {
    let interfaceProperites = {
  "id": {
    "required": false,
    "type": "string"
  },
  "name": {
    "required": false,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    return implementsInterface(obj, interfaceProperites);
}