
//import { Category, CategoryCreate, CategoryUpdate, CategoryPartial, CategoryView } from "./categoryClasses"
import { ICategoryCreate, ICategoryUpdate, ICategoryPartial, ICategoryView } from "./categoryInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CategoryBusiness extends Business<ICategoryView> {

    constructor(context:Context) {
        super(context, "category");
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