using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("currency")]
public class Currency : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("symbol")][Required] public string Symbol { get; set; } = "";
}

public record CurrencyView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("symbol")] public string? Symbol { get; set; } = "";
}

public record CurrencyQuery : ClientQuery
{
    
    public CurrencyQuery() { }
}

public record CurrencyCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("symbol")][Required] public string Symbol { get; set; } = "";
}

public record CurrencyUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("symbol")][Required] public string Symbol { get; set; } = "";
}

public record CurrencyModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("symbol")] public string? Symbol { get; set; } = "";
}