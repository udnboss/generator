
def genEndPoints(entityName, schema):
    ""

def genSchema(entities:dict, openApiSchema:dict):
    routers = {}
    for entityName in entities:
        schema = {
            'store': openApiSchema[entityName],
            'create': openApiSchema[f'{entityName}Create'],
            'update': openApiSchema[f'{entityName}Update'],
            'partial': openApiSchema[f'{entityName}Partial'],
            'view': openApiSchema[f'{entityName}View'],
        }

        routers[entityName] = genEndPoints(entityName, schema)

    return routers

