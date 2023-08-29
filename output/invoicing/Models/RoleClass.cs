using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("role")]
public class Role : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [InverseProperty("Role")] public ICollection<Rolepermission>? Rolepermissions { get; set; } = null;
}

public record RoleView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [InverseProperty("Role")] public ICollection<Rolepermission>? Rolepermissions { get; set; } = null;
}

public record RoleQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
    public RoleQuery() { }
}

public record RoleCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [InverseProperty("Role")] public ICollection<Rolepermission>? Rolepermissions { get; set; } = null;
}

public record RoleUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [InverseProperty("Role")] public ICollection<Rolepermission>? Rolepermissions { get; set; } = null;
}

public record RoleModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [InverseProperty("Role")] public ICollection<Rolepermission>? Rolepermissions { get; set; } = null;
}