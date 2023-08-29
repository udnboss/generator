using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("rolePermission")]
public class Rolepermission : Entity
{
    [Column("role_id")][Required] public string RoleId { get; set; } = "";
    [Column("permission_id")][Required] public string PermissionId { get; set; } = "";
    [ForeignKey("RoleId")] public Role? Role { get; set; } = null;
    [ForeignKey("PermissionId")] public Permission? Permission { get; set; } = null;
}

public record RolepermissionView : IRecord
{
    [Column("role_id")] public string? RoleId { get; set; } = "";
    [Column("permission_id")] public string? PermissionId { get; set; } = "";
    [ForeignKey("RoleId")] public RoleView? Role { get; set; } = null;
    [ForeignKey("PermissionId")] public PermissionView? Permission { get; set; } = null;
}

public record RolepermissionQuery : ClientQuery
{
    
    public RolepermissionQuery() { }
}

public record RolepermissionCreate : IRecord
{
    [Column("role_id")][Required] public string RoleId { get; set; } = "";
    [Column("permission_id")][Required] public string PermissionId { get; set; } = "";
}

public record RolepermissionUpdate : IRecord
{
    [Column("role_id")][Required] public string RoleId { get; set; } = "";
    [Column("permission_id")][Required] public string PermissionId { get; set; } = "";
}

public record RolepermissionModify : IRecord
{
    [Column("role_id")] public string? RoleId { get; set; } = "";
    [Column("permission_id")] public string? PermissionId { get; set; } = "";
}