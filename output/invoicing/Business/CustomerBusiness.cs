using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class CustomerBusiness : Business<Customer, CustomerView, CustomerUpdate, CustomerModify, CustomerCreate, CustomerQuery>
{
    public CustomerBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(CustomerQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Name", _operator: Operators.Contains, value: query.Name));
            

        return dataQuery;
    }

    public override CustomerQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Name") clientQuery.Name = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override CustomerView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Customer>()
            .Select(x => new CustomerView { 
                Id = x.Id, Name = x.Name, Address = x.Address, Contact = x.Contact, CurrencyId = x.CurrencyId, PaymentTerm = x.PaymentTerm  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override CustomerView Create(CustomerCreate entity)
    {
        var dbSet = Db.Set<Customer>();
        var dbEntity = new Customer {
            Id = new Guid(),
            Name = entity.Name, Address = entity.Address, Contact = entity.Contact, CurrencyId = entity.CurrencyId, PaymentTerm = entity.PaymentTerm
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new CustomerView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override CustomerView Update(Guid id, CustomerUpdate entity)
    {
        var dbSet = Db.Set<Customer>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(CustomerUpdate).GetProperties();
        var outputProps = typeof(Customer).GetProperties();

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

    public override CustomerView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Customer>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(CustomerModify).GetProperties();
        var outputProps = typeof(Customer).GetProperties();

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

    public override CustomerView Delete(Guid id)
    {
        var dbSet = Db.Set<Customer>();
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

    public override QueryResult<ClientQuery, CustomerView> GetAll(CustomerQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Customer>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Customer>? sortedQ = null;
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
            .Select(x => new CustomerView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, CustomerView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

