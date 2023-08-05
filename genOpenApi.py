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
                isRequired = True
                propertyType = 'string'
                propertySubType = None
                propertyFormat = None
                isTypeReference = False
                isSubTypeReference = False
                refEntity = None               

                if property.endswith('?'):
                    propertyName = property.split('?')[0]
                    isRequired = False
                
                if isinstance(metadata, str):                  
                    if metadata.endswith('[]'):
                        propertyType = 'array'
                        propertySubType = metadata.split('[]')[0]
                        if propertySubType.startswith('='):
                            propertySubType = propertySubType[1:]
                            isSubTypeReference = True
                    else:
                        if ' > ' in metadata:
                            propertyType, refEntity = metadata.split(' > ')
                            refEntity, refEntityProperty = refEntity.split('.')                        
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

                entities[entityName][propertyName] = prop
                
        return entities
    
def genSchema(entities:dict):
    schemas = {}
    for entityName, properties in entities.items():
        entityNameView = f"{entityName}View"
        schemas[entityName] = {'type': 'object', 'properties': {}}
        schemas[entityNameView] = {'type': 'object', 'properties': {}}
        for propertyName, metadata in properties.items():
            prop = {}
            if 'format' in metadata:
                prop['format'] = metadata['format']

            if metadata['typeReference']:
                prop['$ref'] = f"#/components/schemas/{metadata['type']}"
            else:
                prop['type'] = metadata['type']

            if 'subtype' in metadata:
                if metadata['subtypeReference']:
                    prop['items'] = {'$ref': f"#/components/schemas/{metadata['subtype']}"}
                else:
                    prop['items'] = {'type': {metadata['subtype']}}

            if not '$ref' in prop and not 'items' in prop:
                schemas[entityName]['properties'][propertyName] = prop
            
            schemas[entityNameView]['properties'][propertyName] = prop.copy()
        
        schemas[entityName]['required'] = [n for n, v in properties.items() if v['required']]

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
    for entityName, properties in entities.items():
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
            'operationId': f'delete{entityName.capitalize()}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to delete',
                    'required': True,
                    'schema': {
                        'type': properties['id']['type']
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
            'operationId': f'get{entityName.capitalize()}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to get',
                    'required': True,
                    'schema': {
                        'type': properties['id']['type']
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

        paths[f'{prefix}/{pluralize(entityName)}'] = {
            'get': getPath,
            'post': postPath,
            'put': putPath
        }

        paths[f'{prefix}/{pluralize(entityName)}/{{id}}'] = {
            'get': getOnePath,
            'delete': deletePath,
        }
    
    return paths
