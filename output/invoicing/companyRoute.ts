import { express } from "express";
import { ICompanyCreate, ICompanyUpdate, ICompanyPartial, ICompanyView, isCompanyCreate, isCompanyUpdate, isCompanyPartial } from "./companyInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/company", (req, res) => {
    const data = getCompanies();
    res.json(data);
});

router.post("/company", (req, res) => {
    if(!isCompanyCreate(req.body)) {
        res.status(400).json({"message": "Invalid company"})
        return;
    }
    
    const data = createCompany(req.body as ICompanyCreate);
    res.json(data);
});

router.get("/company/:id", (req, res) => {
    const data = getCompany(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "company entity not found"})
        return;
    }
    res.json(data);
});

router.put("/company/:id", (req, res) => {
    if(!isCompanyUpdate(req.body)) {
        res.status(400).json({"message": "Invalid company"})
        return;
    }
    const data = updateCompany(req.params.id, req.body as ICompanyUpdate);
    res.json(data);
});

router.patch("/company/:id", (req, res) => {
    if(!isCompanyPartial(req.body)) {
        res.status(400).json({"message": "Invalid company"})
        return;
    }
    const data = modifyCompany(req.params.id, req.body as ICompanyPartial);
    res.json(data);
});

router.delete("/company/:id", (req, res) => {
    const data = deleteCompany(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "company entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getCompanies = ():ICompanyView[] => {
    return [{} as ICompanyView];
}

const createCompany = (company:ICompanyCreate):ICompanyView => {
    //CREATE HERE

    const created = getCompany(company.id);
    return created;
}

const getCompany = (id:string):ICompanyView => {
    //GET HERE

    var company = {};
    return company as ICompanyView;
}

const updateCompany = (id:string, company:ICompanyUpdate):ICompanyView => {
    //UPDATE HERE

    const updated = getCompany(company.id);
    return updated;
}

const modifyCompany = (id:string, company:ICompanyPartial):ICompanyView => {
    //MODIFY HERE

    const modified = getCompany(company.id || id);
    return modified;    
}

const deleteCompany = (id:string):ICompanyView => {
    const existing = getCompany(id);
    //DELETE HERE
    
    return existing;
}