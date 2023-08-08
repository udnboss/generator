import yaml
class entity:
    pass

TYPE_MAP = {
    'array': 'array',
    'str': 'string',
    'date': 'string',
    'datetime': 'string',
    'time': 'string',
    'bool': 'boolean',
    'float': 'number',
    'int': 'integer',
}

AUTO_TYPE_FORMATS = {
    'date': 'date',
    'datetime': 'date-time',    
    'time': 'time',
}

def genSchema(entities:dict):
    schemas = {}
    for entityName, properties in entities.items():
        
        entityNameCreate = f"{entityName}Create"
        entityNameUpdate = f"{entityName}Update"
        entityNamePartial = f"{entityName}Partial"
        entityNameView = f"{entityName}View"

        schemas[entityName] = {'type': 'object', 'properties': {}}
        schemas[entityNameCreate] = {'type': 'object', 'properties': {}}
        schemas[entityNameUpdate] = {'type': 'object', 'properties': {}}
        schemas[entityNamePartial] = {'type': 'object', 'properties': {}}
        schemas[entityNameView] = {'type': 'object', 'properties': {}}
        for propertyName, metadata in properties.items():
            prop = {}

            if 'format' in metadata:
                prop['format'] = metadata['format']

            if metadata['typeReference']:
                prop['$ref'] = f"#/components/schemas/{metadata['type']}View"
            else:
                metadataType = metadata['type']
                prop['type'] = TYPE_MAP[metadataType]
                if not 'format' in prop and metadataType in AUTO_TYPE_FORMATS:
                    prop['format'] = AUTO_TYPE_FORMATS[metadataType]

            if 'subtype' in metadata:
                if metadata['subtypeReference']:
                    prop['items'] = {'$ref': f"#/components/schemas/{metadata['subtype']}View"}
                else:
                    metadataSubType = metadata['subtype']
                    prop['items'] = {'type': TYPE_MAP[metadataSubType]}
                    if metadataSubType in AUTO_TYPE_FORMATS:
                        prop['items']['format'] = AUTO_TYPE_FORMATS[metadataSubType]

            if not '$ref' in prop and not 'items' in prop:
                schemas[entityName]['properties'][propertyName] = prop
                # print(entityName, propertyName, prop)
                if metadata['allowCreate']:
                    schemas[entityNameCreate]['properties'][propertyName] = prop.copy()
                if metadata['allowUpdate']:
                    schemas[entityNameUpdate]['properties'][propertyName] = prop.copy()
                    schemas[entityNamePartial]['properties'][propertyName] = prop.copy()
            
            if metadata['allowRead']:
                schemas[entityNameView]['properties'][propertyName] = prop.copy()
        
            # print(prop)
    
        schemas[entityName]['required'] = [n for n, v in properties.items() if v['required']]
        schemas[entityNameCreate]['required'] = [n for n, v in properties.items() if v['required'] and v['allowCreate']]
        schemas[entityNameUpdate]['required'] = [n for n, v in properties.items() if v['required'] and v['allowUpdate']]

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

def genPaths(prefix:str = "", entities:dict = {}):
    def pluralize(s:str):
        if s.endswith('y'):
            s = f'{s[:-1]}ies'
        else: 
            s += 's'
        return s

    paths = {}
    entityName:str
    properties:dict
    for entityName, properties in entities.items():
        idType = TYPE_MAP[properties['id']['type']]
        entityNamePlural = pluralize(entityName)
        entityNameCapitalized = entityName.capitalize()
        entityNameCapitalizedPlural = pluralize(entityNameCapitalized)
        
        getPath = {
            'tags': [entityName],
            'summary': f'get all {entityName} entities',
            'description': f'get all {entityName} entities',
            'operationId': f'get{entityNameCapitalizedPlural}',
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': f'#/components/schemas/{entityName}View'
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
            'operationId': f'add{entityNameCapitalized}',
            'requestBody': {
                'description': f'Create a new {entityName} entity',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': f'#/components/schemas/{entityName}Create'
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
                                '$ref': f'#/components/schemas/{entityName}View'
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
            'description': f'Update an existing {entityName} entity (all required properties must be supplied)',
            'operationId': f'update{entityNameCapitalized}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to update',
                    'required': True,
                    'schema': {
                        'type': idType
                    }
                }
            ],
            'requestBody': {
                'description': f'Update an existing {entityName} entity',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': f'#/components/schemas/{entityName}Update'
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
                                '$ref': f'#/components/schemas/{entityName}View'
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
        patchPath = {
            'tags': [entityName],
            'summary': f'Modify an existing {entityName} entity',
            'description': f'Modify an existing {entityName} entity (partial update, only provided properties will be updated)',
            'operationId': f'modify{entityNameCapitalized}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to partially update',
                    'required': True,
                    'schema': {
                        'type': idType
                    }
                }
            ],
            'requestBody': {
                'description': f'Modify an existing {entityName} entity',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': f'#/components/schemas/{entityName}Partial'
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
                                '$ref': f'#/components/schemas/{entityName}View'
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
        deletePath = {
            'tags': [entityName],
            'summary': f'Delete an existing {entityName} entity',
            'description': f'Delete an existing {entityName} entity',
            'operationId': f'delete{entityNameCapitalized}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to delete',
                    'required': True,
                    'schema': {
                        'type': idType
                    }
                }
            ],
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref': f'#/components/schemas/{entityName}View'
                            }
                        }
                    }
                },
                '400': {
                    'description': f'Invalid {entityName} id'
                },
                '404': {
                    'description': f'{entityName} not found'
                }
            }
        }
        getOnePath = {
            'tags': [entityName],
            'summary': f'Get an existing {entityName} entity',
            'description': f'Get an existing {entityName} entity',
            'operationId': f'get{entityNameCapitalized}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to get',
                    'required': True,
                    'schema': {
                        'type': idType
                    }
                }
            ],
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref': f'#/components/schemas/{entityName}View'
                            }
                        }
                    }
                },
                '400': {
                    'description': f'Invalid {entityName} id'
                },
                '404': {
                    'description': f'{entityName} not found'
                }
            }
        }

        paths[f'{prefix}/{entityNamePlural}'] = {
            'get': getPath,
            'post': postPath,            
        }

        paths[f'{prefix}/{entityNamePlural}/{{id}}'] = {
            'get': getOnePath,
            'put': putPath,
            'patch': patchPath,
            'delete': deletePath,
        }
    
    return paths
