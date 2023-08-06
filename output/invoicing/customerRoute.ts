import { express } from "express";
import { ICustomerCreate, ICustomerUpdate, ICustomerPartial, ICustomerView, isCustomerCreate, isCustomerUpdate, isCustomerPartial } from "./customerInterfaces"
const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/customer", (req, res) => {
    const data = getCustomers();
    res.json(data);
});

router.post("/customer", (req, res) => {
    if(!isCustomerCreate(req.body)) {
        res.status(400).json({"message": "Invalid customer"})
        return;
    }
    
    const data = createCustomer(req.body as ICustomerCreate);
    res.json(data);
});

router.get("/customer/:id", (req, res) => {
    const data = getCustomer(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "customer entity not found"})
        return;
    }
    res.json(data);
});

router.put("/customer/:id", (req, res) => {
    if(!isCustomerUpdate(req.body)) {
        res.status(400).json({"message": "Invalid customer"})
        return;
    }
    const data = updateCustomer(req.params.id, req.body as ICustomerUpdate);
    res.json(data);
});

router.patch("/customer/:id", (req, res) => {
    if(!isCustomerPartial(req.body)) {
        res.status(400).json({"message": "Invalid customer"})
        return;
    }
    const data = modifyCustomer(req.params.id, req.body as ICustomerPartial);
    res.json(data);
});

router.delete("/customer/:id", (req, res) => {
    const data = deleteCustomer(req.params.id);
    if(data == null) {
        res.status(404).json({"message": "customer entity not found"})
        return;
    }
    res.json(data);
});


/* Business */

const getCustomers = ():ICustomerView[] => {
    return [{} as ICustomerView];
}

const createCustomer = (customer:ICustomerCreate):ICustomerView => {
    //CREATE HERE

    const created = getCustomer(customer.id);
    return created;
}

const getCustomer = (id:string):ICustomerView => {
    //GET HERE

    var customer = {};
    return customer as ICustomerView;
}

const updateCustomer = (id:string, customer:ICustomerUpdate):ICustomerView => {
    //UPDATE HERE

    const updated = getCustomer(customer.id);
    return updated;
}

const modifyCustomer = (id:string, customer:ICustomerPartial):ICustomerView => {
    //MODIFY HERE

    const modified = getCustomer(customer.id || id);
    return modified;    
}

const deleteCustomer = (id:string):ICustomerView => {
    const existing = getCustomer(id);
    //DELETE HERE
    
    return existing;
}