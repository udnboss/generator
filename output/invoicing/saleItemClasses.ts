import { Entity } from "./base";

import { ISaleView } from "./saleInterfaces";
import { IItemView } from "./itemInterfaces";

export class Saleitem extends Entity {
    sale_id:string;
    item_id:string;
    description?:string;
    quantity:number;
    price:number;
}

export class SaleitemCreate extends Entity {
    sale_id:string;
    item_id:string;
    description?:string;
    quantity:number;
    price:number;
}

export class SaleitemUpdate extends Entity {
    sale_id:string;
    item_id:string;
    description?:string;
    quantity:number;
    price:number;
}

export class SaleitemPartial extends Entity {
    sale_id?:string;
    item_id?:string;
    description?:string;
    quantity?:number;
    price?:number;
}

export class SaleitemView extends Entity {
    sale_id?:string;
    item_id?:string;
    description?:string;
    quantity?:number;
    price?:number;
    sale?:ISaleView;
    item?:IItemView;
}