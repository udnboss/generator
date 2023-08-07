import express from "express";
import { I__EntityNameCapitalized__Create, I__EntityNameCapitalized__Update, I__EntityNameCapitalized__Partial, I__EntityNameCapitalized__View } from "./__EntityName__Interfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { __EntityNameCapitalized__Business } from "./__EntityName__Business";

export const __EntityName__Router = express.Router();

__EntityName__Router.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new __EntityNameCapitalized__Business(context);

__EntityName__Router.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, I__EntityNameCapitalized__View>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

__EntityName__Router.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid __EntityName__" });
        return;
    }
    
    const entity = await business.create(req.body as I__EntityNameCapitalized__Create);
    if (entity == null) {
        res.status(405).json({ success: false, message: "__EntityName__ entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as I__EntityNameCapitalized__View;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

__EntityName__Router.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as I__EntityNameCapitalized__View;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "__EntityName__ entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

__EntityName__Router.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid __EntityName__" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as I__EntityNameCapitalized__Update);
    if (entity == null) {
        res.status(404).json({ success: false, message: "__EntityName__ entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as I__EntityNameCapitalized__View;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

__EntityName__Router.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid __EntityName__" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as I__EntityNameCapitalized__Partial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "__EntityName__ entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as I__EntityNameCapitalized__View;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

__EntityName__Router.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as I__EntityNameCapitalized__View;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "__EntityName__ entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});