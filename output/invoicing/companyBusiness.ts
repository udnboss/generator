
//import { Company, CompanyCreate, CompanyUpdate, CompanyPartial, CompanyView } from "./companyClasses"
import { ICompanyCreate, ICompanyUpdate, ICompanyPartial, ICompanyView } from "./companyInterfaces";
import { IQueryResult, IQuery, Context, Business } from "./base";

export class CompanyBusiness extends Business<ICompanyView> {

    constructor(context:Context) {
        super(context, "company");
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
  "address": {
    "required": true,
    "type": "str"
  },
  "crn": {
    "required": true,
    "type": "str"
  },
  "trn": {
    "required": true,
    "type": "str"
  },
  "contact": {
    "required": true,
    "type": "str"
  },
  "mobile": {
    "required": true,
    "type": "str"
  },
  "email": {
    "required": true,
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
  "address": {
    "required": true,
    "type": "str"
  },
  "crn": {
    "required": true,
    "type": "str"
  },
  "trn": {
    "required": true,
    "type": "str"
  },
  "contact": {
    "required": true,
    "type": "str"
  },
  "mobile": {
    "required": true,
    "type": "str"
  },
  "email": {
    "required": true,
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
  "address": {
    "required": false,
    "type": "str"
  },
  "crn": {
    "required": false,
    "type": "str"
  },
  "trn": {
    "required": false,
    "type": "str"
  },
  "contact": {
    "required": false,
    "type": "str"
  },
  "mobile": {
    "required": false,
    "type": "str"
  },
  "email": {
    "required": false,
    "type": "str"
  }
};
    
    override getAll = async ():Promise<IQueryResult<IQuery, ICompanyView>> => {
        return super.getAll() as Promise<IQueryResult<IQuery, ICompanyView>>;
    };

    override create = async (company:ICompanyCreate):Promise<ICompanyView> => {
        return super.create(company) as Promise<ICompanyView>;
    };

    override getById = async (id:string):Promise<ICompanyView> => {
        return super.getById(id) as any;    
    };

    override update = async (id:string, company:ICompanyUpdate):Promise<ICompanyView> => {
        return super.update(id, company) as Promise<ICompanyView>;
    };

    override modify = async (id:string, company:ICompanyPartial):Promise<ICompanyView> => {
        return super.modify(id, company) as Promise<ICompanyView>;    
    };

    override delete = async (id:string):Promise<ICompanyView> => {
        return super.delete(id) as Promise<ICompanyView>;
    }; 
}