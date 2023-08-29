using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class RolepermissionBusiness : Business<Rolepermission, RolepermissionView, RolepermissionUpdate, RolepermissionModify, RolepermissionCreate, RolepermissionQuery>
{
    public RolepermissionBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(RolepermissionQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        

        return dataQuery;
    }

    public override RolepermissionQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
        }        

        return clientQuery;
    }
    
    public override RolepermissionView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Rolepermission>()
            .Select(x => new RolepermissionView { 
                Id = x.Id, RoleId = x.RoleId, PermissionId = x.PermissionId  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override RolepermissionView Create(RolepermissionCreate entity)
    {
        var dbSet = Db.Set<Rolepermission>();
        var dbEntity = new Rolepermission {
            Id = new Guid(),
            RoleId = entity.RoleId, PermissionId = entity.PermissionId
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new RolepermissionView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override RolepermissionView Update(Guid id, RolepermissionUpdate entity)
    {
        var dbSet = Db.Set<Rolepermission>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(RolepermissionUpdate).GetProperties();
        var outputProps = typeof(Rolepermission).GetProperties();

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

    public override RolepermissionView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Rolepermission>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(RolepermissionModify).GetProperties();
        var outputProps = typeof(Rolepermission).GetProperties();

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

    public override RolepermissionView Delete(Guid id)
    {
        var dbSet = Db.Set<Rolepermission>();
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

    public override QueryResult<ClientQuery, RolepermissionView> GetAll(RolepermissionQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Rolepermission>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Rolepermission>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Role.name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Role.name) : sortedQ.ThenBy(x => x.Role.name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Role.name) : sortedQ.ThenByDescending(x => x.Role.name);
                }
                


                if (s.Column == "Permission.name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Permission.name) : sortedQ.ThenBy(x => x.Permission.name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Permission.name) : sortedQ.ThenByDescending(x => x.Permission.name);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new RolepermissionView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, RolepermissionView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

