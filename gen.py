

import sys
import yaml

from inputParser import parseEntities, parseData
from genOpenApi import genSchema, genInfo, genPaths, genTags
from genExpressApi import createFiles as createExpressFiles
from genSqliteSql import genSchema as genSqlSchema, genData as genSqlData

gentype = sys.argv[1]
gensource = sys.argv[2]
genoutput = gensource.split('/')[-1].split('.')[0]

with open(gensource, 'r', encoding='utf-8') as f:
    inputProfile:dict = yaml.safe_load(f)

if gentype == 'test':
    entities = parseEntities(gensource)
    print(yaml.dump(entities))

if gentype == 'docs':
    entities = parseEntities(gensource)
    
    apiTitle = inputProfile['api']['title']
    apiDescription = inputProfile['api']['description']
    apiVersion = inputProfile['api']['version']
    apiPrefix = inputProfile['api']['prefix']
    servers = inputProfile['api']['servers']

    info = genInfo(title=apiTitle, description=apiDescription, version=apiVersion)
    paths = genPaths(apiPrefix, entities=entities)
    tags = genTags(entities=entities)
    schemas = genSchema(entities=entities)

    api = {
        'openapi': '3.0.3',
        'info': info,
        'servers': servers,
        'tags': tags,
        'paths': paths,
        'components': {
            'schemas': schemas
        }
    }

    outputFile = inputProfile['api']['outputFile']

    with open(outputFile, 'w', encoding='utf-8') as f:
        f.write(yaml.dump(api))

if gentype == 'api':
    scriptsOutputDir = inputProfile['scripts']['outputDir']
    targetFramework = inputProfile['scripts']['framework']

    if targetFramework == "express":
        createFiles = createExpressFiles
    elif targetFramework == "fastapi":
        raise Exception("Not Implemented Yet!")
    elif targetFramework == "webapi":
        raise Exception("Not Implemented Yet!")
    else:
        raise Exception("Unsupported framework")
    
    entities = parseEntities(gensource)
    schemas = genSchema(entities=entities)
    createFiles(scriptsOutputDir, entities, schemas)

if gentype == 'sql':
    entities = parseEntities(gensource)
    sql = genSqlSchema(entities)
    schemaOutputDir = inputProfile['sql']['schemaOutputDir']
    with open(f'{schemaOutputDir}', 'w', encoding='utf-8') as f:
        f.write(sql)

if gentype == 'data':
    data = parseData(gensource)
    sql = genSqlData(data)
    dataOutputFile = inputProfile['sql']['dataOutputFile']
    with open(f'{dataOutputFile}', 'w', encoding='utf-8') as f:
        f.write(sql)