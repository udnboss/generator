using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class SaleBusiness : Business<Sale, SaleView, SaleUpdate, SaleModify, SaleCreate, SaleQuery>
{
    public SaleBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(SaleQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "CustomerId", _operator: Operators.In, value: query.CustomerId));
            
            dataQuery.Where.Add(new Condition(column: "AccountId", _operator: Operators.In, value: query.AccountId));
            
            dataQuery.Where.Add(new Condition(column: "Number", _operator: Operators.Contains, value: query.Number));
            
            dataQuery.Where.Add(new Condition(column: "Date", _operator: Operators.Between, value: query.Date));
            
            dataQuery.Where.Add(new Condition(column: "ReferenceDate", _operator: Operators.Between, value: query.ReferenceDate));
            

        return dataQuery;
    }

    public override SaleQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "CustomerId") clientQuery.CustomerId = c.Value as string;
            
            if(c.Column == "AccountId") clientQuery.AccountId = c.Value as string;
            
            if(c.Column == "Number") clientQuery.Number = c.Value as string;
            
            if(c.Column == "Date") clientQuery.Date = c.Value as string;
            
            if(c.Column == "ReferenceDate") clientQuery.ReferenceDate = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override SaleView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Sale>()
            .Select(x => new SaleView { 
                Id = x.Id, CompanyId = x.CompanyId, AccountId = x.AccountId, CustomerId = x.CustomerId, CurrencyId = x.CurrencyId, Place = x.Place, Number = x.Number, Date = x.Date, Total = x.Total, Totalitems = x.Totalitems, Reference = x.Reference, Confirmed = x.Confirmed, ReferenceDate = x.ReferenceDate, DueDate = x.DueDate  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override SaleView Create(SaleCreate entity)
    {
        var dbSet = Db.Set<Sale>();
        var dbEntity = new Sale {
            Id = new Guid(),
            CompanyId = entity.CompanyId, AccountId = entity.AccountId, CustomerId = entity.CustomerId, CurrencyId = entity.CurrencyId, Place = entity.Place, Date = entity.Date, Reference = entity.Reference, Confirmed = entity.Confirmed, ReferenceDate = entity.ReferenceDate, DueDate = entity.DueDate
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new SaleView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override SaleView Update(Guid id, SaleUpdate entity)
    {
        var dbSet = Db.Set<Sale>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(SaleUpdate).GetProperties();
        var outputProps = typeof(Sale).GetProperties();

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

    public override SaleView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Sale>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(SaleModify).GetProperties();
        var outputProps = typeof(Sale).GetProperties();

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

    public override SaleView Delete(Guid id)
    {
        var dbSet = Db.Set<Sale>();
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

    public override QueryResult<ClientQuery, SaleView> GetAll(SaleQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Sale>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Sale>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Number")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Number) : sortedQ.ThenBy(x => x.Number) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Number) : sortedQ.ThenByDescending(x => x.Number);
                }
                


                if (s.Column == "Date")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Date) : sortedQ.ThenBy(x => x.Date) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Date) : sortedQ.ThenByDescending(x => x.Date);
                }
                


                if (s.Column == "Customer.name")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Customer.name) : sortedQ.ThenBy(x => x.Customer.name) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Customer.name) : sortedQ.ThenByDescending(x => x.Customer.name);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new SaleView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, SaleView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

