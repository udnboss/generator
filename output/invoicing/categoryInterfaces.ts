import { IItemView } from "./itemInterfaces";

export interface ICategory {
    id:string;
    name:string;
    category_id?:string;
}

export interface ICategoryCreate {
    id:string;
    name:string;
    category_id?:string;
}

export interface ICategoryUpdate {
    id:string;
    name:string;
    category_id?:string;
}

export interface ICategoryPartial {
    id?:string;
    name?:string;
    category_id?:string;
}

export interface ICategoryView {
    id?:string;
    name?:string;
    category_id?:string;
    category?:ICategoryView;
    items?:IItemView[];
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

export const isCategoryCreate = (obj: any): obj is ICategoryCreate => {
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

export const isCategoryUpdate = (obj: any): obj is ICategoryUpdate => {
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

export const isCategoryPartial = (obj: any): obj is ICategoryPartial => {
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