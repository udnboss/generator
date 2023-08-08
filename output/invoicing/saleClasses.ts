import { Entity } from "./base";

import { ICurrencyView } from "./currencyInterfaces";
import { ICustomerView } from "./customerInterfaces";
import { IAccountView } from "./accountInterfaces";
import { ICompanyView } from "./companyInterfaces";
import { ISaleitemView } from "./saleItemInterfaces";

export class Sale extends Entity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    date:string;
    currency_id:string;
    total:number;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export class SaleCreate extends Entity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    date:string;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export class SaleUpdate extends Entity {
    company_id:string;
    account_id:string;
    customer_id:string;
    place?:string;
    number:number;
    currency_id:string;
    reference?:string;
    confirmed:boolean;
    reference_date?:string;
    due_date?:string;
}

export class SalePartial extends Entity {
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    number?:number;
    currency_id?:string;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
}

export class SaleView extends Entity {
    company_id?:string;
    account_id?:string;
    customer_id?:string;
    place?:string;
    number?:number;
    date?:string;
    currency_id?:string;
    total?:number;
    reference?:string;
    confirmed?:boolean;
    reference_date?:string;
    due_date?:string;
    currency?:ICurrencyView;
    customer?:ICustomerView;
    account?:IAccountView;
    company?:ICompanyView;
    items?:ISaleitemView[];
}