import { IEntity } from "./base";

import { ICategoryView } from "./categoryInterfaces";

export interface IItem extends IEntity {
    name:string;
    category_id?:string;
}

export interface IItemCreate extends IEntity {
    name:string;
    category_id?:string;
}

export interface IItemUpdate extends IEntity {
    name:string;
    category_id?:string;
}

export interface IItemPartial extends IEntity {
    name?:string;
    category_id?:string;
}

export interface IItemView extends IEntity {
    name?:string;
    category_id?:string;
    category?:ICategoryView;
}
