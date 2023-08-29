using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("login")]
public class Login : Entity
{
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("password")][Required] public string Password { get; set; } = "";
}

public record LoginView : IRecord
{
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
    [Column("password")] public string? Password { get; set; } = "";
}

public record LoginQuery : ClientQuery
{
    [Required] public string Email { get; set; } = ""
    public LoginQuery() { }
}

public record LoginCreate : IRecord
{
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("password")][Required] public string Password { get; set; } = "";
}

public record LoginUpdate : IRecord
{
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
    [Column("password")][Required] public string Password { get; set; } = "";
}

public record LoginModify : IRecord
{
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
    [Column("password")] public string? Password { get; set; } = "";
}