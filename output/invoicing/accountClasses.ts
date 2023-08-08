import { Entity } from "./base";



export class Account extends Entity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export class AccountCreate extends Entity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export class AccountUpdate extends Entity {
    label:str;
    bank_name:str;
    bank_address:str;
    bank_swift:str;
    account_name:str;
    account_iban:str;
    account_address:str;
}

export class AccountPartial extends Entity {
    label?:str;
    bank_name?:str;
    bank_address?:str;
    bank_swift?:str;
    account_name?:str;
    account_iban?:str;
    account_address?:str;
}

export class AccountView extends Entity {
    label?:str;
    bank_name?:str;
    bank_address?:str;
    bank_swift?:str;
    account_name?:str;
    account_iban?:str;
    account_address?:str;
}