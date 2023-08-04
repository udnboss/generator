

import sys
import yaml

from genOpenApi import genSchema, parseEntities

gentype = sys.argv[1]
gensource = sys.argv[2]

if gentype == 'openapi':
    entities = parseEntities(gensource)
    print(yaml.dump(entities, indent=2))
    # genSchema(gensource)
    openApiSchema = genSchema(entities=entities)
    print(yaml.dump(openApiSchema))
