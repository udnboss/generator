TYPE_MAP = {
    'array': 'text',
    'str': 'text',
    'uuid': 'text',
    'date': 'text',
    'datetime': 'text',
    'time': 'text',
    'bool': 'int',
    'float': 'real',
    'int': 'int',
}

FK_ACTIONS = {
    'd-cascade': 'on delete cascade',
    'd-setnull': 'on delete set null',
    'd-restrict': 'on delete restrict',
    'd-ignore': 'on delete no action',
    'u-cascade': 'on update cascade',
    'u-setnull': 'on update set null',
    'u-restrict': 'on update restrict',
    'u-ignore': 'on update no action',
}

def genFk(propertyName:str, property:str):    
    pkTable = property["constraintEntity"]
    pkTableCol = property["constraintEntityProperty"]
    onDelete = FK_ACTIONS[property["constraintEntityOnDelete"]]
    onUpdate = FK_ACTIONS[property["constraintEntityOnUpdate"]]
    sql = f"foreign key ({propertyName}) references {pkTable}({pkTableCol}) {onDelete} {onUpdate}"
    return sql

def getCreateIndices(entityName:str, entity:dict) -> str:
    indices = []
    alreadyCreated = []

    validColNames = set(entity['properties'].keys())

    if 'sort' in entity:
        sortcols = [k.split(' ')[0] for k in entity['sort'] if '.' not in k]
        if len(sortcols) > 0:            
            sortColNames = set([c.split(' ')[0] for c in sortcols])
            invalid = sortColNames - validColNames
            if len(invalid):
                err = f"entity {entityName}: found invalid sort columns: {', '.join(invalid)}"
                raise Exception(err)

            ixsort = genCreateIndex(entityName, sortcols)
            indices.append(ixsort)
            alreadyCreated.append(",".join(sortcols))
    
    if 'sortable' in entity:
        sortablecols = [k for k in entity['sortable'] if '.' not in k]
        for col in sortablecols:
            if col not in validColNames:
                err = f"entity {entityName}: found invalid sortable column: {col}"
                raise Exception(err)
            
            if col in alreadyCreated:
                continue
            ixsortable = genCreateIndex(entityName, [col])
            indices.append(ixsortable)
            alreadyCreated.append(col)

    #foreign keys
    for propertyName, property in entity["properties"].items():
        if 'constraintEntity' in property:
            if propertyName in alreadyCreated:
                continue
            ix = genCreateIndex(entityName, [propertyName])
            indices.append(ix)

    if len(indices) == 0:
        return "";
    
    return "\n".join(indices)

def genCreateIndex(entityName:str, properties:list[str]):
    indexNameSuffix = "_".join(properties)
    cols = ", ".join(properties)
    sql = f"create index ix_{entityName}_{indexNameSuffix} on {entityName} ({cols});"
    return sql

def genCreateCheckConstraints(entityName:str, entity:dict) -> str:
    if 'constraints' not in entity:
        return ""
    if len(entity['constraints']) == 0:
        return ""
    # entityNameSql = entityName.replace("'", "''")
    constraints = []
    for constraint in entity['constraints']:
        constraintSql = genCreateCheckConstraint(entity, constraint)
        constraints.append(constraintSql)
    constraintsSql = ",\n  ".join(constraints)    
    return constraintsSql


CHECK_OP_MAP = {
    'e': '=',
    'ne': '<>',
    'gt': '>',
    'gte': '>=',
    'lt': '<',
    'lte': '<=',
    'in': 'in',
    'nin': 'not in',
    'bt': 'between',
    'nbt': 'not between',
}

def genCreateCheckConstraint(entity:dict, constraint:dict) -> str:
    
    propertyName = constraint['property']
    # type = entity['properties'][propertyName]['type']
    colNameSql = propertyName.replace("'", "''")

    op = constraint['op']
    opSql = CHECK_OP_MAP[op]
    value = constraint['value']
    if not isinstance(value, list):
        valueSql = enclose(value)
    elif op in ['bt', 'nbt']:
        valueASql, valueBSql = [enclose(v) for v in value]
        valueSql = f'{valueASql} and {valueBSql}'
    else:
        valueSql = ', '.join([enclose(v) for v in value]) 
        valueSql = f'({valueSql})'

    sql = f"check ([{colNameSql}] {opSql} {valueSql})"
    return sql

def genCreateCol(propertyName:str, property:dict) -> str:
    type = TYPE_MAP[property["type"]]
    tokens = [propertyName, type]

    if property["required"]:
        tokens.append("not null")
    
    sql = " ".join(tokens)
    return sql

def genCreateTable(entityName:str, entity:dict) -> str:
    fks = []
    cols = []
    for propertyName, property in entity["properties"].items():
        if not property["typeReference"] and property['type'] != 'array':
            col = genCreateCol(propertyName, property)
            cols.append(col)
        if "constraintEntity" in property:
            fk = genFk(propertyName, property)
            fks.append(fk)
    
    newLineIndent = "\n  , "
    colsStr = f"{newLineIndent}".join(cols)

    pk = entity["key"]
    pkStr = f"primary key ({pk})"

    sql = f"drop table if exists [{entityName}];"
    sql += f"\ncreate table [{entityName}] ("
    sql += f"\n  {colsStr}"
    sql += f"{newLineIndent}{pkStr}"

    if "unique" in entity:
        invalid = set(entity["unique"]) - set(entity["properties"].keys())
        if len(invalid):
            err = f'found invalid unique properties: {", ".join(invalid)}'
            raise Exception(err)
        unique = ", ".join(entity["unique"])
        sql += f"{newLineIndent}unique ({unique})"

    if len(fks) > 0:
        fksStr = f"{newLineIndent}".join(fks)
        sql += f"{newLineIndent}{fksStr}"

    constraintsSql = genCreateCheckConstraints(entityName, entity)
    if constraintsSql != "":
        sql += f"{newLineIndent}{constraintsSql}"
        
    sql += f"\n);"

    return sql

def genSchema(entities:dict) -> str:
    tables = []
    indices = []
    constraints = []
    for entityName, entity in entities.items():
        tableSql = genCreateTable(entityName, entity)
        tables.append(tableSql)        
               
        indicesSql = getCreateIndices(entityName, entity)
        if indicesSql != "":
            indices.append(indicesSql)

    sql = "\n\n".join(tables)
    sql += "\n\n/* INDEXES */\n"
    sql += "\n\n".join(indices)
    
    return sql

def enclose(val):
        if isinstance(val, str):
            v = val.replace("'", "''")
            return f"'{v}'"
        if isinstance(val, bool):
            return str(1 if val else 0)
        return str(val)

def genInsert(entityName:str, entity:dict):

    
    
    colsStr = ', '.join([f"[{k}]" for k in entity.keys()])
    rowcount = len(list(entity.values())[0])
    
    sqls = []
    for ri in range(rowcount):
        rowCols = []
        for vals in entity.values():
            rowCols.append(enclose(vals[ri]))
        valsStr = ", ".join(rowCols)
        sql = f'insert into [{entityName}] ({colsStr}) values ({valsStr});'    
        sqls.append(sql)
    
    sql = "\n".join(sqls)
    return sql

def genData(sampleData:dict) -> str:
    inserts = []
    for entityName, entity in sampleData.items():
        inserts.append(genInsert(entityName, entity))
    
    return "\n\n".join(inserts)

def genSecurityData(entities:dict) -> str:
    entityNames:set = set(entities.keys())
    requiredEntityNames:set = set(['role', 'permission', 'rolePermission'])    
    if not entityNames.issuperset(requiredEntityNames):
        return ""
    noPermissionEntities:list = set('login user role permission rolePermission'.split(' '))
    targetEntities = {k: v for k, v in entities.items() if k not in noPermissionEntities}

    # print(entities['permission'])
    DEFAULT_PERMISSION_ACTIONS = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXECUTE']

    stmts = []
    entityName:str
    entity:dict
    for entityName, entity in targetEntities.items():        
        entityNameSql = entityName.replace("'", "''")
        entityNameCapital = entityNameSql.upper()
        entityStmts = [f"insert into [permission] select 'ENTITY:{entityNameCapital}:{p}', 'Entity {entityNameSql} {p}', '{entityNameSql}', '{p}';" for p in DEFAULT_PERMISSION_ACTIONS]
        stmts += entityStmts

    stmts.append(f"insert into [rolePermission] select uuid(), r.id, p.id from role r, permission p;")
    
    return "\n".join(stmts)


    


