interface __entityName__Create {
    __entityCreateInterface__
}

interface __entityName__Update {
    __entityUpdateInterface__
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

function is__entityName__Create(obj: any): obj is __entityName__Create {
    let interfaceProperites = __entityCreateTypeProperties__;
    return implementsInterface(obj, interfaceProperites);
}

function is__entityName__Update(obj: any): obj is __entityName__Update {
    let interfaceProperites = __entityUpdateTypeProperties__;
    return implementsInterface(obj, interfaceProperites);
}

//todo patch