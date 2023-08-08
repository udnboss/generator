import { Entity } from "./base";



export class Currency extends Entity {
    name:str;
    symbol:str;
}

export class CurrencyCreate extends Entity {
    name:str;
    symbol:str;
}

export class CurrencyUpdate extends Entity {
    name:str;
    symbol:str;
}

export class CurrencyPartial extends Entity {
    name?:str;
    symbol?:str;
}

export class CurrencyView extends Entity {
    name?:str;
    symbol?:str;
}