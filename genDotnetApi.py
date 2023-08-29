import json

TYPE_MAP = {
    'string': 'string',
    'boolean': 'bool',
    'number': 'decimal',
    'integer': 'int',
    'date': 'datetime',
    'datetime': 'datetime',
}

OP_MAP = {
    'like': 'Contains',
    'e': 'Equals',
    'ne': 'NotEquals',
    'gt': 'GreaterThan',
    'gte': 'GreaterThanOrEqual',
    'lt': 'LessThan',
    'lte': 'LessThanOrEqual',
    'nul': 'IsNull',
    'nnul': 'IsNotNull',
    'sw': 'StartsWith',
    'ew': 'EndsWith',
    'bt': 'Between',
    'nbt': 'NotBetween',
}

with open('templates/dotnetClass.cs', 'r', encoding='utf-8') as f:        
    CLASSES_TEMPLATE = f.read()    
with open('templates/dotnetRouter.cs', 'r', encoding='utf-8') as f:        
    ROUTER_TEMPLATE = f.read()
with open('templates/dotnetBusiness.cs', 'r', encoding='utf-8') as f:        
    BUSINESS_TEMPLATE = f.read()    
with open('templates/dotnetBase.cs', 'r', encoding='utf-8') as f: 
    BASE_TEMPLATE = f.read()

def pluralize(s:str) -> str:
        if s.endswith('y'):
            s = f'{s[:-1]}ies'
        else: 
            s += 's'
        return s

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
        prefix = ""
        interface = []
        prop:str
        for prop, attrs in schema[schemaName]['properties'].items():
            if prop == "id":
                continue
            propName = prop.capitalize()
            optional = '?' if 'required' not in schema[schemaName] or prop not in schema[schemaName]['required'] else ''
            root:str
            if '$ref' in attrs:                
                root = attrs["$ref"].split('/')[-1].replace('View', '')
                type = f"{prefix}{root.capitalize()}View"
            elif attrs['type'] == 'array':
                root = attrs['items']["$ref"].split('/')[-1].replace('View', '')
                type = f"QueryResult<{root.capitalize()}Query, {prefix}{root.capitalize()}View>"
            else:
                type = attrs["type"]  
            
            tsType = TYPE_MAP[type] if type in TYPE_MAP else type

            interface.append(f'public {tsType}{optional} {propName} {{ get; set; }};')
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
            name = prop.capitalize()
            p = entity['properties'][prop]
            type = TYPE_MAP[p['type']]
            optional = '' if p['required'] else '?'
            default = "" if p['default'] is None else p['default']
            if type == 'string':
                default = f'"{default}"'
            requiredAttr = '[Required]' if p['required'] else ''
            minLength = f"[MinLength({p['filterMin']}')]" if 'filterMin' in p else ''
            maxLength = f"[MaxLength({p['filterMax']}')]" if 'filterMax' in p else ''

            props.append(f'{requiredAttr}{minLength}{maxLength} public {type}{optional} {name} {{ get; set; }} = {default}')

        return "\n    ".join(props)
    
    def getDataQueryConditions():
        if 'filters' not in entity:
            return ""
        
        conds = []

        for prop in entity['filters']:
            name = prop.capitalize()
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
            name = prop.capitalize()
            # p = entity['properties'][prop]
            # op = OP_MAP[p['filterOperator']]
            cond = f"""
            if(c.Column == "{name}") clientQuery.{name} = c.Value as string;
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
            propName = prop.capitalize()
            props.append(f'{propName} = x.{propName}')

        return ", ".join(props)

    def getCreateProjection():
        props = []
        prop:str
        for prop, attrs in entity['properties'].items():
            if not attrs['allowCreate'] or attrs['typeReference'] or attrs['type'] == 'array' or prop == 'id':
                continue
            propName = prop.capitalize()
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
            name = prop.capitalize()
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
            name = prop.capitalize()
            sortCond = f"""
                if (s.Column == "{name}")
                {{
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.{name}) : sortedQ.ThenBy(x => x.{name}) 
                        : sortedQ is null ? q.OrderByDescending( x => x.{name}) : sortedQ.ThenByDescending(x => x.{name});
                }}
                """
            conds.append(sortCond)
        return "\n\n".join(conds)
    
    replacements = {

        "__EntityName__": entityName,
        "__EntityNameCapitalized__": entityName.capitalize(),
        "__EntityNameCapitalizedPlural__": pluralize(entityName.capitalize()),

        "__EntityWhereProps__": getWhereConditions(),
        "__EntitySortProps__": getSortConditions(),

        "__EntityDataQueryConditions__": getDataQueryConditions(),
        "__EntityClientQueryConditions__": getClientQueryConditions(),

        "__EntityClass__": storeClass,
        "__EntityCreateClass__": createClass,
        "__EntityUpdateClass__": updateClass,
        "__EntityPartialClass__": partialClass,
        "__EntityViewClass__": viewClass,
        "__EntityQueryClass__": getQueryClass(), 

        "__EntityGetViewProjection__": getViewProjection(),
        "__EntityCreateProjection__": getCreateProjection(),

    }
    
    classesScript = CLASSES_TEMPLATE
    routerScript = ROUTER_TEMPLATE
    businessScript = BUSINESS_TEMPLATE

    for find, repl in replacements.items():
        classesScript = classesScript.replace(find, repl)
        routerScript = routerScript.replace(find, repl)
        businessScript = businessScript.replace(find, repl)

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

    return routers, businesses, classes, BASE_TEMPLATE

def createFiles(scriptsOutputDir:str, entities:dict, openApiSchemas:dict):
    routers, businesses, classes, base = _genCode(entities=entities, openApiSchemas=openApiSchemas)

    for entity, script in classes.items():
        with open(f'{scriptsOutputDir}/Models/{entity}Class.cs', 'w', encoding='utf-8') as f:
            f.write(script)

    for entity, script in routers.items():
        with open(f'{scriptsOutputDir}/Controllers/{entity}Controller.cs', 'w', encoding='utf-8') as f:
            f.write(script)
    
    for entity, script in businesses.items():
        with open(f'{scriptsOutputDir}/Business/{entity}Business.cs', 'w', encoding='utf-8') as f:
            f.write(script)
    
    with open(f'{scriptsOutputDir}/Business/Base.cs', 'w', encoding='utf-8') as f:
        f.write(base)