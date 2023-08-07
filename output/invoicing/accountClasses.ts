import { Entity } from "./base";



export class Account extends Entity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export class AccountCreate extends Entity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export class AccountUpdate extends Entity {
    label:string;
    bank_name:string;
    bank_address:string;
    bank_swift:string;
    account_name:string;
    account_iban:string;
    account_address:string;
}

export class AccountPartial extends Entity {
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
}

export class AccountView extends Entity {
    label?:string;
    bank_name?:string;
    bank_address?:string;
    bank_swift?:string;
    account_name?:string;
    account_iban?:string;
    account_address?:string;
}