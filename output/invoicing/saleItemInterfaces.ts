import { IEntity } from "./base";

import { ISaleView } from "./saleInterfaces";
import { IItemView } from "./itemInterfaces";

export interface ISaleitem extends IEntity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export interface ISaleitemCreate extends IEntity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export interface ISaleitemUpdate extends IEntity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export interface ISaleitemPartial extends IEntity {
    sale_id?:str;
    item_id?:str;
    description?:str;
    quantity?:int;
    price?:float;
}

export interface ISaleitemView extends IEntity {
    sale_id?:str;
    item_id?:str;
    description?:str;
    quantity?:int;
    price?:float;
    sale?:ISaleView;
    item?:IItemView;
}
