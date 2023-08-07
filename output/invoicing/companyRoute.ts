import express from "express";
import { ICompanyCreate, ICompanyUpdate, ICompanyPartial, ICompanyView } from "./companyInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { CompanyBusiness } from "./companyBusiness";

export const companyRouter = express.Router();

companyRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new CompanyBusiness(context);

companyRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ICompanyView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

companyRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid company" });
        return;
    }
    
    const entity = await business.create(req.body as ICompanyCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "company entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICompanyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

companyRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICompanyView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "company entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

companyRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid company" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ICompanyUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "company entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICompanyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

companyRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid company" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ICompanyPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "company entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICompanyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

companyRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICompanyView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "company entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});