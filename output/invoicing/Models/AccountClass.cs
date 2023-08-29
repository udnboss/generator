using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("account")]
public class Account : Entity
{
    [Column("label")][Required] public string Label { get; set; } = "";
    [Column("bank_name")][Required] public string BankName { get; set; } = "";
    [Column("bank_address")][Required] public string BankAddress { get; set; } = "";
    [Column("bank_swift")][Required] public string BankSwift { get; set; } = "";
    [Column("account_name")][Required] public string AccountName { get; set; } = "";
    [Column("account_iban")][Required] public string AccountIban { get; set; } = "";
    [Column("account_address")][Required] public string AccountAddress { get; set; } = "";
}

public record AccountView : IRecord
{
    [Column("label")] public string? Label { get; set; } = "";
    [Column("bank_name")] public string? BankName { get; set; } = "";
    [Column("bank_address")] public string? BankAddress { get; set; } = "";
    [Column("bank_swift")] public string? BankSwift { get; set; } = "";
    [Column("account_name")] public string? AccountName { get; set; } = "";
    [Column("account_iban")] public string? AccountIban { get; set; } = "";
    [Column("account_address")] public string? AccountAddress { get; set; } = "";
}

public record AccountQuery : ClientQuery
{
    [Required] public string Label { get; set; } = ""
    [Required] public string BankName { get; set; } = ""
    public AccountQuery() { }
}

public record AccountCreate : IRecord
{
    [Column("label")][Required] public string Label { get; set; } = "";
    [Column("bank_name")][Required] public string BankName { get; set; } = "";
    [Column("bank_address")][Required] public string BankAddress { get; set; } = "";
    [Column("bank_swift")][Required] public string BankSwift { get; set; } = "";
    [Column("account_name")][Required] public string AccountName { get; set; } = "";
    [Column("account_iban")][Required] public string AccountIban { get; set; } = "";
    [Column("account_address")][Required] public string AccountAddress { get; set; } = "";
}

public record AccountUpdate : IRecord
{
    [Column("label")][Required] public string Label { get; set; } = "";
    [Column("bank_name")][Required] public string BankName { get; set; } = "";
    [Column("bank_address")][Required] public string BankAddress { get; set; } = "";
    [Column("bank_swift")][Required] public string BankSwift { get; set; } = "";
    [Column("account_name")][Required] public string AccountName { get; set; } = "";
    [Column("account_iban")][Required] public string AccountIban { get; set; } = "";
    [Column("account_address")][Required] public string AccountAddress { get; set; } = "";
}

public record AccountModify : IRecord
{
    [Column("label")] public string? Label { get; set; } = "";
    [Column("bank_name")] public string? BankName { get; set; } = "";
    [Column("bank_address")] public string? BankAddress { get; set; } = "";
    [Column("bank_swift")] public string? BankSwift { get; set; } = "";
    [Column("account_name")] public string? AccountName { get; set; } = "";
    [Column("account_iban")] public string? AccountIban { get; set; } = "";
    [Column("account_address")] public string? AccountAddress { get; set; } = "";
}