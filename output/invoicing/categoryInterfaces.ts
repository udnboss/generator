import { IEntity } from "./base";

import { IItemView } from "./itemInterfaces";

export interface ICategory extends IEntity {
    name:string;
    category_id?:string;
}

export interface ICategoryCreate extends IEntity {
    name:string;
    category_id?:string;
}

export interface ICategoryUpdate extends IEntity {
    name:string;
    category_id?:string;
}

export interface ICategoryPartial extends IEntity {
    name?:string;
    category_id?:string;
}

export interface ICategoryView extends IEntity {
    name?:string;
    category_id?:string;
    category?:ICategoryView;
    items?:IItemView[];
}
