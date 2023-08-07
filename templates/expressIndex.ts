import express from 'express';
import { MessageResponse } from './base';

__EntitiesRoutesImports__

const indexRouter = express.Router();

__EntitiesRoutesUses__

indexRouter.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        success: true,
        message: 'API - 👋🌎🌍🌏',
        data: null
    });
});


export default indexRouter;