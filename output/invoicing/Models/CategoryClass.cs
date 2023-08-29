using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("category")]
public class Category : Entity
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [ForeignKey("CategoryId")] public Category? Category { get; set; } = null;
    [InverseProperty("Category")] public ICollection<Item>? Items { get; set; } = null;
}

public record CategoryView : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [ForeignKey("CategoryId")] public CategoryView? Category { get; set; } = null;
    [InverseProperty("Category")] public ICollection<Item>? Items { get; set; } = null;
}

public record CategoryQuery : ClientQuery
{
    [Required] public string Name { get; set; } = ""
     public Guid? CategoryId { get; set; } = 
    public CategoryQuery() { }
}

public record CategoryCreate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [InverseProperty("Category")] public ICollection<Item>? Items { get; set; } = null;
}

public record CategoryUpdate : IRecord
{
    [Column("name")][Required] public string Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [InverseProperty("Category")] public ICollection<Item>? Items { get; set; } = null;
}

public record CategoryModify : IRecord
{
    [Column("name")] public string? Name { get; set; } = "";
    [Column("category_id")] public Guid? CategoryId { get; set; } = "";
    [InverseProperty("Category")] public ICollection<Item>? Items { get; set; } = null;
}