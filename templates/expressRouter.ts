import { express } from "express";

const router = express.Router();

router.use(express.json()); //ensure only json is accepted in post requests

router.get("/__entityName__", (req, res) => {
    const data = get__EntityNameCapitalizedPlural__();
    res.json(data);
});

router.post("/__entityName__", (req, res) => {
    const data = create__EntityNameCapitalized__(req.body);
    res.json(data);
});

router.get("/__entityName__/:id", (req, res) => {
    const data = get__EntityNameCapitalized__(req.params.id);
    res.json(data);
});

router.put("/__entityName__/:id", (req, res) => {
    const data = update__EntityNameCapitalized__(req.params.id, req.body);
    res.json(data);
});

router.patch("/__entityName__/:id", (req, res) => {
    const data = modify__EntityNameCapitalized__(req.params.id, req.body);
    res.json(data);
});

router.delete("/__entityName__/:id", (req, res) => {
    const data = delete__EntityNameCapitalized__(req.params.id);
    res.json(data);
});


/* Business */

/**
 * @returns __EntityNameCapitalized__[]
 */
const get__EntityNameCapitalizedPlural__ = () => {}

/**
 * @param {__EntityNameCapitalized__Create} __EntityName__ 
 * @returns __EntityNameCapitalized__
 */
const create__EntityNameCapitalized__ = (__EntityName__) => {}

/**
 * @param {string} id 
 * @returns __EntityNameCapitalized__
 */
const get__EntityNameCapitalized__ = (id) => {}

/**
 * @param {string} id 
 * @param {__EntityNameCapitalized__Update} __EntityName__ 
 * @returns __EntityNameCapitalized__
 */
const update__EntityNameCapitalized__ = (id, __EntityName__) => {}

/**
 * @param {string} id 
 * @param {__EntityNameCapitalized__Partial} __EntityName__ 
 * @returns __EntityNameCapitalized__
 */
const modify__EntityNameCapitalized__ = (id, __EntityName__) => {}

/**
 * @param {string} id 
 * @returns __EntityNameCapitalized__
 */
const delete__EntityNameCapitalized__ = (id) => {}