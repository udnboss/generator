import { Entity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ISaleView } from "./saleInterfaces";

export class Customer extends Entity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export class CustomerCreate extends Entity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export class CustomerUpdate extends Entity {
    name:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export class CustomerPartial extends Entity {
    name?:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    payment_term?:int;
}

export class CustomerView extends Entity {
    name?:str;
    address?:str;
    contact?:str;
    currency_id?:str;
    currency?:ICurrencyView;
    payment_term?:int;
    sales?:ISaleView[];
}