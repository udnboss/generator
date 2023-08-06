import { express } from "express";
import { I__EntityNameCapitalized__Create, I__EntityNameCapitalized__Update, I__EntityNameCapitalized__Partial, I__EntityNameCapitalized__View, is__EntityNameCapitalized__Create, is__EntityNameCapitalized__Update, is__EntityNameCapitalized__Partial } from "./__EntityName__Interfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/__EntityName__", (req, res) => {
    const data = get__EntityNameCapitalizedPlural__();
    res.json(data);
});

router.post("/__EntityName__", (req, res) => {
    if(!is__EntityNameCapitalized__Create(req.body)) {
        res.status(400).json({"message": "Invalid __EntityName__"})
        return;
    }
    
    const data = create__EntityNameCapitalized__(req.body as I__EntityNameCapitalized__Create);
    res.json(data);
});

router.get("/__EntityName__/:id", (req, res) => {
    const data = get__EntityNameCapitalized__(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "__EntityName__ entity not found"})
        return;
    }
    res.json(data);
});

router.put("/__EntityName__/:id", (req, res) => {
    if(!is__EntityNameCapitalized__Update(req.body)) {
        res.status(400).json({"message": "Invalid __EntityName__"})
        return;
    }
    const data = update__EntityNameCapitalized__(req.params.id, req.body as I__EntityNameCapitalized__Update);
    res.json(data);
});

router.patch("/__EntityName__/:id", (req, res) => {
    if(!is__EntityNameCapitalized__Partial(req.body)) {
        res.status(400).json({"message": "Invalid __EntityName__"})
        return;
    }
    const data = modify__EntityNameCapitalized__(req.params.id, req.body as I__EntityNameCapitalized__Partial);
    res.json(data);
});

router.delete("/__EntityName__/:id", (req, res) => {
    const data = delete__EntityNameCapitalized__(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "__EntityName__ entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const get__EntityNameCapitalizedPlural__ = ():I__EntityNameCapitalized__View[] => {
    return [{} as I__EntityNameCapitalized__View];
}

const create__EntityNameCapitalized__ = (__EntityName__:I__EntityNameCapitalized__Create):I__EntityNameCapitalized__View => {
    //CREATE HERE

    const created = get__EntityNameCapitalized__(__EntityName__.id);
    return created;
}

const get__EntityNameCapitalized__ = (id:string):I__EntityNameCapitalized__View => {
    //GET HERE

    var __EntityName__ = {};
    return __EntityName__ as I__EntityNameCapitalized__View;
}

const update__EntityNameCapitalized__ = (id:string, __EntityName__:I__EntityNameCapitalized__Update):I__EntityNameCapitalized__View => {
    //UPDATE HERE

    const updated = get__EntityNameCapitalized__(__EntityName__.id);
    return updated;
}

const modify__EntityNameCapitalized__ = (id:string, __EntityName__:I__EntityNameCapitalized__Partial):I__EntityNameCapitalized__View => {
    //MODIFY HERE

    const modified = get__EntityNameCapitalized__(__EntityName__.id || id);
    return modified;    
}

const delete__EntityNameCapitalized__ = (id:string):I__EntityNameCapitalized__View => {
    const existing = get__EntityNameCapitalized__(id);
    //DELETE HERE
    
    return existing;
}