using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class UserBusiness : Business<User, UserView, UserUpdate, UserModify, UserCreate, UserQuery>
{
    public UserBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(UserQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Name", _operator: Operators.Contains, value: query.Name));
            
            dataQuery.Where.Add(new Condition(column: "Email", _operator: Operators.Contains, value: query.Email));
            

        return dataQuery;
    }

    public override UserQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Name") clientQuery.Name = c.Value as string;
            
            if(c.Column == "Email") clientQuery.Email = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override UserView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<User>()
            .Select(x => new UserView { 
                Id = x.Id, Name = x.Name, Email = x.Email, LoginId = x.LoginId  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override UserView Create(UserCreate entity)
    {
        var dbSet = Db.Set<User>();
        var dbEntity = new User {
            Id = new Guid(),
            Name = entity.Name, Email = entity.Email, LoginId = entity.LoginId
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new UserView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override UserView Update(Guid id, UserUpdate entity)
    {
        var dbSet = Db.Set<User>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(UserUpdate).GetProperties();
        var outputProps = typeof(User).GetProperties();

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

    public override UserView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<User>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(UserModify).GetProperties();
        var outputProps = typeof(User).GetProperties();

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

    public override UserView Delete(Guid id)
    {
        var dbSet = Db.Set<User>();
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

    public override QueryResult<ClientQuery, UserView> GetAll(UserQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<User>().Skip(query.Offset);
                           
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

        IOrderedQueryable<User>? sortedQ = null;
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
                


                if (s.Column == "Email")
                {
                    sortedQ = s.Direction == SortDirection.Asc ? 
                        sortedQ is null ? q.OrderBy(x => x.Email) : sortedQ.ThenBy(x => x.Email) 
                        : sortedQ is null ? q.OrderByDescending( x => x.Email) : sortedQ.ThenByDescending(x => x.Email);
                }
                
            }
        }
        
        var data = (sortedQ ?? q)
            .Select(x => new UserView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, UserView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

