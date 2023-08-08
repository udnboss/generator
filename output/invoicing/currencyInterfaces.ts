import { IEntity } from "./base";



export interface ICurrency extends IEntity {
    name:string;
    symbol:string;
}

export interface ICurrencyCreate extends IEntity {
    name:string;
    symbol:string;
}

export interface ICurrencyUpdate extends IEntity {
    name:string;
    symbol:string;
}

export interface ICurrencyPartial extends IEntity {
    name?:string;
    symbol?:string;
}

export interface ICurrencyView extends IEntity {
    name?:string;
    symbol?:string;
}
