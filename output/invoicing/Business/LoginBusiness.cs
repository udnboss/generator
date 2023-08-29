using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class LoginBusiness : Business<Login, LoginView, LoginUpdate, LoginModify, LoginCreate, LoginQuery>
{
    public LoginBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(LoginQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Email", _operator: Operators.Contains, value: query.Email));
            

        return dataQuery;
    }

    public override LoginQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Email") clientQuery.Email = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override LoginView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Login>()
            .Select(x => new LoginView { 
                Id = x.Id, Email = x.Email, Password = x.Password  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override LoginView Create(LoginCreate entity)
    {
        var dbSet = Db.Set<Login>();
        var dbEntity = new Login {
            Id = new Guid(),
            Email = entity.Email, Password = entity.Password
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new LoginView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override LoginView Update(Guid id, LoginUpdate entity)
    {
        var dbSet = Db.Set<Login>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(LoginUpdate).GetProperties();
        var outputProps = typeof(Login).GetProperties();

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

    public override LoginView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Login>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(LoginModify).GetProperties();
        var outputProps = typeof(Login).GetProperties();

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

    public override LoginView Delete(Guid id)
    {
        var dbSet = Db.Set<Login>();
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

    public override QueryResult<ClientQuery, LoginView> GetAll(LoginQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Login>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Login>? sortedQ = null;
        if (query.Sort.Count > 0)
        {
            foreach (var s in query.Sort)
            {
                
                if (s.Column == "Email")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Email) : sortedQ.ThenBy(x => x.Email) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Email) : sortedQ.ThenByDescending(x => x.Email);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new LoginView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, LoginView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

