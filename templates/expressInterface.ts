__EntityImports__

export interface I__EntityNameCapitalized__ {
    __EntityInterface__
}

export interface I__EntityNameCapitalized__Create {
    __EntityCreateInterface__
}

export interface I__EntityNameCapitalized__Update {
    __EntityUpdateInterface__
}

export interface I__EntityNameCapitalized__Partial {
    __EntityPartialInterface__
}

export interface I__EntityNameCapitalized__View {
    __EntityViewInterface__
}

const implementsInterface = (obj: any, interfaceProperites): boolean => {
    if (obj == null) {
        return false; //empty or null object
    }

    let expectedKeys = interfaceProperites; //required keys
    for (let key of expectedKeys) {
        let isRequired = expectedKeys[key].required;
        if (isRequired && !(key in obj)) {
            return false; //missing required property
        }
        let value = obj[key];
        let expectedType = expectedKeys[key].type;
        if(expectedType != 'array' && typeof value !== expectedType) {
            return false; //primitive type not matching           
        }
        else {
            let expectedSubType = expectedKeys[key].subtype;
            if(!Array.isArray(value) || !value.every(item => typeof item === expectedSubType)) {
                return false; //array type not matching or items not of expected subtype
            }
        }
    }

    for (let key in obj) {
        if(!expectedKeys.include(key)){
            return false; //extra properties found
        }
    }

    return true;
}

export const is__EntityNameCapitalized__Create = (obj: any): obj is I__EntityNameCapitalized__Create => {
    let interfaceProperites = __EntityCreateTypeProperties__;
    return implementsInterface(obj, interfaceProperites);
}

export const is__EntityNameCapitalized__Update = (obj: any): obj is I__EntityNameCapitalized__Update => {
    let interfaceProperites = __EntityUpdateTypeProperties__;
    return implementsInterface(obj, interfaceProperites);
}

export const is__EntityNameCapitalized__Partial = (obj: any): obj is I__EntityNameCapitalized__Partial => {
    let interfaceProperites = __EntityPartialTypeProperties__;
    return implementsInterface(obj, interfaceProperites);
}