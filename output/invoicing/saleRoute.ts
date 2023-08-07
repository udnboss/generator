import express from "express";
import { ISaleCreate, ISaleUpdate, ISalePartial, ISaleView } from "./saleInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { SaleBusiness } from "./saleBusiness";

export const saleRouter = express.Router();

saleRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new SaleBusiness(context);

saleRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ISaleView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

saleRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid sale" });
        return;
    }
    
    const entity = await business.create(req.body as ISaleCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "sale entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ISaleView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "sale entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid sale" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ISaleUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "sale entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid sale" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ISalePartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "sale entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ISaleView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "sale entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});