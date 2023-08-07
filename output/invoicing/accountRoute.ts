import express from "express";
import { IAccountCreate, IAccountUpdate, IAccountPartial, IAccountView } from "./accountInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { AccountBusiness } from "./accountBusiness";

export const accountRouter = express.Router();

accountRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new AccountBusiness(context);

accountRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, IAccountView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

accountRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid account" });
        return;
    }
    
    const entity = await business.create(req.body as IAccountCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "account entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IAccountView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

accountRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as IAccountView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "account entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

accountRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid account" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as IAccountUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "account entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IAccountView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

accountRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid account" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as IAccountPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "account entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as IAccountView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

accountRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as IAccountView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "account entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});