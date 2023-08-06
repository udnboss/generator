

import sys
import yaml

from genOpenApi import genSchema, parseEntities, genInfo, genPaths, genTags
from genExpressApi import genCode

gentype = sys.argv[1]
gensource = sys.argv[2]
genoutput = gensource.split('/')[-1].split('.')[0]

if gentype == 'openapi':
    entities = parseEntities(gensource)
    # print(yaml.dump(entities, indent=2))
    # genSchema(gensource)
    info = genInfo(title='Sales API', description='SALES API REFERENCE', version='1.0')
    paths = genPaths('/v1', entities=entities)
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

if gentype == 'expressapi':
    entities = parseEntities(gensource)
    schemas = genSchema(entities=entities)
    routers, interfaces = genCode(entities=entities, openApiSchemas=schemas)
    for entity, script in interfaces.items():
        with open(f'output/{genoutput}/{entity}Interfaces.ts', 'w', encoding='utf-8') as f:
            f.write(script)
    
    for entity, script in routers.items():
        with open(f'output/{genoutput}/{entity}Route.ts', 'w', encoding='utf-8') as f:
            f.write(script)


