import { IEntity } from "./base";

import { ICategoryView } from "./categoryInterfaces";

export interface IItem extends IEntity {
    name:str;
    category_id?:str;
}

export interface IItemCreate extends IEntity {
    name:str;
    category_id?:str;
}

export interface IItemUpdate extends IEntity {
    name:str;
    category_id?:str;
}

export interface IItemPartial extends IEntity {
    name?:str;
    category_id?:str;
}

export interface IItemView extends IEntity {
    name?:str;
    category_id?:str;
    category?:ICategoryView;
}
