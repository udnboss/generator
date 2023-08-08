import { Entity } from "./base";

import { ISaleView } from "./saleInterfaces";
import { IItemView } from "./itemInterfaces";

export class Saleitem extends Entity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export class SaleitemCreate extends Entity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export class SaleitemUpdate extends Entity {
    sale_id:str;
    item_id:str;
    description:str;
    quantity:int;
    price:float;
}

export class SaleitemPartial extends Entity {
    sale_id?:str;
    item_id?:str;
    description?:str;
    quantity?:int;
    price?:float;
}

export class SaleitemView extends Entity {
    sale_id?:str;
    item_id?:str;
    description?:str;
    quantity?:int;
    price?:float;
    sale?:ISaleView;
    item?:IItemView;
}