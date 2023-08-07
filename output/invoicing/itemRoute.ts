import express from "express";
import { IItemCreate, IItemUpdate, IItemPartial, IItemView } from "./itemInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { ItemBusiness } from "./itemBusiness";

export const itemRouter = express.Router();

itemRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new ItemBusiness(context);

itemRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, IItemView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

itemRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid item" });
        return;
    }
    
    const entity = await business.create(req.body as IItemCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "item entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IItemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

itemRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as IItemView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "item entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

itemRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid item" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as IItemUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "item entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IItemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

itemRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid item" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as IItemPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "item entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IItemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

itemRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as IItemView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "item entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});