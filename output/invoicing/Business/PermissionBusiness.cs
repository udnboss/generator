using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class PermissionBusiness : Business<Permission, PermissionView, PermissionUpdate, PermissionModify, PermissionCreate, PermissionQuery>
{
    public PermissionBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(PermissionQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Name", _operator: Operators.Contains, value: query.Name));
            
            dataQuery.Where.Add(new Condition(column: "Entity", _operator: Operators.In, value: query.Entity));
            
            dataQuery.Where.Add(new Condition(column: "Action", _operator: Operators.In, value: query.Action));
            

        return dataQuery;
    }

    public override PermissionQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Name") clientQuery.Name = c.Value as string;
            
            if(c.Column == "Entity") clientQuery.Entity = c.Value as string;
            
            if(c.Column == "Action") clientQuery.Action = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override PermissionView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Permission>()
            .Select(x => new PermissionView { 
                Id = x.Id, Name = x.Name, Entity = x.Entity, Action = x.Action  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override PermissionView Create(PermissionCreate entity)
    {
        var dbSet = Db.Set<Permission>();
        var dbEntity = new Permission {
            Id = new Guid(),
            Name = entity.Name, Entity = entity.Entity, Action = entity.Action
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new PermissionView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override PermissionView Update(Guid id, PermissionUpdate entity)
    {
        var dbSet = Db.Set<Permission>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(PermissionUpdate).GetProperties();
        var outputProps = typeof(Permission).GetProperties();

        foreach (var prop in inputProps)
        {
            if (prop.Name == "Id") continue;
            var match = outputProps.FirstOrDefault(p => p.Name == prop.Name);
            if (match is not null)
            {
                match.SetValue(existing, prop.GetValue(entity));
            }
        }

        Db.SaveChanges();
        var updated = GetById(id);
        return updated;
    }

    public override PermissionView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Permission>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(PermissionModify).GetProperties();
        var outputProps = typeof(Permission).GetProperties();

        foreach (JsonProperty prop in entity.EnumerateObject())
        {
            if (prop.Name.ToLower() == "id") continue;
            var match = outputProps.FirstOrDefault(p => p.Name.ToLower() == prop.Name.ToLower());
            if (match is not null)
            {
                match.SetValue(existing, prop.Value.GetString());//TODO: proper mapping of type
            }
        }

        Db.SaveChanges();
        var updated = GetById(id);
        return updated;
    }

    public override PermissionView Delete(Guid id)
    {
        var dbSet = Db.Set<Permission>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
        var beforeDelete = GetById(id);
        dbSet.Remove(existing);
        Db.SaveChanges();

        return beforeDelete;
    }

    public override QueryResult<ClientQuery, PermissionView> GetAll(PermissionQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Permission>().Skip(query.Offset);
                           
        if ( query.Limit > 0) 
        {
            q = q.Take(query.Limit);
        }    

        if ( query.Where.Count > 0 )
        {
            foreach (var c in query.Where)
            {   
                __EntityWhereConditions__                   
            }
        }

        IOrderedQueryable<Permission>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Name) : sortedQ.ThenBy(x => x.Name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Name) : sortedQ.ThenByDescending(x => x.Name);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new PermissionView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, PermissionView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

