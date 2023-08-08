import { IEntity } from "./base";

import { IItemView } from "./itemInterfaces";

export interface ICategory extends IEntity {
    name:str;
    category_id?:str;
}

export interface ICategoryCreate extends IEntity {
    name:str;
    category_id?:str;
}

export interface ICategoryUpdate extends IEntity {
    name:str;
    category_id?:str;
}

export interface ICategoryPartial extends IEntity {
    name?:str;
    category_id?:str;
}

export interface ICategoryView extends IEntity {
    name?:str;
    category_id?:str;
    category?:ICategoryView;
    items?:IItemView[];
}
