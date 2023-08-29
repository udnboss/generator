using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("user")]
public class User : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("login_id")][Required] public Guid LoginId { get; set; } = "";
    [ForeignKey("LoginId")] public Login? Login { get; set; } = null;
}

public record UserView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
    [Column("login_id")] public Guid? LoginId { get; set; } = "";
    [ForeignKey("LoginId")] public LoginView? Login { get; set; } = null;
}

public record UserQuery : ClientQuery
{
    [Required][MinLength(3)] public string Name { get; set; } = ""
    [Required] public string Email { get; set; } = ""
    public UserQuery() { }
}

public record UserCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("login_id")][Required] public Guid LoginId { get; set; } = "";
}

public record UserUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("login_id")][Required] public Guid LoginId { get; set; } = "";
}

public record UserModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
    [Column("login_id")] public Guid? LoginId { get; set; } = "";
}