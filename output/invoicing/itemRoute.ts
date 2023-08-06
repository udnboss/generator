import { express } from "express";
import { IItemCreate, IItemUpdate, IItemPartial, IItemView, isItemCreate, isItemUpdate, isItemPartial } from "./itemInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/item", (req, res) => {
    const data = getItems();
    res.json(data);
});

router.post("/item", (req, res) => {
    if(!isItemCreate(req.body)) {
        res.status(400).json({"message": "Invalid item"})
        return;
    }
    
    const data = createItem(req.body as IItemCreate);
    res.json(data);
});

router.get("/item/:id", (req, res) => {
    const data = getItem(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "item entity not found"})
        return;
    }
    res.json(data);
});

router.put("/item/:id", (req, res) => {
    if(!isItemUpdate(req.body)) {
        res.status(400).json({"message": "Invalid item"})
        return;
    }
    const data = updateItem(req.params.id, req.body as IItemUpdate);
    res.json(data);
});

router.patch("/item/:id", (req, res) => {
    if(!isItemPartial(req.body)) {
        res.status(400).json({"message": "Invalid item"})
        return;
    }
    const data = modifyItem(req.params.id, req.body as IItemPartial);
    res.json(data);
});

router.delete("/item/:id", (req, res) => {
    const data = deleteItem(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "item entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getItems = ():IItemView[] => {
    return [{} as IItemView];
}

const createItem = (item:IItemCreate):IItemView => {
    //CREATE HERE

    const created = getItem(item.id);
    return created;
}

const getItem = (id:string):IItemView => {
    //GET HERE

    var item = {};
    return item as IItemView;
}

const updateItem = (id:string, item:IItemUpdate):IItemView => {
    //UPDATE HERE

    const updated = getItem(item.id);
    return updated;
}

const modifyItem = (id:string, item:IItemPartial):IItemView => {
    //MODIFY HERE

    const modified = getItem(item.id || id);
    return modified;    
}

const deleteItem = (id:string):IItemView => {
    const existing = getItem(id);
    //DELETE HERE
    
    return existing;
}