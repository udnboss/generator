import { express } from "express";
import { ISaleitemCreate, ISaleitemUpdate, ISaleitemPartial, ISaleitemView, isSaleitemCreate, isSaleitemUpdate, isSaleitemPartial } from "./saleItemInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/saleItem", (req, res) => {
    const data = getSaleitems();
    res.json(data);
});

router.post("/saleItem", (req, res) => {
    if(!isSaleitemCreate(req.body)) {
        res.status(400).json({"message": "Invalid saleItem"})
        return;
    }
    
    const data = createSaleitem(req.body as ISaleitemCreate);
    res.json(data);
});

router.get("/saleItem/:id", (req, res) => {
    const data = getSaleitem(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "saleItem entity not found"})
        return;
    }
    res.json(data);
});

router.put("/saleItem/:id", (req, res) => {
    if(!isSaleitemUpdate(req.body)) {
        res.status(400).json({"message": "Invalid saleItem"})
        return;
    }
    const data = updateSaleitem(req.params.id, req.body as ISaleitemUpdate);
    res.json(data);
});

router.patch("/saleItem/:id", (req, res) => {
    if(!isSaleitemPartial(req.body)) {
        res.status(400).json({"message": "Invalid saleItem"})
        return;
    }
    const data = modifySaleitem(req.params.id, req.body as ISaleitemPartial);
    res.json(data);
});

router.delete("/saleItem/:id", (req, res) => {
    const data = deleteSaleitem(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "saleItem entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getSaleitems = ():ISaleitemView[] => {
    return [{} as ISaleitemView];
}

const createSaleitem = (saleItem:ISaleitemCreate):ISaleitemView => {
    //CREATE HERE

    const created = getSaleitem(saleItem.id);
    return created;
}

const getSaleitem = (id:string):ISaleitemView => {
    //GET HERE

    var saleItem = {};
    return saleItem as ISaleitemView;
}

const updateSaleitem = (id:string, saleItem:ISaleitemUpdate):ISaleitemView => {
    //UPDATE HERE

    const updated = getSaleitem(saleItem.id);
    return updated;
}

const modifySaleitem = (id:string, saleItem:ISaleitemPartial):ISaleitemView => {
    //MODIFY HERE

    const modified = getSaleitem(saleItem.id || id);
    return modified;    
}

const deleteSaleitem = (id:string):ISaleitemView => {
    const existing = getSaleitem(id);
    //DELETE HERE
    
    return existing;
}