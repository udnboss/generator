import json

TYPE_MAP = {
    'string': 'string',
    'boolean': 'boolean',
    'number': 'number',
    'integer': 'number',
}

with open('templates/expressInterface.ts', 'r', encoding='utf-8') as f:        
    INTERFACES_TEMPLATE = f.read()
with open('templates/expressClass.ts', 'r', encoding='utf-8') as f:        
    CLASSES_TEMPLATE = f.read()    
with open('templates/expressRouter.ts', 'r', encoding='utf-8') as f:        
    ROUTER_TEMPLATE = f.read()
with open('templates/expressBusiness.ts', 'r', encoding='utf-8') as f:        
    BUSINESS_TEMPLATE = f.read()    

with open('templates/expressBase.ts', 'r', encoding='utf-8') as f: 
    BASE_TEMPLATE = f.read()

with open('templates/expressIndex.ts', 'r', encoding='utf-8') as f: 
    INDEX_TEMPLATE = f.read()

def pluralize(s:str) -> str:
        if s.endswith('y'):
            s = f'{s[:-1]}ies'
        else: 
            s += 's'
        return s

def genArtifacts(entityName:str, entity:dict, schema:dict) -> tuple[str,str]:

    def getTypeProps(schemaName:str) -> str:
        typeProps = {}
        for prop, attrs in schema[schemaName]['properties'].items():
            isRequired = 'required' in schema[schemaName] and prop in schema[schemaName]['required']
            isAutoKey = 'autokey' in entity and entity['autokey'] and 'key' in entity and entity['key'] == prop
            typeProp = {
                'required': isRequired and not isAutoKey,
                'type': attrs["type"] if 'type' in attrs else attrs["$ref"].split('/')[-1].replace('View', '')
            }
            typeProps[prop] = typeProp

        return json.dumps(typeProps, ensure_ascii=False, indent=2)
    
    #for validating entities received from client
    createTypeProps = getTypeProps('create')
    updateTypeProps = getTypeProps('update')
    partialTypeProps = getTypeProps('partial')
    # viewTypeProps = getTypeProps('view')
    
    def getInterface(schemaName:str):
        interface = []
        for prop, attrs in schema[schemaName]['properties'].items():
            if prop == "id":
                continue
            optional = '?' if 'required' not in schema[schemaName] or prop not in schema[schemaName]['required'] else ''
            print(schemaName, prop, attrs)
            if '$ref' in attrs:
                root = attrs["$ref"].split('/')[-1].replace('View', '')
                type = f"I{root.capitalize()}View"
            elif attrs['type'] == 'array':
                root = attrs['items']["$ref"].split('/')[-1].replace('View', '')
                type = f"I{root.capitalize()}View[]"
            else:
                type = attrs["type"]  
            
            tsType = TYPE_MAP[type] if type in TYPE_MAP else type

            interface.append(f'{prop}{optional}:{tsType};')
        return '\n    '.join(interface)

    storeInterface = getInterface('store')
    createInterface = getInterface('create')
    updateInterface = getInterface('update')
    partialInterface = getInterface('partial')
    viewInterface = getInterface('view')

    def getImports(schemaName = 'view'):
        imports = []
        refInterfaces = {}
        for _, attrs in schema[schemaName]['properties'].items():
            if '$ref' in attrs or 'items' in attrs:
                if '$ref' in attrs:
                    root = attrs["$ref"].split('/')[-1].replace('View', '')
                elif 'items' in attrs:
                    root = attrs['items']["$ref"].split('/')[-1].replace('View', '')
                if root == entityName:
                    continue
                ref = root.capitalize()
                refInterface = f'I{ref}View'
                refInterfaceFile = f"./{root}Interfaces"
                if refInterfaceFile not in refInterfaces:
                    refInterfaces[refInterfaceFile] = []
                refInterfaces[refInterfaceFile].append(refInterface)

        for refInterfaceFile, interfaceImports in refInterfaces.items():
            interfaceImportsStr = ', '.join(list(set(interfaceImports)))
            importStmt = f'import {{ {interfaceImportsStr} }} from "{refInterfaceFile}";'
            imports.append(importStmt)

        return '\n'.join(imports)
    
    entityImports = getImports('view')      

    replacements = {
        "__EntityImports__": entityImports,
        "__EntityName__": entityName,
        "__EntityNameCapitalized__": entityName.capitalize(),
        "__EntityNameCapitalizedPlural__": pluralize(entityName.capitalize()),
        "__EntityCreateTypeProperties__": createTypeProps,
        "__EntityUpdateTypeProperties__": updateTypeProps,
        "__EntityPartialTypeProperties__": partialTypeProps,
        "__EntityInterface__": storeInterface,
        "__EntityCreateInterface__": createInterface,
        "__EntityUpdateInterface__": updateInterface,
        "__EntityPartialInterface__": partialInterface,
        "__EntityViewInterface__": viewInterface,
    }
    
    interfacesScript = INTERFACES_TEMPLATE
    classesScript = CLASSES_TEMPLATE
    routerScript = ROUTER_TEMPLATE
    businessScript = BUSINESS_TEMPLATE

    for find, repl in replacements.items():
        interfacesScript = interfacesScript.replace(find, repl)
        classesScript = classesScript.replace(find, repl)
        routerScript = routerScript.replace(find, repl)
        businessScript = businessScript.replace(find, repl)

    
    return routerScript, interfacesScript, businessScript, classesScript

def _genCode(entities:dict, openApiSchemas:dict):
    routers = {}
    interfaces = {}
    businesses = {}
    classes = {}
    routeImports = []
    routeUses = []
    for entityName, entity in entities.items():
        schema = {
            'store': openApiSchemas[entityName],
            'create': openApiSchemas[f'{entityName}Create'],
            'update': openApiSchemas[f'{entityName}Update'],
            'partial': openApiSchemas[f'{entityName}Partial'],
            'view': openApiSchemas[f'{entityName}View'],
        }

        routers[entityName], interfaces[entityName], businesses[entityName], classes[entityName] = genArtifacts(entityName, entity, schema)

        routeImports.append(f"import {{ {entityName}Router }} from './{entityName}Route';")
        routeUses.append(f"indexRouter.use('/{pluralize(entityName)}', {entityName}Router);")
    
    index = INDEX_TEMPLATE
    index = index.replace("__EntitiesRoutesImports__", "\n".join(routeImports))
    index = index.replace("__EntitiesRoutesUses__", "\n".join(routeUses))

    return routers, interfaces, businesses, classes, BASE_TEMPLATE, index

def createFiles(scriptsOutputDir:str, entities:dict, openApiSchemas:dict):
    routers, interfaces, businesses, classes, base, index = _genCode(entities=entities, openApiSchemas=openApiSchemas)

    for entity, script in interfaces.items():
        with open(f'{scriptsOutputDir}/{entity}Interfaces.ts', 'w', encoding='utf-8') as f:
            f.write(script)

    for entity, script in classes.items():
        with open(f'{scriptsOutputDir}/{entity}Classes.ts', 'w', encoding='utf-8') as f:
            f.write(script)

    for entity, script in routers.items():
        with open(f'{scriptsOutputDir}/{entity}Route.ts', 'w', encoding='utf-8') as f:
            f.write(script)
    
    for entity, script in businesses.items():
        with open(f'{scriptsOutputDir}/{entity}Business.ts', 'w', encoding='utf-8') as f:
            f.write(script)
    
    with open(f'{scriptsOutputDir}/base.ts', 'w', encoding='utf-8') as f:
        f.write(base)

    with open(f'{scriptsOutputDir}/index.ts', 'w', encoding='utf-8') as f:
        f.write(index)