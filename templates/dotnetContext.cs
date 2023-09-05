using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


public class MyContext : IdentityDbContext<Login>
{
    #pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

    __ContextEntities__
    

    public string DbPath { get; }

    public MyContext()
    {
        var path = "./Data";
        DbPath = Path.Join(path, "db.sqlite3");
    }

    #pragma warning restore CS8618

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}"); 

    //For Sqlite, convert Guid to string and vice versa
    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     var guidToStringConverter = new ValueConverter<Guid, string>(
    //         guid => guid.ToString(),
    //         str => Guid.Parse(str));

    //     foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    //     {
    //         foreach (var property in entityType.GetProperties())
    //         {
    //             if (property.ClrType == typeof(Guid))
    //             {
    //                 property.SetValueConverter(guidToStringConverter);
    //             }
    //             else if (property.ClrType == typeof(string))
    //             {
    //                 property.SetCollation("NOCASE");
    //             }
    //         }
    //     }
    // }
}

public enum AppPermission
{
    __AppPermissions__
}

public static class AppPermissionExtensions
{
    public static string GetCode(this AppPermission permission)
    {
        switch (permission)
        {    
            __AppPermissionsCodes__            
            default:
                throw new ArgumentOutOfRangeException(nameof(permission), permission, null);
        }
    }
}

public enum AppRole
{
    Admin,
    Contribute,
    View
}

public static class AppRoleExtensions
{
    public static string GetCode(this AppRole appRole)
    {
        switch (appRole)
        {    
            case AppRole.Admin: return "ADMIN";         
            case AppRole.Contribute: return "CONTRIBUTE";         
            case AppRole.View: return "VIEW";         
            default:
                throw new ArgumentOutOfRangeException(nameof(appRole), appRole, null);
        }
    }
}

public class MyRole : IdentityRole
{

}