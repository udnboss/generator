using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("permission")]
public class Permission : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("entity")][Required] public string Entity { get; set; } = "";
    [Column("action")][Required] public string Action { get; set; } = "";
    [InverseProperty("Permission")] public ICollection<Rolepermission>? Roles { get; set; } = null;
}

public record PermissionView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("entity")] public string? Entity { get; set; } = "";
    [Column("action")] public string? Action { get; set; } = "";
    [InverseProperty("Permission")] public ICollection<Rolepermission>? Roles { get; set; } = null;
}

public record PermissionQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
    [Required] public string Entity { get; set; } = ""
    [Required] public string Action { get; set; } = ""
    public PermissionQuery() { }
}

public record PermissionCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("entity")][Required] public string Entity { get; set; } = "";
    [Column("action")][Required] public string Action { get; set; } = "";
    [InverseProperty("Permission")] public ICollection<Rolepermission>? Roles { get; set; } = null;
}

public record PermissionUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("entity")][Required] public string Entity { get; set; } = "";
    [Column("action")][Required] public string Action { get; set; } = "";
    [InverseProperty("Permission")] public ICollection<Rolepermission>? Roles { get; set; } = null;
}

public record PermissionModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("entity")] public string? Entity { get; set; } = "";
    [Column("action")] public string? Action { get; set; } = "";
    [InverseProperty("Permission")] public ICollection<Rolepermission>? Roles { get; set; } = null;
}