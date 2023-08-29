using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;

public class CompanyBusiness : Business<Company, CompanyView, CompanyUpdate, CompanyModify, CompanyCreate, CompanyQuery>
{
    public CompanyBusiness(DbContext db) : base(db)
    {
    }

    public override DataQuery ConvertToDataQuery(CompanyQuery query)
    {
        var dataQuery = base.ConvertToDataQuery(query);

        
            dataQuery.Where.Add(new Condition(column: "Name", _operator: Operators.Contains, value: query.Name));
            

        return dataQuery;
    }

    public override CompanyQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = base.ConvertToClientQuery(query);

        foreach(var c in query.Where)
        {
            
            if(c.Column == "Name") clientQuery.Name = c.Value as string;
            
        }        

        return clientQuery;
    }
    
    public override CompanyView GetById(Guid id, int maxDepth = 2)
    {
        var query = Db.Set<Company>()
            .Select(x => new CompanyView { 
                Id = x.Id, Name = x.Name, Address = x.Address, Crn = x.Crn, Trn = x.Trn, Contact = x.Contact, Mobile = x.Mobile, Email = x.Email  
            })
            .AsQueryable();

        if (maxDepth > 0)
        {
            maxDepth--;
        }

        var entity = query.FirstOrDefault(x => x.Id == id) ?? throw new KeyNotFoundException($"No {entityName} entity found for given {id}");
        return entity;
    }

    public override CompanyView Create(CompanyCreate entity)
    {
        var dbSet = Db.Set<Company>();
        var dbEntity = new Company {
            Id = new Guid(),
            Name = entity.Name, Address = entity.Address, Crn = entity.Crn, Trn = entity.Trn, Contact = entity.Contact, Mobile = entity.Mobile, Email = entity.Email
        };
        dbSet.Add(dbEntity);
        Db.SaveChanges();
        var added = dbSet.Select(x => new CompanyView { 
                __EntityViewProjection__
            })
            .FirstOrDefault(x => x.Id == dbEntity.Id);
        
        if (added is null)
        {
            throw new Exception($"Could not retrieve created {entityName} entity.");
        }
        return added;
    }

    public override CompanyView Update(Guid id, CompanyUpdate entity)
    {
        var dbSet = Db.Set<Company>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }

        var inputProps = typeof(CompanyUpdate).GetProperties();
        var outputProps = typeof(Company).GetProperties();

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

    public override CompanyView Modify(Guid id, JsonElement entity)
    {
        var dbSet = Db.Set<Company>();
        var existing = dbSet.Find(id);
        if (existing is null)
        {
            throw new KeyNotFoundException($"Could not find an existing {entityName} entity with the given id.");
        }
      
        var validProps = typeof(CompanyModify).GetProperties();
        var outputProps = typeof(Company).GetProperties();

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

    public override CompanyView Delete(Guid id)
    {
        var dbSet = Db.Set<Company>();
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

    public override QueryResult<ClientQuery, CompanyView> GetAll(CompanyQuery clientQuery, DataQuery query, int maxDepth = 2)
    {
        var q = Db.Set<Company>().Skip(query.Offset);
                           
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

        IOrderedQueryable<Company>? sortedQ = null;
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
            .Select(x => new CompanyView { __EntityViewProjection__ })
            .ToList();

        var result = new QueryResult<ClientQuery, CompanyView>(clientQuery)
        {
            Count = data.Count,
            Result = data,
            Total = data.Count
        };

        return result;
    }

}

