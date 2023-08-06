import yaml
class entity:
    pass

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
                prop['type'] = metadata['type']

            if 'subtype' in metadata:
                if metadata['subtypeReference']:
                    prop['items'] = {'$ref': f"#/components/schemas/{metadata['subtype']}View"}
                else:
                    prop['items'] = {'type': {metadata['subtype']}}

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
            'operationId': f'update{entityName.capitalize()}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to update',
                    'required': True,
                    'schema': {
                        'type': properties['id']['type']
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
            'operationId': f'modify{entityName.capitalize()}',
            'parameters': [
                {
                    'name': 'id',
                    'in': 'path',
                    'description': f'{entityName} id to partially update',
                    'required': True,
                    'schema': {
                        'type': properties['id']['type']
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
        }

        paths[f'{prefix}/{pluralize(entityName)}/{{id}}'] = {
            'get': getOnePath,
            'put': putPath,
            'patch': patchPath,
            'delete': deletePath,
        }
    
    return paths
