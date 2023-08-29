using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("company")]
public class Company : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")][Required] public string Address { get; set; } = "";
    [Column("crn")][Required] public string Crn { get; set; } = "";
    [Column("trn")][Required] public string Trn { get; set; } = "";
    [Column("contact")][Required] public string Contact { get; set; } = "";
    [Column("mobile")][Required] public string Mobile { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
}

public record CompanyView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("crn")] public string? Crn { get; set; } = "";
    [Column("trn")] public string? Trn { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("mobile")] public string? Mobile { get; set; } = "";
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
}

public record CompanyQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
    public CompanyQuery() { }
}

public record CompanyCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")][Required] public string Address { get; set; } = "";
    [Column("crn")][Required] public string Crn { get; set; } = "";
    [Column("trn")][Required] public string Trn { get; set; } = "";
    [Column("contact")][Required] public string Contact { get; set; } = "";
    [Column("mobile")][Required] public string Mobile { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
}

public record CompanyUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")][Required] public string Address { get; set; } = "";
    [Column("crn")][Required] public string Crn { get; set; } = "";
    [Column("trn")][Required] public string Trn { get; set; } = "";
    [Column("contact")][Required] public string Contact { get; set; } = "";
    [Column("mobile")][Required] public string Mobile { get; set; } = "";
    [Column("email")][Required][EmailAddress] public string Email { get; set; } = "";
}

public record CompanyModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("crn")] public string? Crn { get; set; } = "";
    [Column("trn")] public string? Trn { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("mobile")] public string? Mobile { get; set; } = "";
    [Column("email")][EmailAddress] public string? Email { get; set; } = "";
}