using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class SaleitemBusiness : Business<Saleitem, SaleitemView, SaleitemUpdate, SaleitemModify, SaleitemCreate, SaleitemQuery>
{
    public SaleitemBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(SaleitemQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        

        return dataQuery;
    }

    public override SaleitemQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
        }        

        return clientQuery;
    }
    
    public override SaleitemView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Saleitem>()
            .Select(x => new SaleitemView { 
                Id = x.Id, SaleId = x.SaleId, ItemId = x.ItemId, Description = x.Description, Quantity = x.Quantity, Price = x.Price, Total = x.Total  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override SaleitemView Create(SaleitemCreate entity)
    {
        var dbSet = Db.Set<Saleitem>();
        var dbEntity = new Saleitem {
            Id = new Guid(),
            SaleId = entity.SaleId, ItemId = entity.ItemId, Description = entity.Description, Quantity = entity.Quantity, Price = entity.Price
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new SaleitemView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override SaleitemView Update(Guid id, SaleitemUpdate entity)
    {
        var dbSet = Db.Set<Saleitem>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(SaleitemUpdate).GetProperties();
        var outputProps = typeof(Saleitem).GetProperties();

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

    public override SaleitemView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Saleitem>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(SaleitemModify).GetProperties();
        var outputProps = typeof(Saleitem).GetProperties();

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

    public override SaleitemView Delete(Guid id)
    {
        var dbSet = Db.Set<Saleitem>();
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

    public override QueryResult<ClientQuery, SaleitemView> GetAll(SaleitemQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Saleitem>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Saleitem>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Item.name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Item.name) : sortedQ.ThenBy(x => x.Item.name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Item.name) : sortedQ.ThenByDescending(x => x.Item.name);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new SaleitemView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, SaleitemView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

