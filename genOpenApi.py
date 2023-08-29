TYPE_MAP = {
    'array': 'array',
    'str': 'string',
    'uuid': 'string',
    'date': 'string',
    'datetime': 'string',
    'time': 'string',
    'bool': 'boolean',
    'float': 'number',
    'int': 'integer',
}

AUTO_TYPE_FORMATS = {
    'uuid': 'uuid',
    'date': 'date',
    'datetime': 'date-time',    
    'time': 'time',
}

def genSchema(entities:dict):
    schemas = {}
    for entityName, entity in entities.items():
        properties = entity['properties']

        entityNameQuery = f"{entityName}Query"
        entityNameCreate = f"{entityName}Create"
        entityNameUpdate = f"{entityName}Update"
        entityNamePartial = f"{entityName}Partial"
        entityNameView = f"{entityName}View"

        clientQueryProps = []
        if 'sort' in entity:
            clientQueryProps = [p.split(' ')[0] for p in entity['sort']]
        
        if 'sortable' in entity:
            clientQueryProps += [p for p in entity['sortable'] if '.' not in p]

        clientQueryProps += [pn for pn, atrs in properties.items() if 'filterOperator' in atrs]

        schemas[entityNameQuery] = {'type': 'object', 'properties': {}}
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
                    prop['type'] = 'object'
                    prop['properties'] = {
                        'count': {'type': 'integer'},
                        'total': {'type': 'integer'},
                        'result': {
                            'type': 'array',
                            'items':{'$ref': f"#/components/schemas/{metadata['subtype']}View"}
                        }
                    }

                    # prop['items'] = {'$ref': f"#/components/schemas/{metadata['subtype']}View"}
                else:
                    metadataSubType = metadata['subtype']
                    prop['items'] = {'type': TYPE_MAP[metadataSubType]}
                    if metadataSubType in AUTO_TYPE_FORMATS:
                        prop['items']['format'] = AUTO_TYPE_FORMATS[metadataSubType]
            
            schemas[entityName]['properties'][propertyName] = prop
            if not '$ref' in prop and not 'items' in prop:
                
                # print(entityName, propertyName, prop)
                if metadata['allowRead'] and propertyName in clientQueryProps:
                    schemas[entityNameQuery]['properties'][propertyName] = prop.copy()

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

    def getQueryParams(entityNameCapitalizedPlural:str, entity:dict):
        params = []
        clientQueryProps = []
        if 'sort' in entity:
            clientQueryProps = [p.split(' ')[0] for p in entity['sort']]
        
        if 'sortable' in entity:
            clientQueryProps += [p for p in entity['sortable'] if '.' not in p]

        for prop in set(clientQueryProps):
            param = {
                'name': prop,
                'in': 'query',
                'description': f'Filter {entityNameCapitalizedPlural} by {prop}',
                'schema': {
                    'type': 'string'
                }
            }
            params.append(param)

        return params

    ERROR_RESPONSE_SCHEMA = {
        'schema': {
            'type': 'object',
            'properties': {
                'success': {'type': 'boolean'},
                'message': {'type': 'string'},
                'data': {'type': 'string'},
            }
        }                            
    }

    def getSuccessSingleResponseSchema(entityName:str):
        return {
            'schema': {
                'type': 'object',
                'properties': {
                    'success': {'type': 'boolean'},
                    'message': {'type': 'string'},
                    'data': {
                        '$ref': f'#/components/schemas/{entityName}View'
                    },
                }
            }                            
        }


    paths = {}
    entityName:str
    properties:dict
    for entityName, entity in entities.items():
        properties = entity['properties']
        idType = TYPE_MAP[properties['id']['type']]
        entityNamePlural = pluralize(entityName)
        entityNameCapitalized = entityName.capitalize()
        entityNameCapitalizedPlural = pluralize(entityNameCapitalized)
        queryParams = getQueryParams(entityNameCapitalizedPlural, entity)

        getPath = {
            'tags': [entityName],
            'summary': f'get all {entityName} entities',
            'description': f'get all {entityName} entities',
            'operationId': f'get{entityNameCapitalizedPlural}',
            'parameters': queryParams,
            'responses': {
                '200': {
                    'description': 'successful operation',
                    'content': {
                        'application/json': {
                            'schema':  {
                                'type': 'object',
                                'properties': {
                                    'success': {'type': 'boolean'},
                                    'message': {'type': 'string'},
                                    'data': {
                                        'type': 'object',
                                        'properties': {
                                            'count': {'type': 'integer'},
                                            'total': {'type': 'integer'},
                                            'result': {
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
                    }
                },
                '400': {
                    'description': 'Invalid Request',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
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
                        'application/json': getSuccessSingleResponseSchema(entityName)
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '405': {
                    'description': 'invalid input',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
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
                        'application/json': getSuccessSingleResponseSchema(entityName)
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '400': {
                    'description': 'Invalid ID',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '404': {
                    'description': f'{entityName} not found',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '405': {
                    'description': 'Invalid input',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
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
                        'application/json': getSuccessSingleResponseSchema(entityName)
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '400': {
                    'description': 'Invalid ID',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '404': {
                    'description': f'{entityName} not found',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '405': {
                    'description': 'Invalid input',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
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
                        'application/json': getSuccessSingleResponseSchema(entityName)
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '400': {
                    'description': f'Invalid {entityName} id',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '404': {
                    'description': f'{entityName} not found',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
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
                        'application/json': getSuccessSingleResponseSchema(entityName)
                    }
                },
                '401': {
                    'description': f'User not logged in',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '403': {
                    'description': f'Forbidden/Access Denied',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '400': {
                    'description': f'Invalid {entityName} id',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
                },
                '404': {
                    'description': f'{entityName} not found',
                    'content': {
                        'application/json': ERROR_RESPONSE_SCHEMA
                    }
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
