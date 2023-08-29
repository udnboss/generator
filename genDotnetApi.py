import re

TYPE_MAP = { #str uuid bool int float date datetime time
        'str': 'string',
        'uuid': 'Guid',
        'bool': 'bool',
        'int': 'int',
        'float': 'decimal',
        'date': 'DateTime',
        'datetime': 'DateTime',
        'time': 'DateTime',
    }

OPENAPI_TYPE_MAP = {
    'string': 'string',
    'boolean': 'bool',
    'number': 'decimal',
    'integer': 'int',
    'date': 'DateTime',
    'datetime': 'DateTime',
}

OP_MAP = {
    'like': 'Contains',
    'e': 'Equals',
    'ne': 'NotEquals',
    'gt': 'GreaterThan',
    'gte': 'GreaterThanOrEqual',
    'lt': 'LessThan',
    'lte': 'LessThanOrEqual',
    'in': 'IsIn',
    'nin': 'IsNotIn',
    'nul': 'IsNull',
    'nnul': 'IsNotNull',
    'sw': 'StartsWith',
    'ew': 'EndsWith',
    'bt': 'Between',
    'nbt': 'NotBetween',
}

with open('templates/dotnetClass.cs', 'r', encoding='utf-8') as f:        
    CLASSES_TEMPLATE = f.read()    
with open('templates/dotnetController.cs', 'r', encoding='utf-8') as f:        
    ROUTER_TEMPLATE = f.read()
with open('templates/dotnetBusiness.cs', 'r', encoding='utf-8') as f:        
    BUSINESS_TEMPLATE = f.read()    
with open('templates/dotnetBase.cs', 'r', encoding='utf-8') as f: 
    BASE_TEMPLATE = f.read()
with open('templates/dotnetContext.cs', 'r', encoding='utf-8') as f: 
    CONTEXT_TEMPLATE = f.read()

def pluralize(s:str) -> str:
    if s.endswith('y'):
        s = f'{s[:-1]}ies'
    else: 
        s += 's'
    return s

def toPascalCase(s: str) -> str:
    if s.istitle() and '_' not in s:
        return s
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)', s)
    return ''.join(word.capitalize() for word in words if word)




def genArtifacts(entityName:str, entity:dict, schema:dict) -> tuple[str,str, str, str]:
    TYPE_OPERATORS = { #str uuid bool int float date datetime time
        'str': 'like',
        'uuid': 'in',
        'bool': 'in',
        'int': 'bt',
        'float': 'bt',
        'date': 'bt',
        'datetime': 'bt',
        'time': 'bt',
    }
    
    def getClass(schemaName:str):
        suffix = 'View' if schemaName == 'view' else ''
        prefix = ""
        interface = []
        prop:str
        for prop, attrs in schema[schemaName]['properties'].items():
            if prop == "id":
                continue
            propName = toPascalCase(prop)
            required = 'required' in entity and entity['required']
            optional = '?' if 'required' not in schema[schemaName] or prop not in schema[schemaName]['required'] else ''
            root:str
            if '$ref' in attrs:                
                root = attrs["$ref"].split('/')[-1].replace('View', '')
                type = f"{prefix}{toPascalCase(root)}{suffix}"
            elif attrs['type'] == 'array':
                root = attrs['items']["$ref"].split('/')[-1].replace('View', '')
                type = f"QueryResult<{toPascalCase(root)}Query, {prefix}{toPascalCase(root)}{suffix}>"
            else:
                type = attrs["type"]  
            
            tsType = OPENAPI_TYPE_MAP[type] if type in OPENAPI_TYPE_MAP else type

            p = entity['properties'][prop]   

            if p['type'] == 'uuid':
                tsType = 'Guid'

            if p['type'] in ['date', 'datetime', 'time']:
                tsType = 'DateTime'

            default = "" if 'default' not in p or p['default'] is None else p['default']
            if tsType == 'string':
                default = f'"{default}"'

            setDefault = not required and p['default'] is not None
            
            if default is None or default == "":
                default = "null"     

            propAttrs = []

            if not p['typeReference'] and p['type'] != 'array':
                propAttrs.append(f'[Column("{prop}")]')
            if optional == "":
                propAttrs.append('[Required]')                 
                     
            if p['typeReference']:
                viaPropertyName = toPascalCase(p['typeReferenceViaProperty'])
                propAttrs.append(f'[ForeignKey("{viaPropertyName}")]')
            if 'format' in p and p['format'] == 'email':
                propAttrs.append("[EmailAddress]")

            if p['type'] == 'array':
                subtype = p['subtype'] 
                if p['subtypeReference']:
                    subtype = toPascalCase(subtype)
                    propAttrs.append(f'[InverseProperty("{toPascalCase(entityName)}")]')
                tsType = f"ICollection<{subtype}>"

            if setDefault:
                default = f" = {default};"
            else:
                default = ""

            interface.append(f'{"".join(propAttrs)} public {tsType}{optional} {propName} {{ get; set; }}{default}')
        return '\n    '.join(interface)

    storeClass = getClass('store')
    createClass = getClass('create')
    updateClass = getClass('update')
    partialClass = getClass('partial')
    viewClass = getClass('view')
 
    def getQueryClass():
        if 'filters' not in entity:
            return ""
        
        props = []

        for prop in entity['filters']:
            name = toPascalCase(prop)
            p = entity['properties'][prop]
            type = TYPE_MAP[p['type']]
            optional = '?' #'' if p['required'] else '?'
            default = "" if p['default'] is None else p['default']
            if type == 'string':
                default = f'"{default}"'
            elif default == "":
                default = "null"
            requiredAttr = '' #'[Required]' if p['required'] else ''
            minLength = f"[MinLength({p['minimum']})]" if 'minimum' in p else ''
            maxLength = f"[MaxLength({p['maximum']})]" if 'maximum' in p else ''

            props.append(f'{requiredAttr}{minLength}{maxLength} public {type}{optional} {name} {{ get; set; }} = {default};')

        return "\n    ".join(props)
    
    def getDataQueryConditions():
        if 'filters' not in entity:
            return ""
        
        conds = []

        for prop in entity['filters']:
            name = toPascalCase(prop)
            p = entity['properties'][prop]
            op = OP_MAP[p['filterOperator']]
            cond = f"""
            dataQuery.Where.Add(new Condition(column: "{name}", _operator: Operators.{op}, value: query.{name}));
            """
            conds.append(cond)
        return "".join(conds)
    
    def getClientQueryConditions():
        if 'filters' not in entity:
            return ""
        
        conds = []

        for prop in entity['filters']:
            name = toPascalCase(prop)
            p = entity['properties'][prop]
            optional = '' if p['type'] == "str" else '?'
            type = TYPE_MAP[p['type']]
            # op = OP_MAP[p['filterOperator']]
            cond = f"""
            if(c.Column == "{name}") clientQuery.{name} = c.Value as {type}{optional};
            """
            conds.append(cond)
        return "".join(conds)
        
        return ""
    
    def getViewProjection():
        props = []
        prop:str
        for prop, attrs in entity['properties'].items():
            if not attrs['allowRead'] or attrs['typeReference'] or attrs['type'] == 'array':
                continue
            propName = toPascalCase(prop)
            props.append(f'{propName} = x.{propName}')

        return ", ".join(props)

    def getCreateProjection():
        props = []
        prop:str
        for prop, attrs in entity['properties'].items():
            if not attrs['allowCreate'] or attrs['typeReference'] or attrs['type'] == 'array' or prop == 'id':
                continue
            propName = toPascalCase(prop)
            props.append(f'{propName} = entity.{propName}')

        return ", ".join(props)
    
    def getWhereConditions():
        if 'filters' not in entity:
            return ""
        
        def getFilterSyntax(name, type, op):
            cond = ""
            if type == 'string':
                cond = f"""
                    if (c.Column == "{name}" && c.Operator == Operators.{op} && c.Value != null) 
                    {{
                        var v = c.Value.ToString();
                        if(!string.IsNullOrWhiteSpace(v))
                            q = q.Where(x => x.{name} != null && x.{name}.Contains(v));
                    }}"""
            return cond
               
        conditions = []

        for prop in entity['filters']:
            name = toPascalCase(prop)
            p = entity['properties'][prop]
            type = TYPE_MAP[p['type']]
            op = OP_MAP[p['filterOperator']]
            cond = getFilterSyntax(name, type, op)
            if cond != "":
                conditions.append(cond)
        
        return "\n\n".join(conditions)
    
    def getSortConditions():
        conds = []
        prop:str
        for prop in entity['sortable']:
            name = toPascalCase(prop)
            ref = name
            if '.' in prop:
                refEntity, refName = prop.split('.')
                ref = f"{toPascalCase(refEntity)}!.{toPascalCase(refName)}"
            sortCond = f"""
                if (s.Column == "{name}")
                {{
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.{ref}) : sortedQ.ThenBy(x => x.{ref}) 
                        : sortedQ is null ? q.OrderByDescending( x => x.{ref}) : sortedQ.ThenByDescending(x => x.{ref});
                }}
                """
            conds.append(sortCond)
        return "\n\n".join(conds)
    
    replacements = {

        "__EntityName__": entityName,
        "__EntityNameCapitalized__": toPascalCase(entityName),
        "__EntityNameCapitalizedPlural__": pluralize(toPascalCase(entityName)),

        "__EntityWhereConditions__": getWhereConditions(),
        "__EntitySortConditions__": getSortConditions(),

        "__EntityDataQueryConditions__": getDataQueryConditions(),
        "__EntityClientQueryConditions__": getClientQueryConditions(),

        "__EntityClass__": storeClass,
        "__EntityCreateClass__": createClass,
        "__EntityUpdateClass__": updateClass,
        "__EntityPartialClass__": partialClass,
        "__EntityViewClass__": viewClass,
        "__EntityQueryClass__": getQueryClass(), 

        "__EntityViewProjection__": getViewProjection(),
        "__EntityCreateProjection__": getCreateProjection(),
        

    }
    
    classesScript = CLASSES_TEMPLATE
    routerScript = ROUTER_TEMPLATE
    businessScript = BUSINESS_TEMPLATE
    contextScript = CONTEXT_TEMPLATE

    for find, repl in replacements.items():
        classesScript = classesScript.replace(find, repl)
        routerScript = routerScript.replace(find, repl)
        businessScript = businessScript.replace(find, repl)
        contextScript = contextScript.replace(find, repl)

    return routerScript, businessScript, classesScript

def _genCode(entities:dict, openApiSchemas:dict):
    routers = {}
    businesses = {}
    classes = {}

    for entityName, entity in entities.items():
        schema = {            
            'store': openApiSchemas[entityName],
            'query': openApiSchemas[f'{entityName}Query'],
            'create': openApiSchemas[f'{entityName}Create'],
            'update': openApiSchemas[f'{entityName}Update'],
            'partial': openApiSchemas[f'{entityName}Partial'],
            'view': openApiSchemas[f'{entityName}View'],
        }

        routers[entityName], businesses[entityName], classes[entityName] = genArtifacts(entityName, entity, schema)

    def getContextEntities():
        contextEntities = []
        for k in entities.keys():
            entityName = toPascalCase(k)
            entityNamePlural = pluralize(entityName)
            contextEntities.append(f"public DbSet<{entityName}> {entityNamePlural} {{ get; set; }}")
        return "\n    ".join(contextEntities)

    context = CONTEXT_TEMPLATE.replace("__ContextEntities__", getContextEntities())

    return routers, businesses, classes, BASE_TEMPLATE, context

def createFiles(scriptsOutputDir:str, entities:dict, openApiSchemas:dict):
    routers, businesses, classes, base, context = _genCode(entities=entities, openApiSchemas=openApiSchemas)

    import os

    if not os.path.exists(f'{scriptsOutputDir}/Models'):
        os.mkdir(f'{scriptsOutputDir}/Models')
    if not os.path.exists(f'{scriptsOutputDir}/Controllers'):
        os.mkdir(f'{scriptsOutputDir}/Controllers')
    if not os.path.exists(f'{scriptsOutputDir}/Business'):
        os.mkdir(f'{scriptsOutputDir}/Business')

    for entity, script in classes.items():
        with open(f'{scriptsOutputDir}/Models/{entity.capitalize()}Class.cs', 'w', encoding='utf-8') as f:
            f.write(script)

    for entity, script in routers.items():
        with open(f'{scriptsOutputDir}/Controllers/{entity.capitalize()}Controller.cs', 'w', encoding='utf-8') as f:
            f.write(script)
    
    for entity, script in businesses.items():
        with open(f'{scriptsOutputDir}/Business/{entity.capitalize()}Business.cs', 'w', encoding='utf-8') as f:
            f.write(script)
    
    with open(f'{scriptsOutputDir}/Business/Base.cs', 'w', encoding='utf-8') as f:
        f.write(base)

    with open(f'{scriptsOutputDir}/Business/MyContext.cs', 'w', encoding='utf-8') as f:
        f.write(context)