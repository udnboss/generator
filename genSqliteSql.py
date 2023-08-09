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
    'd-cascade': 'ON DELETE CASCADE',
    'd-setnull': 'ON DELETE SET NULL',
    'd-restrict': 'ON DELETE RESTRICT',
    'd-ignore': 'ON DELETE NO ACTION',
    'u-cascade': 'ON UPDATE CASCADE',
    'u-setnull': 'ON UPDATE SET NULL',
    'u-restrict': 'ON UPDATE RESTRICT',
    'u-ignore': 'ON UPDATE NO ACTION',
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

    if 'sort' in entity:
        sortcols = entity['sort']
        ixsort = genCreateIndex(entityName, sortcols)
        indices.append(ixsort)
        alreadyCreated.append(",".join(sortcols))
    
    if 'sortable' in entity:
        sortablecols = [k for k in entity['sortable'] if '.' not in k]
        for col in sortablecols:
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
        
    return "\n".join(indices)

def genCreateIndex(entityName:str, properties:list[str]):
    indexNameSuffix = "_".join(properties)
    cols = ", ".join(properties)
    sql = f"create index ix_{entityName}_{indexNameSuffix} on {entityName} ({cols});"
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
        if not property["typeReference"]:
            col = genCreateCol(propertyName, property)
            cols.append(col)
        if "constraintEntity" in property:
            fk = genFk(propertyName, property)
            fks.append(fk)
    
    newLineIndent = "\n  , "
    colsStr = f"{newLineIndent}".join(cols)

    pk = entity["key"]
    pkStr = f"primary key ({pk})"

    sql = f"create table [{entityName}] ("
    sql += f"\n  {colsStr}"
    sql += f"{newLineIndent}{pkStr}"

    if "unique" in entity:
        unique = ", ".join(entity["unique"])
        sql += f"{newLineIndent}unique ({unique})"

    if len(fks) > 0:
        fksStr = f"{newLineIndent}".join(fks)
        sql += f"{newLineIndent}{fksStr}"
        
    sql += f"\n);"

    return sql

def genSchema(entities:dict) -> str:
    tables = []
    indices = []
    for entityName, entity in entities.items():
        tableSql = genCreateTable(entityName, entity)
        tables.append(tableSql)
        
        indicesSql = getCreateIndices(entityName, entity)
        indices.append(indicesSql)

    sql = "\n\n".join(tables)
    sql += "\n\n"
    sql += "\n\n".join(indices)
    
    return sql