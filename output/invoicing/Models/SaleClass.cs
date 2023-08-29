using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("sale")]
public class Sale : Entity
{
    [Column("company_id")][Required] public Guid CompanyId { get; set; } = "";
    [Column("account_id")][Required] public Guid AccountId { get; set; } = "";
    [Column("customer_id")][Required] public Guid CustomerId { get; set; } = "";
    [Column("currency_id")][Required] public string CurrencyId { get; set; } = "";
    [Column("place")] public string? Place { get; set; } = "";
    [Column("number")] public integer? Number { get; set; } = null;
    [Column("date")][Required] public string Date { get; set; } = "";
    [Column("total")] public number? Total { get; set; } = 0;
    [Column("totalItems")] public integer? Totalitems { get; set; } = 0;
    [Column("reference")] public string? Reference { get; set; } = "";
    [Column("confirmed")][Required] public boolean Confirmed { get; set; } = null;
    [Column("reference_date")] public string? ReferenceDate { get; set; } = "";
    [Column("due_date")] public string? DueDate { get; set; } = "";
    [ForeignKey("CurrencyId")] public Currency? Currency { get; set; } = null;
    [ForeignKey("CustomerId")] public Customer? Customer { get; set; } = null;
    [ForeignKey("AccountId")] public Account? Account { get; set; } = null;
    [ForeignKey("CompanyId")] public Company? Company { get; set; } = null;
    [InverseProperty("Sale")] public ICollection<Saleitem>? Items { get; set; } = null;
}

public record SaleView : IRecord
{
    [Column("company_id")] public Guid? CompanyId { get; set; } = "";
    [Column("account_id")] public Guid? AccountId { get; set; } = "";
    [Column("customer_id")] public Guid? CustomerId { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [Column("place")] public string? Place { get; set; } = "";
    [Column("number")] public integer? Number { get; set; } = null;
    [Column("date")] public string? Date { get; set; } = "";
    [Column("total")] public number? Total { get; set; } = 0;
    [Column("totalItems")] public integer? Totalitems { get; set; } = 0;
    [Column("reference")] public string? Reference { get; set; } = "";
    [Column("confirmed")] public boolean? Confirmed { get; set; } = null;
    [Column("reference_date")] public string? ReferenceDate { get; set; } = "";
    [Column("due_date")] public string? DueDate { get; set; } = "";
    [ForeignKey("CurrencyId")] public CurrencyView? Currency { get; set; } = null;
    [ForeignKey("CustomerId")] public CustomerView? Customer { get; set; } = null;
    [ForeignKey("AccountId")] public AccountView? Account { get; set; } = null;
    [ForeignKey("CompanyId")] public CompanyView? Company { get; set; } = null;
    [InverseProperty("Sale")] public ICollection<Saleitem>? Items { get; set; } = null;
}

public record SaleQuery : ClientQuery
{
    [Required] public Guid CustomerId { get; set; } = 
    [Required] public Guid AccountId { get; set; } = 
     public int? Number { get; set; } = 
    [Required] public DateTime Date { get; set; } = 
     public DateTime? ReferenceDate { get; set; } = 
    public SaleQuery() { }
}

public record SaleCreate : IRecord
{
    [Column("company_id")][Required] public Guid CompanyId { get; set; } = "";
    [Column("account_id")][Required] public Guid AccountId { get; set; } = "";
    [Column("customer_id")][Required] public Guid CustomerId { get; set; } = "";
    [Column("currency_id")][Required] public string CurrencyId { get; set; } = "";
    [Column("place")] public string? Place { get; set; } = "";
    [Column("date")][Required] public string Date { get; set; } = "";
    [Column("reference")] public string? Reference { get; set; } = "";
    [Column("confirmed")][Required] public boolean Confirmed { get; set; } = null;
    [Column("reference_date")] public string? ReferenceDate { get; set; } = "";
    [Column("due_date")] public string? DueDate { get; set; } = "";
    [InverseProperty("Sale")] public ICollection<Saleitem>? Items { get; set; } = null;
}

public record SaleUpdate : IRecord
{
    [Column("company_id")][Required] public Guid CompanyId { get; set; } = "";
    [Column("account_id")][Required] public Guid AccountId { get; set; } = "";
    [Column("customer_id")][Required] public Guid CustomerId { get; set; } = "";
    [Column("currency_id")][Required] public string CurrencyId { get; set; } = "";
    [Column("place")] public string? Place { get; set; } = "";
    [Column("reference")] public string? Reference { get; set; } = "";
    [Column("confirmed")][Required] public boolean Confirmed { get; set; } = null;
    [Column("reference_date")] public string? ReferenceDate { get; set; } = "";
    [Column("due_date")] public string? DueDate { get; set; } = "";
    [InverseProperty("Sale")] public ICollection<Saleitem>? Items { get; set; } = null;
}

public record SaleModify : IRecord
{
    [Column("company_id")] public Guid? CompanyId { get; set; } = "";
    [Column("account_id")] public Guid? AccountId { get; set; } = "";
    [Column("customer_id")] public Guid? CustomerId { get; set; } = "";
    [Column("currency_id")] public string? CurrencyId { get; set; } = "";
    [Column("place")] public string? Place { get; set; } = "";
    [Column("reference")] public string? Reference { get; set; } = "";
    [Column("confirmed")] public boolean? Confirmed { get; set; } = null;
    [Column("reference_date")] public string? ReferenceDate { get; set; } = "";
    [Column("due_date")] public string? DueDate { get; set; } = "";
    [InverseProperty("Sale")] public ICollection<Saleitem>? Items { get; set; } = null;
}