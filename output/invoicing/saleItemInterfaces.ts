import { ISaleView } from "./saleInterfaces";
import { IItemView } from "./itemInterfaces";

export interface ISaleitem {
    id:string;
    sale_id:string;
    item_id:string;
    description:string;
    quantity:number;
    price:number;
}

export interface ISaleitemCreate {
    id:string;
    sale_id:string;
    item_id:string;
    description:string;
    quantity:number;
    price:number;
}

export interface ISaleitemUpdate {
    id:string;
    sale_id:string;
    item_id:string;
    description:string;
    quantity:number;
    price:number;
}

export interface ISaleitemPartial {
    id?:string;
    sale_id?:string;
    item_id?:string;
    description?:string;
    quantity?:number;
    price?:number;
}

export interface ISaleitemView {
    id?:string;
    sale_id?:string;
    item_id?:string;
    description?:string;
    quantity?:number;
    price?:number;
    sale?:ISaleView;
    item?:IItemView;
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

export const isSaleitemCreate = (obj: any): obj is ISaleitemCreate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "sale_id": {
    "required": true,
    "type": "string"
  },
  "item_id": {
    "required": true,
    "type": "string"
  },
  "description": {
    "required": true,
    "type": "string"
  },
  "quantity": {
    "required": true,
    "type": "number"
  },
  "price": {
    "required": true,
    "type": "number"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isSaleitemUpdate = (obj: any): obj is ISaleitemUpdate => {
    let interfaceProperites = {
  "id": {
    "required": true,
    "type": "string"
  },
  "sale_id": {
    "required": true,
    "type": "string"
  },
  "item_id": {
    "required": true,
    "type": "string"
  },
  "description": {
    "required": true,
    "type": "string"
  },
  "quantity": {
    "required": true,
    "type": "number"
  },
  "price": {
    "required": true,
    "type": "number"
  }
};
    return implementsInterface(obj, interfaceProperites);
}

export const isSaleitemPartial = (obj: any): obj is ISaleitemPartial => {
    let interfaceProperites = {
  "id": {
    "required": false,
    "type": "string"
  },
  "sale_id": {
    "required": false,
    "type": "string"
  },
  "item_id": {
    "required": false,
    "type": "string"
  },
  "description": {
    "required": false,
    "type": "string"
  },
  "quantity": {
    "required": false,
    "type": "number"
  },
  "price": {
    "required": false,
    "type": "number"
  }
};
    return implementsInterface(obj, interfaceProperites);
}