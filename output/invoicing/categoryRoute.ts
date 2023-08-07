import express from "express";
import { ICategoryCreate, ICategoryUpdate, ICategoryPartial, ICategoryView } from "./categoryInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { CategoryBusiness } from "./categoryBusiness";

export const categoryRouter = express.Router();

categoryRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new CategoryBusiness(context);

categoryRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ICategoryView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

categoryRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid category" });
        return;
    }
    
    const entity = await business.create(req.body as ICategoryCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "category entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICategoryView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

categoryRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICategoryView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "category entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

categoryRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid category" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ICategoryUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "category entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICategoryView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

categoryRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid category" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ICategoryPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "category entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ICategoryView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

categoryRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ICategoryView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "category entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});