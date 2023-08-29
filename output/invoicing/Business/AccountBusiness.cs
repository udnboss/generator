using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class AccountBusiness : Business<Account, AccountView, AccountUpdate, AccountModify, AccountCreate, AccountQuery>
{
    public AccountBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(AccountQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Label", _operator: Operators.Contains, value: query.Label));
            
            dataQuery.Where.Add(new Condition(column: "BankName", _operator: Operators.Contains, value: query.BankName));
            

        return dataQuery;
    }

    public override AccountQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Label") clientQuery.Label = c.Value as string;
            
            if(c.Column == "BankName") clientQuery.BankName = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override AccountView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Account>()
            .Select(x => new AccountView { 
                Id = x.Id, Label = x.Label, BankName = x.BankName, BankAddress = x.BankAddress, BankSwift = x.BankSwift, AccountName = x.AccountName, AccountIban = x.AccountIban, AccountAddress = x.AccountAddress  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override AccountView Create(AccountCreate entity)
    {
        var dbSet = Db.Set<Account>();
        var dbEntity = new Account {
            Id = new Guid(),
            Label = entity.Label, BankName = entity.BankName, BankAddress = entity.BankAddress, BankSwift = entity.BankSwift, AccountName = entity.AccountName, AccountIban = entity.AccountIban, AccountAddress = entity.AccountAddress
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new AccountView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override AccountView Update(Guid id, AccountUpdate entity)
    {
        var dbSet = Db.Set<Account>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(AccountUpdate).GetProperties();
        var outputProps = typeof(Account).GetProperties();

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

    public override AccountView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Account>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(AccountModify).GetProperties();
        var outputProps = typeof(Account).GetProperties();

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

    public override AccountView Delete(Guid id)
    {
        var dbSet = Db.Set<Account>();
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

    public override QueryResult<ClientQuery, AccountView> GetAll(AccountQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Account>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Account>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Label")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Label) : sortedQ.ThenBy(x => x.Label) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Label) : sortedQ.ThenByDescending(x => x.Label);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new AccountView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, AccountView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

