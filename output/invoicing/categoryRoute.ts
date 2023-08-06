import { express } from "express";
import { ICategoryCreate, ICategoryUpdate, ICategoryPartial, ICategoryView, isCategoryCreate, isCategoryUpdate, isCategoryPartial } from "./categoryInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/category", (req, res) => {
    const data = getCategories();
    res.json(data);
});

router.post("/category", (req, res) => {
    if(!isCategoryCreate(req.body)) {
        res.status(400).json({"message": "Invalid category"})
        return;
    }
    
    const data = createCategory(req.body as ICategoryCreate);
    res.json(data);
});

router.get("/category/:id", (req, res) => {
    const data = getCategory(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "category entity not found"})
        return;
    }
    res.json(data);
});

router.put("/category/:id", (req, res) => {
    if(!isCategoryUpdate(req.body)) {
        res.status(400).json({"message": "Invalid category"})
        return;
    }
    const data = updateCategory(req.params.id, req.body as ICategoryUpdate);
    res.json(data);
});

router.patch("/category/:id", (req, res) => {
    if(!isCategoryPartial(req.body)) {
        res.status(400).json({"message": "Invalid category"})
        return;
    }
    const data = modifyCategory(req.params.id, req.body as ICategoryPartial);
    res.json(data);
});

router.delete("/category/:id", (req, res) => {
    const data = deleteCategory(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "category entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getCategories = ():ICategoryView[] => {
    return [{} as ICategoryView];
}

const createCategory = (category:ICategoryCreate):ICategoryView => {
    //CREATE HERE

    const created = getCategory(category.id);
    return created;
}

const getCategory = (id:string):ICategoryView => {
    //GET HERE

    var category = {};
    return category as ICategoryView;
}

const updateCategory = (id:string, category:ICategoryUpdate):ICategoryView => {
    //UPDATE HERE

    const updated = getCategory(category.id);
    return updated;
}

const modifyCategory = (id:string, category:ICategoryPartial):ICategoryView => {
    //MODIFY HERE

    const modified = getCategory(category.id || id);
    return modified;    
}

const deleteCategory = (id:string):ICategoryView => {
    const existing = getCategory(id);
    //DELETE HERE
    
    return existing;
}