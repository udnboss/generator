import { IEntity } from "./base";



export interface ICurrency extends IEntity {
    name:str;
    symbol:str;
}

export interface ICurrencyCreate extends IEntity {
    name:str;
    symbol:str;
}

export interface ICurrencyUpdate extends IEntity {
    name:str;
    symbol:str;
}

export interface ICurrencyPartial extends IEntity {
    name?:str;
    symbol?:str;
}

export interface ICurrencyView extends IEntity {
    name?:str;
    symbol?:str;
}
