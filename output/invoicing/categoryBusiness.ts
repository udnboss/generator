
//import { Category, CategoryCreate, CategoryUpdate, CategoryPartial, CategoryView } from "./categoryClasses"
import { ICategoryCreate, ICategoryUpdate, ICategoryPartial, ICategoryView } from "./categoryInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CategoryBusiness extends Business<ICategoryView> {

    constructor(context:Context) {
        super(context, "category");
    }

    override createProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "name": {
    "required": true,
    "type": "str"
  },
  "category_id": {
    "required": false,
    "type": "str"
  }
};
    override updateProperties: any = {
  "id": {
    "required": true,
    "type": "str"
  },
  "name": {
    "required": true,
    "type": "str"
  },
  "category_id": {
    "required": false,
    "type": "str"
  }
};
    override partialProperties: any = {
  "id": {
    "required": false,
    "type": "str"
  },
  "name": {
    "required": false,
    "type": "str"
  },
  "category_id": {
    "required": false,
    "type": "str"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, ICategoryView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ICategoryView>>;
    };

    override create = async (category:ICategoryCreate):Promise<ICategoryView> => {
        return super.create(category) as Promise<ICategoryView>;
    };

    override getById = async (id:string):Promise<ICategoryView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, category:ICategoryUpdate):Promise<ICategoryView> => {
        return super.update(id, category) as Promise<ICategoryView>;
    };

    override modify = async (id:string, category:ICategoryPartial):Promise<ICategoryView> => {
        return super.modify(id, category) as Promise<ICategoryView>;    
    };

    override delete = async (id:string):Promise<ICategoryView> => {
        return super.delete(id) as Promise<ICategoryView>;
    }; 
}