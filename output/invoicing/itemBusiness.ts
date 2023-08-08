
//import { Item, ItemCreate, ItemUpdate, ItemPartial, ItemView } from "./itemClasses"
import { IItemCreate, IItemUpdate, IItemPartial, IItemView } from "./itemInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class ItemBusiness extends Business<IItemView> {

    constructor(context:Context) {
        super(context, "item");
    }

    override createProperties: any = {
  "name": {
    "required": true,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    override updateProperties: any = {
  "name": {
    "required": true,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    override partialProperties: any = {
  "name": {
    "required": false,
    "type": "string"
  },
  "category_id": {
    "required": false,
    "type": "string"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, IItemView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, IItemView>>;
    };

    override create = async (item:IItemCreate):Promise<IItemView> => {
        return super.create(item) as Promise<IItemView>;
    };

    override getById = async (id:string):Promise<IItemView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, item:IItemUpdate):Promise<IItemView> => {
        return super.update(id, item) as Promise<IItemView>;
    };

    override modify = async (id:string, item:IItemPartial):Promise<IItemView> => {
        return super.modify(id, item) as Promise<IItemView>;    
    };

    override delete = async (id:string):Promise<IItemView> => {
        return super.delete(id) as Promise<IItemView>;
    }; 
}