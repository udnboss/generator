import express from 'express';
import { MessageResponse } from './base';
import * as middlewares from '../middlewares';

__EntitiesRoutesImports__

const indexRouter = express.Router();
indexRouter.use(middlewares.authenticate);

__EntitiesRoutesUses__

indexRouter.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        success: true,
        message: 'API - 👋🌎🌍🌏',
        data: null
    });
});


export default indexRouter;