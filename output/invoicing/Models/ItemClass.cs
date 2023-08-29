using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("item")]
public class Item : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [ForeignKey("CategoryId")] public Category? Category { get; set; } = null;
}

public record ItemView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [ForeignKey("CategoryId")] public CategoryView? Category { get; set; } = null;
}

public record ItemQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
     public Guid? CategoryId { get; set; } = 
    public ItemQuery() { }
}

public record ItemCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
}

public record ItemUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
}

public record ItemModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
}