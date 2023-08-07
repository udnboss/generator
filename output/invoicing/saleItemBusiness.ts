
//import { Saleitem, SaleitemCreate, SaleitemUpdate, SaleitemPartial, SaleitemView } from "./saleItemClasses"
import { ISaleitemCreate, ISaleitemUpdate, ISaleitemPartial, ISaleitemView } from "./saleItemInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class SaleitemBusiness extends Business<ISaleitemView> {

    constructor(context:Context) {
        super(context, "saleItem");
    }

    override createProperties: any = {
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
    override updateProperties: any = {
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
    override partialProperties: any = {
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
    
    override getAll = async ():Promise<IQueryResult<IQuery, ISaleitemView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ISaleitemView>>;
    };

    override create = async (saleItem:ISaleitemCreate):Promise<ISaleitemView> => {
        return super.create(saleItem) as Promise<ISaleitemView>;
    };

    override getById = async (id:string):Promise<ISaleitemView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, saleItem:ISaleitemUpdate):Promise<ISaleitemView> => {
        return super.update(id, saleItem) as Promise<ISaleitemView>;
    };

    override modify = async (id:string, saleItem:ISaleitemPartial):Promise<ISaleitemView> => {
        return super.modify(id, saleItem) as Promise<ISaleitemView>;    
    };

    override delete = async (id:string):Promise<ISaleitemView> => {
        return super.delete(id) as Promise<ISaleitemView>;
    }; 
}