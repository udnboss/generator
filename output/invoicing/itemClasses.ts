import { Entity } from "./base";

import { ICategoryView } from "./categoryInterfaces";

export class Item extends Entity {
    name:string;
    category_id?:string;
}

export class ItemCreate extends Entity {
    name:string;
    category_id?:string;
}

export class ItemUpdate extends Entity {
    name:string;
    category_id?:string;
}

export class ItemPartial extends Entity {
    name?:string;
    category_id?:string;
}

export class ItemView extends Entity {
    name?:string;
    category_id?:string;
    category?:ICategoryView;
}