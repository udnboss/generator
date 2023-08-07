import express from "express";
import { ICustomerCreate, ICustomerUpdate, ICustomerPartial, ICustomerView } from "./customerInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { CustomerBusiness } from "./customerBusiness";

export const customerRouter = express.Router();

customerRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new CustomerBusiness(context);

customerRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ICustomerView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

customerRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid customer" });
        return;
    }
    
    const entity = await business.create(req.body as ICustomerCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "customer entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICustomerView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

customerRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICustomerView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "customer entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

customerRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid customer" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ICustomerUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "customer entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICustomerView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

customerRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid customer" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ICustomerPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "customer entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICustomerView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

customerRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICustomerView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "customer entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});