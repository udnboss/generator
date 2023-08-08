import { Entity } from "./base";

import { IItemView } from "./itemInterfaces";

export class Category extends Entity {
    name:string;
    category_id?:string;
}

export class CategoryCreate extends Entity {
    name:string;
    category_id?:string;
}

export class CategoryUpdate extends Entity {
    name:string;
    category_id?:string;
}

export class CategoryPartial extends Entity {
    name?:string;
    category_id?:string;
}

export class CategoryView extends Entity {
    name?:string;
    category_id?:string;
    category?:ICategoryView;
    items?:IItemView[];
}