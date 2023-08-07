import express from "express";
import { ISaleitemCreate, ISaleitemUpdate, ISaleitemPartial, ISaleitemView } from "./saleItemInterfaces";
import { Environment, Context, MessageResponse, ErrorResponse, IQueryResult, IQuery, IEntity } from "./base";
import { SaleitemBusiness } from "./saleItemBusiness";

export const saleItemRouter = express.Router();

saleItemRouter.use(express.json()); //ensure only json is accepted in post requests

const env = new Environment();
const context = new Context(env);
const business = new SaleitemBusiness(context);

saleItemRouter.get<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    const results = await business.getAll() as IQueryResult<IQuery, ISaleitemView>;
    const message = {
        success: true,
        message: "successful",
        data: results
    };
    res.json(message);
});

saleItemRouter.post<{}, MessageResponse | ErrorResponse>("/", async (req, res) => {
    if (!business.isCreate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid saleItem" });
        return;
    }
    
    const entity = await business.create(req.body as ISaleitemCreate);
    if (entity == null) {
        res.status(405).json({ success: false, message: "saleItem entity could not be created" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleitemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleItemRouter.get<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ISaleitemView;
    if (viewEntity == null) {
        res.status(404).json({ success: false, message: "saleItem entity not found" });
        return;
    }
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleItemRouter.put<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isUpdate(req.body)) {
        res.status(400).json({ success: false, message: "Invalid saleItem" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.update(id, req.body as ISaleitemUpdate);
    if (entity == null) {
        res.status(404).json({ success: false, message: "saleItem entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleitemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleItemRouter.patch<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    if (!business.isPartial(req.body)) {
        res.status(400).json({ success: false, message: "Invalid saleItem" });
        return;
    }
    const id = (req.params as IEntity).id;
    const entity = await business.modify(id, req.body as ISaleitemPartial);
    if (entity == null) {
        res.status(404).json({ success: false, message: "saleItem entity not found" });
        return;
    }
    const viewEntity = await business.getById(entity.id) as ISaleitemView;
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});

saleItemRouter.delete<{}, MessageResponse | ErrorResponse>("/:id", async (req, res) => {
    const id = (req.params as IEntity).id;
    const viewEntity = await business.getById(id) as ISaleitemView;
    const entity = await business.delete(id);
    if (entity == null) {
        res.status(404).json({ success: false, message: "saleItem entity not found" });
        return;
    }
    
    const message = {
        success: true,
        message: "successful",
        data: viewEntity
    };
    res.json(message);
});