
import yaml

BASE_DATATYPES = 'str int float date datetime time'.split(' ')
STR_TYPE_FORMATS = 'date email'.split(' ')
REFERENTIAL_INTEGRITY_OPTIONS = 'd-cascade d-setnull d-restrict d-ignore'.split(' ')

def parseEntities(file:str):
    entities = {}
    with open(file, 'r', encoding='utf-8') as f:
        input:dict = yaml.safe_load(f)
        entityName:str
        entity:dict
        property:str
        metadata:str

        for entityName, entity in input['interfaces'].items():
            entities[entityName] = {}
            for property, metadata in entity.items():
                propertyName = property
                isRequired = True
                allowUpdate = True
                allowCreate = True
                allowRead = True
                propertyType = 'string'
                propertySubType = None
                propertyFormat = None
                isTypeReference = False
                isSubTypeReference = False
                refEntity = None               

                if propertyName.endswith('?'):
                    propertyName = propertyName.split('?')[0]
                    isRequired = False
                    
                if propertyName.endswith('*'):
                    propertyName = propertyName.split('*')[0]
                    allowUpdate = False
                
                if propertyName.endswith('!'):
                    propertyName = propertyName.split('!')[0]
                    allowCreate = False

                if propertyName.endswith('$'):
                    propertyName = propertyName.split('$')[0]
                    allowRead = False
                
                if isinstance(metadata, str):                  
                    if metadata.endswith('[]'):
                        propertyType = 'array'
                        propertySubType = metadata.split('[]')[0]
                        if propertySubType.startswith('='):
                            propertySubType = propertySubType[1:]
                            isSubTypeReference = True
                        elif '|' in propertySubType:
                            propertySubType, propertyFormat = metadata.split('|')
                    else:                        
                        if ' > ' in metadata:
                            propertyType, refEntity = metadata.split(' > ')
                            if '|' in propertyType:
                                propertyType, propertyFormat = propertyType.split('|')
                            refEntity, refEntityProperty = refEntity.split('.')                        
                        else:
                            if '|' in metadata:
                                propertyType, propertyFormat = metadata.split('|')
                            else:
                                propertyType = metadata

                        if propertyType.startswith('='):
                            propertyType = propertyType[1:]
                            isTypeReference = True


                else: #object
                    propertyType = metadata['type']
                    if 'format' in metadata:
                        propertyFormat = metadata['format']
                
                prop = {'type': propertyType}

                prop['typeReference'] = isTypeReference

                if refEntity is not None:
                    prop['constraintEntity'] = refEntity
                    prop['constraintEntityProperty'] = refEntityProperty

                if propertyFormat is not None:
                    prop['format'] = propertyFormat

                if propertySubType is not None:
                    prop['subtype'] = propertySubType
                    prop['subtypeReference'] = isSubTypeReference
                                    
                prop['required'] = isRequired
                prop['allowRead'] = allowRead
                prop['allowCreate'] = allowCreate
                prop['allowUpdate'] = allowUpdate

                entities[entityName][propertyName] = prop
                # print(prop)
                # exit()
                
        return entities
