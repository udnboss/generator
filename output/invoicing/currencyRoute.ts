import express from "express";
import { ICurrencyCreate, ICurrencyUpdate, ICurrencyPartial, ICurrencyView } from "./currencyInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { CurrencyBusiness } from "./currencyBusiness";

export const currencyRouter = express.Router();

currencyRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new CurrencyBusiness(context);

currencyRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ICurrencyView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

currencyRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid currency" });
        return;
    }
    
    const entity = await business.create(req.body as ICurrencyCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "currency entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICurrencyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

currencyRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICurrencyView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "currency entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

currencyRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid currency" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ICurrencyUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "currency entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICurrencyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

currencyRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid currency" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ICurrencyPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "currency entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICurrencyView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

currencyRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICurrencyView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "currency entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});