import { Entity } from "./base";

import { ICategoryView } from "./categoryInterfaces";

export class Item extends Entity {
    name:str;
    category_id?:str;
}

export class ItemCreate extends Entity {
    name:str;
    category_id?:str;
}

export class ItemUpdate extends Entity {
    name:str;
    category_id?:str;
}

export class ItemPartial extends Entity {
    name?:str;
    category_id?:str;
}

export class ItemView extends Entity {
    name?:str;
    category_id?:str;
    category?:ICategoryView;
}