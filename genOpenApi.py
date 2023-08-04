import yaml
class entity:
    pass

def parseEntities(file:str):
    entities = {}
    with open(file, 'r', encoding='utf-8') as f:
        input:dict = yaml.safe_load(f)
        for entityName, entity in input['interfaces'].items():
            entities[entityName] = {}
            for property, metadata in entity.items():
                propertyName = property
                isRequired = False
                propertyType = 'string'
                propertySubType = None
                propertyFormat = None

                if property.endswith('?'):
                    propertyName = property.split('?')[0]
                    isRequired = True
                
                if isinstance(metadata, str):
                    if metadata.endswith('[]'):
                        propertyType = 'array'
                        propertySubType = metadata.split('[]')[0]
                else:
                    propertyType = metadata['type']
                    if 'format' in metadata:
                        propertyFormat = metadata['format']
                
                prop = {'type': propertyType}

                if propertyFormat is not None:
                    prop['format'] = propertyFormat

                if propertySubType is not None:
                    prop['subtype'] = propertySubType
                
                if isRequired:
                    prop['required'] = True

                entities[entityName][propertyName] = prop
                
        return entities
    
def genSchema(entities:dict):
    schemas = {}
    for entityName, properties in entities.items():
        schemas[entityName] = {'type': 'object', 'properties': {}}
        for propertyName, metadata in properties.items():
            prop = {'type': metadata['type']}
            if 'format' in metadata:
                prop['format'] = metadata['format']
            schemas[entityName]['properties'][propertyName] = prop

    return schemas
