using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class ItemBusiness : Business<Item, ItemView, ItemUpdate, ItemModify, ItemCreate, ItemQuery>
{
    public ItemBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(ItemQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Name", _operator: Operators.Contains, value: query.Name));
            
            dataQuery.Where.Add(new Condition(column: "CategoryId", _operator: Operators.In, value: query.CategoryId));
            

        return dataQuery;
    }

    public override ItemQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Name") clientQuery.Name = c.Value as string;
            
            if(c.Column == "CategoryId") clientQuery.CategoryId = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override ItemView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Item>()
            .Select(x => new ItemView { 
                Id = x.Id, Name = x.Name, CategoryId = x.CategoryId  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override ItemView Create(ItemCreate entity)
    {
        var dbSet = Db.Set<Item>();
        var dbEntity = new Item {
            Id = new Guid(),
            Name = entity.Name, CategoryId = entity.CategoryId
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new ItemView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override ItemView Update(Guid id, ItemUpdate entity)
    {
        var dbSet = Db.Set<Item>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(ItemUpdate).GetProperties();
        var outputProps = typeof(Item).GetProperties();

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

    public override ItemView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Item>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(ItemModify).GetProperties();
        var outputProps = typeof(Item).GetProperties();

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

    public override ItemView Delete(Guid id)
    {
        var dbSet = Db.Set<Item>();
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

    public override QueryResult<ClientQuery, ItemView> GetAll(ItemQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Item>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Item>? sortedQ = null;
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
                


                if (s.Column == "Category.name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Category.name) : sortedQ.ThenBy(x => x.Category.name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Category.name) : sortedQ.ThenByDescending(x => x.Category.name);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new ItemView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, ItemView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

