
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
    "type": "str"
  },
  "sale_id": {
    "required": true,
    "type": "str"
  },
  "item_id": {
    "required": true,
    "type": "str"
  },
  "description": {
    "required": true,
    "type": "str"
  },
  "quantity": {
    "required": true,
    "type": "int"
  },
  "price": {
    "required": true,
    "type": "float"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "sale_id": {
    "required": true,
    "type": "str"
  },
  "item_id": {
    "required": true,
    "type": "str"
  },
  "description": {
    "required": true,
    "type": "str"
  },
  "quantity": {
    "required": true,
    "type": "int"
  },
  "price": {
    "required": true,
    "type": "float"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "str"
  },
  "sale_id": {
    "required": false,
    "type": "str"
  },
  "item_id": {
    "required": false,
    "type": "str"
  },
  "description": {
    "required": false,
    "type": "str"
  },
  "quantity": {
    "required": false,
    "type": "int"
  },
  "price": {
    "required": false,
    "type": "float"
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