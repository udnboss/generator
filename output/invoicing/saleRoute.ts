import { express } from "express";
import { ISaleCreate, ISaleUpdate, ISalePartial, ISaleView, isSaleCreate, isSaleUpdate, isSalePartial } from "./saleInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/sale", (req, res) => {
    const data = getSales();
    res.json(data);
});

router.post("/sale", (req, res) => {
    if(!isSaleCreate(req.body)) {
        res.status(400).json({"message": "Invalid sale"})
        return;
    }
    
    const data = createSale(req.body as ISaleCreate);
    res.json(data);
});

router.get("/sale/:id", (req, res) => {
    const data = getSale(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "sale entity not found"})
        return;
    }
    res.json(data);
});

router.put("/sale/:id", (req, res) => {
    if(!isSaleUpdate(req.body)) {
        res.status(400).json({"message": "Invalid sale"})
        return;
    }
    const data = updateSale(req.params.id, req.body as ISaleUpdate);
    res.json(data);
});

router.patch("/sale/:id", (req, res) => {
    if(!isSalePartial(req.body)) {
        res.status(400).json({"message": "Invalid sale"})
        return;
    }
    const data = modifySale(req.params.id, req.body as ISalePartial);
    res.json(data);
});

router.delete("/sale/:id", (req, res) => {
    const data = deleteSale(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "sale entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getSales = ():ISaleView[] => {
    return [{} as ISaleView];
}

const createSale = (sale:ISaleCreate):ISaleView => {
    //CREATE HERE

    const created = getSale(sale.id);
    return created;
}

const getSale = (id:string):ISaleView => {
    //GET HERE

    var sale = {};
    return sale as ISaleView;
}

const updateSale = (id:string, sale:ISaleUpdate):ISaleView => {
    //UPDATE HERE

    const updated = getSale(sale.id);
    return updated;
}

const modifySale = (id:string, sale:ISalePartial):ISaleView => {
    //MODIFY HERE

    const modified = getSale(sale.id || id);
    return modified;    
}

const deleteSale = (id:string):ISaleView => {
    const existing = getSale(id);
    //DELETE HERE
    
    return existing;
}