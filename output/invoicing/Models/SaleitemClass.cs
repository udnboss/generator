using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("saleItem")]
public class Saleitem : Entity
{
    [Column("sale_id")][Required] public Guid SaleId { get; set; } = "";
    [Column("item_id")][Required] public Guid ItemId { get; set; } = "";
    [Column("description")] public string? Description { get; set; } = "";
    [Column("quantity")][Required] public integer Quantity { get; set; } = null;
    [Column("price")][Required] public number Price { get; set; } = null;
    [Column("total")] public number? Total { get; set; } = null;
    [ForeignKey("SaleId")] public Sale? Sale { get; set; } = null;
    [ForeignKey("ItemId")] public Item? Item { get; set; } = null;
}

public record SaleitemView : IRecord
{
    [Column("sale_id")] public Guid? SaleId { get; set; } = "";
    [Column("item_id")] public Guid? ItemId { get; set; } = "";
    [Column("description")] public string? Description { get; set; } = "";
    [Column("quantity")] public integer? Quantity { get; set; } = null;
    [Column("price")] public number? Price { get; set; } = null;
    [Column("total")] public number? Total { get; set; } = null;
    [ForeignKey("SaleId")] public SaleView? Sale { get; set; } = null;
    [ForeignKey("ItemId")] public ItemView? Item { get; set; } = null;
}

public record SaleitemQuery : ClientQuery
{
    
    public SaleitemQuery() { }
}

public record SaleitemCreate : IRecord
{
    [Column("sale_id")][Required] public Guid SaleId { get; set; } = "";
    [Column("item_id")][Required] public Guid ItemId { get; set; } = "";
    [Column("description")] public string? Description { get; set; } = "";
    [Column("quantity")][Required] public integer Quantity { get; set; } = null;
    [Column("price")][Required] public number Price { get; set; } = null;
}

public record SaleitemUpdate : IRecord
{
    [Column("sale_id")][Required] public Guid SaleId { get; set; } = "";
    [Column("item_id")][Required] public Guid ItemId { get; set; } = "";
    [Column("description")] public string? Description { get; set; } = "";
    [Column("quantity")][Required] public integer Quantity { get; set; } = null;
    [Column("price")][Required] public number Price { get; set; } = null;
}

public record SaleitemModify : IRecord
{
    [Column("sale_id")] public Guid? SaleId { get; set; } = "";
    [Column("item_id")] public Guid? ItemId { get; set; } = "";
    [Column("description")] public string? Description { get; set; } = "";
    [Column("quantity")] public integer? Quantity { get; set; } = null;
    [Column("price")] public number? Price { get; set; } = null;
}