using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class __EntityNameCapitalized__Business : Business<__EntityNameCapitalized__, __EntityNameCapitalized__View, __EntityNameCapitalized__Update, __EntityNameCapitalized__Modify, __EntityNameCapitalized__Create, __EntityNameCapitalized__Query>
{
    public __EntityNameCapitalized__Business(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(__EntityNameCapitalized__Query query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        __EntityDataQueryConditions__

        return dataQuery;
    }

    public override __EntityNameCapitalized__Query ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            __EntityClientQueryConditions__
        }        

        return clientQuery;
    }
    
    public override __EntityNameCapitalized__View GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<__EntityNameCapitalized__>()
            .Select(x => new __EntityNameCapitalized__View { 
                __EntityViewProjection__  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override __EntityNameCapitalized__View Create(__EntityNameCapitalized__Create entity)
    {
        var dbSet = Db.Set<__EntityNameCapitalized__>();
        var dbEntity = new __EntityNameCapitalized__ {
            Id = new Guid(),
            __EntityCreateProjection__
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new __EntityNameCapitalized__View { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override __EntityNameCapitalized__View Update(Guid id, __EntityNameCapitalized__Update entity)
    {
        var dbSet = Db.Set<__EntityNameCapitalized__>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(__EntityNameCapitalized__Update).GetProperties();
        var outputProps = typeof(__EntityNameCapitalized__).GetProperties();

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

    public override __EntityNameCapitalized__View Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<__EntityNameCapitalized__>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(__EntityNameCapitalized__Modify).GetProperties();
        var outputProps = typeof(__EntityNameCapitalized__).GetProperties();

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

    public override __EntityNameCapitalized__View Delete(Guid id)
    {
        var dbSet = Db.Set<__EntityNameCapitalized__>();
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

    public override QueryResult<ClientQuery, __EntityNameCapitalized__View> GetAll(__EntityNameCapitalized__Query clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<__EntityNameCapitalized__>().Skip(query.Offset);
                           
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

        IOrderedQueryable<__EntityNameCapitalized__>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                __EntitySortConditions__
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new __EntityNameCapitalized__View { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, __EntityNameCapitalized__View>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

