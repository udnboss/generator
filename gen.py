

import sys
import yaml

from inputParser import parseEntities, parseData
from genOpenApi import genSchema, genInfo, genPaths, genTags
from genExpressApi import createFiles as createExpressFiles
from genDotnetApi import createFiles as createDotnetFiles
from genSqliteSql import genSchema as genSqlSchema, genData as genSqlData, genSecurityData

class NoAliasDumper(yaml.SafeDumper):
    def ignore_aliases(self, data):
        return True
    
gentype = sys.argv[1]
gensource = sys.argv[2]
genoutput = gensource.split('/')[-1].split('.')[0]

with open(gensource, 'r', encoding='utf-8') as f:
    inputProfile: dict = yaml.safe_load(f)

if gentype == 'test':
    entities = parseEntities(gensource)
    with open('output/test.yml', 'w', encoding='utf-8') as f:
        f.write(yaml.dump(entities))

if gentype == 'docs':
    entities = parseEntities(gensource)

    apiTitle = inputProfile['api']['title']
    apiDescription = inputProfile['api']['description']
    apiVersion = inputProfile['api']['version']
    apiPrefix = inputProfile['api']['prefix']
    servers = inputProfile['api']['servers']

    info = genInfo(title=apiTitle, description=apiDescription,
                   version=apiVersion)
    paths = genPaths(apiPrefix, entities=entities)
    tags = genTags(entities=entities)
    schemas = genSchema(entities=entities)

    RESPONSE_SCHEMA = {
        'schema': {
            'properties': {
                'success': {'type': 'boolean'},
                'data': {'type': 'string'},
                'message': {'type': 'string'}
            }
        }
    }

    basePaths = {
        "/": {
            "get": {
                "description": "Obtain CSRF cookie",
                "operationId": "home",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "summary": "home"
            }
        },
        "/login": {
            "post": {
                "description": "perform a login attempt",
                "operationId": "login",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "default": "test"
                                    },
                                    "password": {
                                        "type": "string",
                                        "default": "skgjhsdgklj"
                                    }
                                }
                            }
                        }
                    },
                    "description": "Perform a login attempt",
                    "required": True
                },
                "responses": {
                    '200': {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },
                        'description': 'successful operation'
                    },
                    '400': {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },'description': 'bad request'
                    },
                    '403': {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },'description': 'invalid username or password'
                    },
                    '405': {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },'description': 'invalid input'
                    }
                },
                'summary': 'Perform a login attempt'
            }
        },
        "/logout": {
            "get": {
                "description": "Logout",
                "operationId": "logout",
                "responses": {
                    "200": {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },
                        'description': 'successful operation'
                    }
                },
                "summary": "Perform a logout"
            }
        },
        "/refresh": {
            "get": {
                "description": "Request to Refresh current access token manually",
                "operationId": "refreshToken",
                "responses": {
                    "200": {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },
                        'description': 'successful operation'
                    },
                    '403': {
                        'content': {
                            'application/json': RESPONSE_SCHEMA
                        },'description': 'expired refresh token'
                    }
                },
                "summary": "Request to Refresh current access token manually"
            }
        }
    }

    api = {
        'openapi': '3.0.3',
        'info': info,
        'servers': servers,
        'tags': tags,
        'paths': { **basePaths, **paths},
        'security': [
            {'cookieAccessToken': [], 'cookieRefreshToken': []},
            # {'bearer': []},
            # {'key': []},
            # {'oauth': ['read', 'write']},
        ],
        'components': {
            'schemas': schemas,
            'securitySchemes': {
                'bearer': {
                    'type': 'http',
                    'scheme': 'bearer'
                },
                'cookieAccessToken': {
                    'type': 'apiKey',
                    'in': 'cookie',
                    'name': 'x-access-token'
                },
                'cookieRefreshToken': {
                    'type': 'apiKey',
                    'in': 'cookie',
                    'name': 'x-refresh-token'
                },
                'key': {
                    'type': 'apiKey',
                    'in': 'header',
                    'name': 'X-API-Key'
                },
                'oauth': {
                    'type': 'oauth2',
                    'flows': {
                        'authorizationCode': {
                            'authorizationUrl': 'https://example.com/oauth/authorize',
                            'tokenUrl': 'https://example.com/oauth/token',
                            'scopes': {
                                'read': 'Grants read access',
                                'write': 'Grants write access',
                                'admin': 'Grants access to admin operations'
                            }
                        }
                    }
                }
            }
        }
    }

    outputFile = inputProfile['api']['outputFile']

    with open(outputFile, 'w', encoding='utf-8') as f:
        f.write(yaml.dump(api, Dumper=NoAliasDumper))

if gentype == 'api':
    scriptsOutputDir = inputProfile['scripts']['outputDir']
    targetFramework = inputProfile['scripts']['framework']

    if targetFramework == "express":
        createFiles = createExpressFiles
    elif targetFramework == "fastapi":
        raise Exception("Not Implemented Yet!")
    elif targetFramework == "webapi":
        createFiles = createDotnetFiles
    else:
        raise Exception("Unsupported framework")

    entities = parseEntities(gensource)
    schemas = genSchema(entities=entities)
    createFiles(scriptsOutputDir, entities, schemas)

if gentype == 'sql':
    entities = parseEntities(gensource)
    sql = genSqlSchema(entities)
    schemaOutputFile = inputProfile['sql']['schemaOutputFile']
    with open(f'{schemaOutputFile}', 'w', encoding='utf-8') as f:
        f.write(sql)

if gentype == 'data':
    entities = parseEntities(gensource)
    data = parseData(gensource)
    sql = genSqlData(data)
    sql += "\n\n\n" + genSecurityData(entities)
    dataOutputFile = inputProfile['sql']['dataOutputFile']
    with open(f'{dataOutputFile}', 'w', encoding='utf-8') as f:
        f.write(sql)
