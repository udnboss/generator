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

def genTags(entities:dict):
    tags = []
    for entityName in entities:
        tags.append({
            'name': entityName,
            'description': f'{entityName} Entities',            
        })
    return tags

def genInfo(title, description, version):
    info = {
        'title': title,
        'description': description,
        'version': version
    }

    return info

def genPaths(prefix:str, entities:dict):
    def pluralize(s:str):
        if s.endswith('y'):
            s = f'{s[:-1]}ies'
        else: 
            s += 's'
        return s

    paths = {}
    for entityName, _ in entities.items():
        getPath = {
            'tags': [entityName],
            'summary': f'get all {entityName} entities',
            'description': f'get all {entityName} entities',
            'operationId': f'get{pluralize(entityName.capitalize())}',
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': f'#/components/schemas/{entityName}'
                                }
                            }
                        }
                    }
                }
            }
        }
        postPath = {
            'tags': [entityName],
            'summary': f'Add a new {entityName} entity',
            'description': f'Add a new {entityName} entity',
            'operationId': f'add{entityName.capitalize()}',
            'requestBody': {
                'description': f'Create a new {entityName} entity',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': f'#/components/schemas/{entityName}'
                        }
                    }
                },
                'required': True
            },
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref': f'#/components/schemas/{entityName}'
                            }
                        }
                    }
                },
                '405': {
                    'description': 'invalid input'
                }
            }
        }
        putPath = {
            'tags': [entityName],
            'summary': f'Update an existing {entityName} entity',
            'description': f'Update an existing {entityName} entity',
            'operationId': f'update{entityName.capitalize()}',
            'requestBody': {
                'description': f'Update an existing {entityName} entity',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': f'#/components/schemas/{entityName}'
                        }
                    }
                },
                'required': True
            },
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref': f'#/components/schemas/{entityName}'
                            }
                        }
                    }
                },
                '400': {
                    'description': 'Invalid ID'
                },
                '404': {
                    'description': f'{entityName} not found'
                },
                '405': {
                    'description': 'Invalid input'
                }
            }
        }

        paths[f'/{entityName}'] = {
            'get': getPath,
            'post': postPath,
            'put': putPath
        }
    
    return paths
