
import re
import yaml

BASE_DATATYPES = 'str uuid bool int float date datetime time'.split(' ')
STR_TYPE_FORMATS = 'date email'.split(' ')
REFERENTIAL_ON_DELETE_OPTIONS = 'd-cascade d-setnull d-restrict d-ignore'.split(' ')
REFERENTIAL_ON_UPDATE_OPTIONS = 'u-cascade u-setnull u-restrict u-ignore'.split(' ')

DEFAULT_DATATYPE = 'str'
DEFAULT_REFERENTIAL_ON_DELETE = 'd-cascade'
DEFAULT_REFERENTIAL_ON_UPDATE = 'd-cascade'

PROPERTY_NAME_FLAGS = ['?', '*', '!', '$']
FLAG_NOT_REQUIRED, FLAG_NO_UPDATE, FLAG_NO_CREATE, FLAG_NO_READ = PROPERTY_NAME_FLAGS

TYPE_FILTER_OPERATORS = {
    'str': 'like',
    'uuid': 'in',
    'bool': 'eq',
    'int': 'bt',
    'float': 'bt',
    'date': 'bt',
    'datetime': 'bt',
    'time': 'bt',
}

def parseEntities(file:str):
    entities = {}
    with open(file, 'r', encoding='utf-8') as f:
        input:dict = yaml.safe_load(f)
        entityName:str
        entity:dict
        property:str
        metadata:str

        VALID_ENTITIY_TYPES = input['interfaces'].keys()

        for entityName, entity in input['interfaces'].items():
            entities[entityName] = entity.copy()
            entities[entityName]['properties'] = {}
            properties = entity['properties']
            for property, metadata in properties.items():
                propertyName = property
                isRequired = True
                allowUpdate = True
                allowCreate = True
                allowRead = True
                propertyType = DEFAULT_DATATYPE
                propertySubType = None
                propertyFormat = None
                isTypeReference = False
                typeReferenceViaProperty = None
                isSubTypeReference = False
                subTypeReferenceViaProperty = None
                refEntity = None      
                refEntityProperty = None
                refOnDelete = None
                refOnUpdate = None
                defaultValue = None
                minimum = None
                maximum = None

                propertyNameFlag = propertyName[-1]
                while propertyNameFlag in PROPERTY_NAME_FLAGS:    
                    propertyName = propertyName[:-1]   
                    if propertyNameFlag == FLAG_NOT_REQUIRED:                        
                        isRequired = False
                        
                    elif propertyNameFlag == FLAG_NO_UPDATE:
                        allowUpdate = False
                    
                    elif propertyNameFlag == FLAG_NO_CREATE:
                        allowCreate = False

                    elif propertyNameFlag == FLAG_NO_READ:
                        allowRead = False

                    propertyNameFlag = propertyName[-1]
                    
                if metadata is None:
                    propertyType = DEFAULT_DATATYPE
                    # print(property, propertyName, metadata)
                elif isinstance(metadata, str):                  
                    if metadata.split('@')[0].strip().endswith('[]'):
                        propertyType = 'array'
                        propertySubType = metadata.split('[]')[0]
                        isSubTypeReference = propertySubType in VALID_ENTITIY_TYPES
                    
                        if '|' in propertySubType:
                            propertySubType, propertyFormat = metadata.split('|')

                        if not isSubTypeReference and propertySubType not in BASE_DATATYPES:
                            raise Exception(f"Found unsupported data type: {propertySubType} for {property}.{propertyName}")
                        
                        if isSubTypeReference:
                            subTypeReferenceViaProperty = metadata.split('@')[1]
                    else:                        
                        if ' > ' in metadata:
                            propertyType, refArgumentsStr = metadata.split(' > ')
                            refArguments = refArgumentsStr.split()
                            refEntity = refArguments[0]
                            if '|' in propertyType:
                                propertyType, propertyFormat = propertyType.split('|')
                            if propertyType not in BASE_DATATYPES:
                                raise Exception(f"Found unsupported data type: {propertyType} for {property}.{propertyName}") 
                                                        
                            refOnDeleteMatches = [o for o in REFERENTIAL_ON_DELETE_OPTIONS if o in refArguments]
                            refOnDelete = refOnDeleteMatches[-1] if len(refOnDeleteMatches) > 0 else DEFAULT_REFERENTIAL_ON_DELETE

                            refOnUpdateMatches = [o for o in REFERENTIAL_ON_UPDATE_OPTIONS if o in refArguments]
                            refOnUpdate = refOnUpdateMatches[-1] if len(refOnUpdateMatches) > 0 else DEFAULT_REFERENTIAL_ON_UPDATE

                            refEntity, refEntityProperty = refEntity.split('.')       
                            
                        else:
                            if '=' in metadata:
                                metadata, defaultValue = [x.strip() for x in metadata.split('=')]
                            
                            if '|' in metadata:
                                propertyType, propertyFormat = metadata.split('|')
                            else:
                                propertyType = metadata.split('@')[0].strip()

                            if propertyType.endswith(")"):
                                parts = re.findall(r'\d+', propertyType)
                                if len(parts) > 0:
                                    minimum = int(parts[0])
                                if len(parts) > 1:
                                    maximum = int(parts[1])
                                propertyType = propertyType.split('(')[0]
                            
                            isTypeReference = propertyType in VALID_ENTITIY_TYPES

                            if not isTypeReference and propertyType not in BASE_DATATYPES:
                                msg = f"Found unsupported data type: {propertyType} for {property}.{propertyName}"
                                raise Exception(msg)        

                            if isTypeReference:
                                typeReferenceViaProperty = metadata.split('@')[1]            
                                

                else: #object #TODO: not implemented, for a future design
                    raise Exception(f"Object value not supported for entity propery {property}")
                    # propertyType = metadata['type']
                    # if 'format' in metadata:
                    #     propertyFormat = metadata['format']

                
                
                
                prop = {'type': propertyType, 'default': defaultValue}

                if propertyType != "array":
                    if not isTypeReference:
                        if 'filters' in entity and propertyName in entity['filters']:
                            filterOperator = TYPE_FILTER_OPERATORS[propertyType]
                            filterMin = None
                            filterMax = None
                            if entity['filters'][propertyName] is not None:
                                metaParts = entity['filters'][propertyName].split(' ')                                
                                filterOperator = metaParts[0]
                                if len(metaParts) > 1:
                                    filterMin = int(metaParts[1])
                                if len(metaParts) > 2:
                                    filterMax = int(metaParts[2])

                            prop['filterOperator'] = filterOperator 
                            prop['filterMin'] = filterMin 
                            prop['filterMax'] = filterMax 

                #min/max from constraints
                if 'constraints' in entity:
                    for constraint in entity['constraints']:
                        if constraint['property'] == propertyName:
                            if constraint['op'] == 'gt':
                                minimum = constraint['value'] + 1
                            elif constraint['op'] == 'gte':
                                minimum = constraint['value']
                            elif constraint['op'] == 'lt':
                                maximum = constraint['value'] + 1
                            elif constraint['op'] == 'lte':
                                maximum = constraint['value']


                prop['typeReference'] = isTypeReference

                if isTypeReference:
                    prop['typeReferenceViaProperty'] = typeReferenceViaProperty

                if isSubTypeReference:
                    prop['subTypeReferenceViaProperty'] = subTypeReferenceViaProperty

                if refEntity is not None:
                    prop['constraintEntity'] = refEntity
                    prop['constraintEntityProperty'] = refEntityProperty
                    prop['constraintEntityOnDelete'] = refOnDelete
                    prop['constraintEntityOnUpdate'] = refOnUpdate                    

                if propertyFormat is not None:
                    prop['format'] = propertyFormat

                if propertySubType is not None:
                    prop['subtype'] = propertySubType
                    prop['subtypeReference'] = isSubTypeReference

                if 'key' in entity and propertyName == entity['key'] and 'autokey' in entity and entity['autokey']:
                    isRequired = False
                    allowCreate = False
                    allowUpdate = False
                
                if 'autonumber' in entity and propertyName == entity['autonumber']:
                    isRequired = False
                    allowCreate = False
                    allowUpdate = False

                prop['required'] = isRequired
                prop['allowRead'] = allowRead
                prop['allowCreate'] = allowCreate
                prop['allowUpdate'] = allowUpdate

                if minimum is not None:
                    prop['minimum'] = minimum
                if maximum is not None:
                    prop['maximum'] = maximum

                entities[entityName]['properties'][propertyName] = prop
                # print(prop)
                # exit()

            entities[entityName]['filters'] = {}   
            if 'filters' in entity:
                for filterProp, metadata in entity['filters'].items():
                    if metadata is None:
                        entities[entityName]['filters'][filterProp] = entities[entityName][filterProp]['filterOperator']
                    else:
                        metaParts = metadata.split(' ')
                        entities[entityName]['filters'][filterProp] = metaParts[0]

        return entities

def parseData(file:str):
    data = {}
    with open(file, 'r', encoding='utf-8') as f:
        data:dict = yaml.safe_load(f)["data"]
    return data