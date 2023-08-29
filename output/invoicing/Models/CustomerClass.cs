using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("customer")]
public class Customer : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [ForeignKey("CurrencyId")] public Currency? Currency { get; set; } = null;
    [Column("payment_term")] public integer? PaymentTerm { get; set; } = null;
    [InverseProperty("Customer")] public ICollection<Sale>? Sales { get; set; } = null;
}

public record CustomerView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [ForeignKey("CurrencyId")] public CurrencyView? Currency { get; set; } = null;
    [Column("payment_term")] public integer? PaymentTerm { get; set; } = null;
    [InverseProperty("Customer")] public ICollection<Sale>? Sales { get; set; } = null;
}

public record CustomerQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
    public CustomerQuery() { }
}

public record CustomerCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [Column("payment_term")] public integer? PaymentTerm { get; set; } = null;
    [InverseProperty("Customer")] public ICollection<Sale>? Sales { get; set; } = null;
}

public record CustomerUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [Column("payment_term")] public integer? PaymentTerm { get; set; } = null;
    [InverseProperty("Customer")] public ICollection<Sale>? Sales { get; set; } = null;
}

public record CustomerModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("address")] public string? Address { get; set; } = "";
    [Column("contact")] public string? Contact { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [Column("payment_term")] public integer? PaymentTerm { get; set; } = null;
    [InverseProperty("Customer")] public ICollection<Sale>? Sales { get; set; } = null;
}