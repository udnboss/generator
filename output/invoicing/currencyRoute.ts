import { express } from "express";
import { ICurrencyCreate, ICurrencyUpdate, ICurrencyPartial, ICurrencyView, isCurrencyCreate, isCurrencyUpdate, isCurrencyPartial } from "./currencyInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/currency", (req, res) => {
    const data = getCurrencies();
    res.json(data);
});

router.post("/currency", (req, res) => {
    if(!isCurrencyCreate(req.body)) {
        res.status(400).json({"message": "Invalid currency"})
        return;
    }
    
    const data = createCurrency(req.body as ICurrencyCreate);
    res.json(data);
});

router.get("/currency/:id", (req, res) => {
    const data = getCurrency(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "currency entity not found"})
        return;
    }
    res.json(data);
});

router.put("/currency/:id", (req, res) => {
    if(!isCurrencyUpdate(req.body)) {
        res.status(400).json({"message": "Invalid currency"})
        return;
    }
    const data = updateCurrency(req.params.id, req.body as ICurrencyUpdate);
    res.json(data);
});

router.patch("/currency/:id", (req, res) => {
    if(!isCurrencyPartial(req.body)) {
        res.status(400).json({"message": "Invalid currency"})
        return;
    }
    const data = modifyCurrency(req.params.id, req.body as ICurrencyPartial);
    res.json(data);
});

router.delete("/currency/:id", (req, res) => {
    const data = deleteCurrency(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "currency entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getCurrencies = ():ICurrencyView[] => {
    return [{} as ICurrencyView];
}

const createCurrency = (currency:ICurrencyCreate):ICurrencyView => {
    //CREATE HERE

    const created = getCurrency(currency.id);
    return created;
}

const getCurrency = (id:string):ICurrencyView => {
    //GET HERE

    var currency = {};
    return currency as ICurrencyView;
}

const updateCurrency = (id:string, currency:ICurrencyUpdate):ICurrencyView => {
    //UPDATE HERE

    const updated = getCurrency(currency.id);
    return updated;
}

const modifyCurrency = (id:string, currency:ICurrencyPartial):ICurrencyView => {
    //MODIFY HERE

    const modified = getCurrency(currency.id || id);
    return modified;    
}

const deleteCurrency = (id:string):ICurrencyView => {
    const existing = getCurrency(id);
    //DELETE HERE
    
    return existing;
}