using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

#pragma warning disable CS8618

[Table("__EntityName__")]
public class __EntityNameCapitalized__ : __EntityExtends__ IEntity
{
    __EntityClass__
}

public record __EntityNameCapitalized__View : IRecord
{
    __EntityViewClass__
}

public record __EntityNameCapitalized__Query : ClientQuery
{
    __EntityQueryClass__
    public __EntityNameCapitalized__Query() { }
}

public record __EntityNameCapitalized__Create : IRecord
{
    __EntityCreateClass__
}

public record __EntityNameCapitalized__Update : IRecord
{
    __EntityUpdateClass__
}

public record __EntityNameCapitalized__Modify : IRecord
{
    __EntityPartialClass__
}