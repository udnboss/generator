import json

with open('templates/expressInterface.ts', 'r', encoding='utf-8') as f:        
    INTERFACES_TEMPLATE = f.read()
with open('templates/expressRouter.ts', 'r', encoding='utf-8') as f:        
    ROUTER_TEMPLATE = f.read()

def pluralize(s:str) -> str:
        if s.endswith('y'):
            s = f'{s[:-1]}ies'
        else: 
            s += 's'
        return s

def genRouterAndInterfaces(entityName:str, schema:dict) -> tuple[str,str]:

    def getTypeProps(schemaName:str) -> str:
        typeProps = {}
        for prop, attrs in schema[schemaName]['properties'].items():
            typeProp = {
                'required': 'required' in schema[schemaName] and prop in schema[schemaName]['required'],
                'type': attrs["type"] if 'type' in attrs else attrs["$ref"].split('/')[-1].replace('View', '')
            }
            typeProps[prop] = typeProp

        return json.dumps(typeProps, ensure_ascii=False, indent=2)
    
    createTypeProps = getTypeProps('create')
    updateTypeProps = getTypeProps('update')
    partialTypeProps = getTypeProps('partial')
    viewTypeProps = getTypeProps('view')
    
    def getInterface(schemaName:str):
        interface = []
        for prop, attrs in schema[schemaName]['properties'].items():
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
            
            if type == 'integer':
                type = 'number'

            interface.append(f'{prop}{optional}:{type};')
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
    routerScript = ROUTER_TEMPLATE

    for find, repl in replacements.items():
        interfacesScript = interfacesScript.replace(find, repl)
        routerScript = routerScript.replace(find, repl)
    
    return routerScript, interfacesScript

def genCode(entities:dict, openApiSchemas:dict):
    routers = {}
    interfaces = {}
    for entityName in entities:
        schema = {
            'store': openApiSchemas[entityName],
            'create': openApiSchemas[f'{entityName}Create'],
            'update': openApiSchemas[f'{entityName}Update'],
            'partial': openApiSchemas[f'{entityName}Partial'],
            'view': openApiSchemas[f'{entityName}View'],
        }

        routers[entityName], interfaces[entityName] = genRouterAndInterfaces(entityName, schema)

    return routers, interfaces

