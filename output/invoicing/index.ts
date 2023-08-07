import express from 'express';
import { MessageResponse } from './base';

import { accountRouter } from './accountRoute';
import { categoryRouter } from './categoryRoute';
import { companyRouter } from './companyRoute';
import { currencyRouter } from './currencyRoute';
import { customerRouter } from './customerRoute';
import { itemRouter } from './itemRoute';
import { saleRouter } from './saleRoute';
import { saleItemRouter } from './saleItemRoute';

const indexRouter = express.Router();

indexRouter.use('/accounts', accountRouter);
indexRouter.use('/categories', categoryRouter);
indexRouter.use('/companies', companyRouter);
indexRouter.use('/currencies', currencyRouter);
indexRouter.use('/customers', customerRouter);
indexRouter.use('/items', itemRouter);
indexRouter.use('/sales', saleRouter);
indexRouter.use('/saleItems', saleItemRouter);

indexRouter.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        success: true,
        message: 'API - 👋🌎🌍🌏',
        data: null
    });
});


export default indexRouter;