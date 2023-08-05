

import sys
import yaml

from genOpenApi import genSchema, parseEntities, genInfo, genPaths, genTags

gentype = sys.argv[1]
gensource = sys.argv[2]

if gentype == 'openapi':
    entities = parseEntities(gensource)
    print(yaml.dump(entities, indent=2))
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
        