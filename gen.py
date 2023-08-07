

import sys
import yaml

from genOpenApi import genSchema, parseEntities, genInfo, genPaths, genTags
from genExpressApi import createFiles as createExpressFiles

gentype = sys.argv[1]
gensource = sys.argv[2]
genoutput = gensource.split('/')[-1].split('.')[0]

with open(gensource, 'r', encoding='utf-8') as f:
    inputProfile:dict = yaml.safe_load(f)

if gentype == 'docs':
    entities = parseEntities(gensource)
    
    apiTitle = inputProfile['api']['title']
    apiDescription = inputProfile['api']['description']
    apiVersion = inputProfile['api']['version']
    apiPrefix = inputProfile['api']['prefix']

    info = genInfo(title=apiTitle, description=apiDescription, version=apiVersion)
    paths = genPaths(apiPrefix, entities=entities)
    tags = genTags(entities=entities)
    schemas = genSchema(entities=entities)

    api = {
        'openapi': '3.0.3',
        'info': info,
        'servers': [{'url': 'http://127.0.0.1:8001'}],
        'tags': tags,
        'paths': paths,
        'components': {
            'schemas': schemas
        }
    }

    with open(f'output/{gensource.split("/")[-1]}', 'w', encoding='utf-8') as f:
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


