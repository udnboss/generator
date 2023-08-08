import { Entity } from "./base";

import { IItemView } from "./itemInterfaces";

export class Category extends Entity {
    name:str;
    category_id?:str;
}

export class CategoryCreate extends Entity {
    name:str;
    category_id?:str;
}

export class CategoryUpdate extends Entity {
    name:str;
    category_id?:str;
}

export class CategoryPartial extends Entity {
    name?:str;
    category_id?:str;
}

export class CategoryView extends Entity {
    name?:str;
    category_id?:str;
    category?:ICategoryView;
    items?:IItemView[];
}