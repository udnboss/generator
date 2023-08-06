import { express } from "express";
import { IAccountCreate, IAccountUpdate, IAccountPartial, IAccountView, isAccountCreate, isAccountUpdate, isAccountPartial } from "./accountInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/account", (req, res) => {
    const data = getAccounts();
    res.json(data);
});

router.post("/account", (req, res) => {
    if(!isAccountCreate(req.body)) {
        res.status(400).json({"message": "Invalid account"})
        return;
    }
    
    const data = createAccount(req.body as IAccountCreate);
    res.json(data);
});

router.get("/account/:id", (req, res) => {
    const data = getAccount(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "account entity not found"})
        return;
    }
    res.json(data);
});

router.put("/account/:id", (req, res) => {
    if(!isAccountUpdate(req.body)) {
        res.status(400).json({"message": "Invalid account"})
        return;
    }
    const data = updateAccount(req.params.id, req.body as IAccountUpdate);
    res.json(data);
});

router.patch("/account/:id", (req, res) => {
    if(!isAccountPartial(req.body)) {
        res.status(400).json({"message": "Invalid account"})
        return;
    }
    const data = modifyAccount(req.params.id, req.body as IAccountPartial);
    res.json(data);
});

router.delete("/account/:id", (req, res) => {
    const data = deleteAccount(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "account entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getAccounts = ():IAccountView[] => {
    return [{} as IAccountView];
}

const createAccount = (account:IAccountCreate):IAccountView => {
    //CREATE HERE

    const created = getAccount(account.id);
    return created;
}

const getAccount = (id:string):IAccountView => {
    //GET HERE

    var account = {};
    return account as IAccountView;
}

const updateAccount = (id:string, account:IAccountUpdate):IAccountView => {
    //UPDATE HERE

    const updated = getAccount(account.id);
    return updated;
}

const modifyAccount = (id:string, account:IAccountPartial):IAccountView => {
    //MODIFY HERE

    const modified = getAccount(account.id || id);
    return modified;    
}

const deleteAccount = (id:string):IAccountView => {
    const existing = getAccount(id);
    //DELETE HERE
    
    return existing;
}