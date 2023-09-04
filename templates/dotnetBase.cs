

using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;
using System.Text.Json;
// using System.Linq.Dynamic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class MinLengthIfNotNullAttribute : MinLengthAttribute
{
    public MinLengthIfNotNullAttribute(int length) : base(length) { }

    public override bool IsValid(object? value)
    {
        // If the value is null, return true (valid)
        if (string.IsNullOrWhiteSpace(value as string)) return true;

        // Otherwise, use the base class logic
        return base.IsValid(value);
    }
}

public enum ErrorCodes
{
    EntityNotFound,
    EntityTypeMismatch,
    PropertyTypeMismatch,
    QueryValidationError,
    DataValidationError,
    DatabaseNotFound,
    DatabaseLocked,
    UnhandledException,
    Unauthenticated,
    Unauthorized,
    RelationalConstraintViolation,
    UniqueConstraintViolation
}

public static class ErrorCodesExtensions
{
    private static readonly Dictionary<ErrorCodes, int> _errorCodeValues = new Dictionary<ErrorCodes, int>
    {
        { ErrorCodes.EntityNotFound, 404 },
        { ErrorCodes.EntityTypeMismatch, 400 },
        { ErrorCodes.PropertyTypeMismatch, 400 },
        { ErrorCodes.QueryValidationError, 405 },
        { ErrorCodes.DataValidationError, 405 },
        { ErrorCodes.DatabaseNotFound, 500 },
        { ErrorCodes.DatabaseLocked, 500 },
        { ErrorCodes.UnhandledException, 500 },
        { ErrorCodes.Unauthenticated, 401 },
        { ErrorCodes.Unauthorized, 403 },
        { ErrorCodes.RelationalConstraintViolation, 405 },
        { ErrorCodes.UniqueConstraintViolation, 405 }
    };

    public static int ToErrorCodeValue(this ErrorCodes errorCode)
    {
        if (_errorCodeValues.TryGetValue(errorCode, out int value))
            return value;
        else
            throw new ArgumentException("Invalid error code");
    }
}

public enum Operators
{
    Equals,
    NotEquals,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    IsNull,
    IsNotNull,
    IsIn,
    IsNotIn,
    StartsWith,
    EndsWith,
    Contains,
    Between,
    NotBetween
}

public static class OperatorsExtensions
{
    private static readonly Dictionary<Operators, string> _operatorStrings = new Dictionary<Operators, string>
    {
        { Operators.Equals, "=" },
        { Operators.NotEquals, "<>" },
        { Operators.GreaterThan, ">" },
        { Operators.GreaterThanOrEqual, ">=" },
        { Operators.LessThan, "<" },
        { Operators.LessThanOrEqual, "<=" },
        { Operators.IsNull, "IS NULL" },
        { Operators.IsNotNull, "IS NOT NULL" },
        { Operators.IsIn, "IN" },
        { Operators.IsNotIn, "NOT IN" },
        { Operators.StartsWith, "LIKE" },
        { Operators.EndsWith, "LIKE" },
        { Operators.Contains, "LIKE" },
        { Operators.Between, "BETWEEN" },
        { Operators.NotBetween, "NOT BETWEEN" }
    };

    public static string ToOperatorString(this Operators op)
    {
        if (_operatorStrings.TryGetValue(op, out string? value))
            return value;
        else
            throw new ArgumentException("Invalid operator");
    }
}

public enum ClientOperator
{
    Contains,
    Equals,
    NotEquals,
    IsIn,
    IsNotIn,
    IsNull,
    IsNotNull,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    StartsWith,
    EndsWith,
    Between,
    NotBetween
}

public static class ClientOperatorExtensions
{
    private static readonly Dictionary<ClientOperator, string> _operatorStrings = new Dictionary<ClientOperator, string>
    {
        { ClientOperator.Contains, "like" },
        { ClientOperator.Equals, "e" },
        { ClientOperator.NotEquals, "ne" },
        { ClientOperator.IsIn, "in" },
        { ClientOperator.IsNotIn, "nin" },
        { ClientOperator.IsNull, "nul" },
        { ClientOperator.IsNotNull, "nnul" },
        { ClientOperator.GreaterThan, "gt" },
        { ClientOperator.GreaterThanOrEqual, "gte" },
        { ClientOperator.LessThan, "lt" },
        { ClientOperator.LessThanOrEqual, "lte" },
        { ClientOperator.StartsWith, "sw" },
        { ClientOperator.EndsWith, "ew" },
        { ClientOperator.Between, "bt" },
        { ClientOperator.NotBetween, "nbt" }
    };

    public static string ToOperatorString(this ClientOperator op)
    {
        if (_operatorStrings.TryGetValue(op, out string? value))
            return value;
        else
            throw new ArgumentException("Invalid client operator");
    }
}

public enum SortDirection
{
    Asc,
    Desc
}

public static class SortDirectionExtensions
{
    private static readonly Dictionary<SortDirection, string> _sortDirectionStrings = new Dictionary<SortDirection, string>
    {
        { SortDirection.Asc, "ASC" },
        { SortDirection.Desc, "DESC" }
    };

    public static string ToSortDirectionString(this SortDirection sortDirection)
    {
        if (_sortDirectionStrings.TryGetValue(sortDirection, out string? value))
            return value;
        else
            throw new ArgumentException("Invalid sort direction");
    }
}


public class Sort
{
    public Sort(string column)
    {
        Column = column;
    }
    public string Column { get; set; }

    public SortDirection Direction { get; set; }
}

public class Condition
{
    public Condition(string column, Operators _operator, object? value = null, object? value2 = null, List<object>? values = null)
    {
        Column = column;
        Operator = _operator;
        Value = value;
        Value2 = value2;
        Values = values;
    }

    public string Column { get; set; }

    public Operators Operator { get; set; }
    public object? Value { get; set; }
    public object? Value2 { get; set; }
    public List<object>? Values { get; set; }
}

public record ClientQuery
{
    public string? _Sort { get; set; }
    public string? _Order { get; set; }
    public int? _Page { get; set; } = 1;
    public int? _Size { get; set; } = 30;
}

public class DataQuery
{
    public DataQuery()
    {
        Sort = new List<Sort>();
        Where = new List<Condition>();
    }

    public List<Sort> Sort { get; set; } = new List<Sort>();
    public List<Condition> Where { get; set; } = new List<Condition>();

    public int Limit { get; set; } = 0;
    public int Offset { get; set; } = 0;
}

public record IRecord
{
    [Key]
    public Guid Id { get; set; }
}

public interface IEntity
{
    [Key]
    [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    // public Entity() { }
}

public class QueryResult<Q, T>
{
    public QueryResult(Q query)
    {
        Query = query;
        Result = new List<T>();
    }
    public int Count { get; set; }
    public int Total { get; set; }
    public Q Query { get; set; }

    public IEnumerable<T> Result { get; set; }
}

#pragma warning disable CS8604

public abstract class Business<TEntity, TEntityView, TEntityUpdate, TEntityModify, TEntityCreate, TEntityClientQuery>
    where TEntity : IEntity, new()
    where TEntityView : IRecord, new()
    where TEntityUpdate : IRecord
    where TEntityModify : IRecord
    where TEntityCreate : IRecord
    where TEntityClientQuery : ClientQuery, new()
{
    protected string entityName;
    protected DbContext Db { get; set; }

    public Business(DbContext db)
    {
        Db = db;
        entityName = typeof(TEntity).ToString();
    }

    public IDbContextTransaction BeginTransaction()
    {
        return Db.Database.BeginTransaction();
    }

    public void CommitTransaction(IDbContextTransaction transaction)
    {
        transaction.Commit();
        transaction.Dispose();
    }

    public void RevokeTransaction(IDbContextTransaction transaction)
    {
        transaction.Rollback();
        transaction.Dispose();
    }

    public virtual DataQuery ConvertToDataQuery(TEntityClientQuery query)
    {
        var dataQuery = new DataQuery
        {
            Limit = query._Size ?? 0,
            Offset = query._Page.HasValue ? query._Page.Value - 1 : 0 * query._Size ?? 0
        };

        if (query._Sort is not null)
        {
            var sortProps = query._Sort.Split(',').ToList();
            var sortDirs = query._Order is not null ? query._Order.Split(',').ToList() : new List<string>();

            for (var i = 0; i < sortProps.Count; i++)
            {
                if (sortDirs.Count > i)
                {
                    dataQuery.Sort.Add(new Sort(sortProps[i]) { Direction = sortDirs.Count > i && sortDirs[i] == "desc" ? SortDirection.Desc : SortDirection.Asc });
                }
            }
        }

        return dataQuery;
    }

    public virtual TEntityClientQuery ConvertToClientQuery(DataQuery query)
    {
        var clientQuery = new TEntityClientQuery
        {
            _Order = string.Join(",", query.Sort.Select(x => x.Direction.ToSortDirectionString())),
            _Page = query.Offset == 0 || query.Limit == 0 ? 1 : (query.Offset / query.Limit) + 1,
            _Size = query.Limit,
            _Sort = string.Join(",", query.Sort.Select(x => x.Column))
        };
        return clientQuery;
    }

    public abstract TEntityView GetById(Guid id, int maxDepth = 2);

    public abstract TEntityView Create(TEntityCreate entity);
    public abstract TEntityView Update(Guid id, TEntityUpdate entity);

    public abstract TEntityView Modify(Guid id, JsonElement entity);

    public abstract TEntityView Delete(Guid id);

    public abstract QueryResult<ClientQuery, TEntityView> GetAll(int maxDepth = 2);

    public abstract QueryResult<ClientQuery, TEntityView> GetAll(TEntityClientQuery clientQuery, DataQuery query, int maxDepth = 2);

    private IOrderedQueryable<TEntity>? OrderByProperties(IQueryable<TEntity> query, List<Sort> propertyNames)
    {
        IOrderedQueryable<TEntity>? orderedQuery = null;
        int i = 0;
        foreach (var item in propertyNames)
        {
            var propertyName = item.Column;
            var sortOrder = item.Direction;

            // Create a parameter expression for the input object
            var parameter = Expression.Parameter(typeof(TEntity), "x");

            // Create an expression for the property
            var propertyExpression = Expression.Property(parameter, propertyName);

            // Create the lambda expression
            var lambda = Expression.Lambda<Func<TEntity, object>>(propertyExpression, parameter);

            // Apply the ordering to the query
            if (i == 0)
            {
                orderedQuery = sortOrder == SortDirection.Asc ? query.OrderBy(lambda) : query.OrderByDescending(lambda);
            }
            else if (orderedQuery != null)
            {
                orderedQuery = sortOrder == SortDirection.Asc ? orderedQuery.ThenBy(lambda) : orderedQuery.ThenByDescending(lambda);
            }
            i++;
        }

        return orderedQuery;
    }

    private Expression<Func<T, bool>> BuildWhereExpression<T>(List<Condition> conditions)
    {
        // Create a parameter expression for the input object
        var parameter = Expression.Parameter(typeof(T), "x");

        // Create the initial expression
        Expression? finalExpression = null;

        // Iterate over the conditions and build the expression
        foreach (var condition in conditions)
        {
            // Create an expression for the property
            var propertyExpression = Expression.Property(parameter, condition.Column);

            // Create an expression for the value
            var valueExpression = Expression.Constant(condition.Value);

            // Create the binary expression based on the operator
            Expression binaryExpression;


            switch (condition.Operator)
            {
                case Operators.IsNull:
                    binaryExpression = Expression.Equal(propertyExpression, Expression.Constant(null));
                    break;
                case Operators.IsNotNull:
                    binaryExpression = Expression.NotEqual(propertyExpression, Expression.Constant(null));
                    break;
                case Operators.Equals:
                    binaryExpression = Expression.Equal(propertyExpression, valueExpression);
                    break;
                case Operators.NotEquals:
                    binaryExpression = Expression.NotEqual(propertyExpression, valueExpression);
                    break;
                case Operators.GreaterThan:
                    binaryExpression = Expression.GreaterThan(propertyExpression, valueExpression);
                    break;
                case Operators.GreaterThanOrEqual:
                    binaryExpression = Expression.GreaterThanOrEqual(propertyExpression, valueExpression);
                    break;
                case Operators.LessThan:
                    binaryExpression = Expression.LessThan(propertyExpression, valueExpression);
                    break;
                case Operators.LessThanOrEqual:
                    binaryExpression = Expression.LessThanOrEqual(propertyExpression, valueExpression);
                    break;
                case Operators.Contains:
                    binaryExpression = Expression.Call(propertyExpression, typeof(string).GetMethod("Contains", new[] { typeof(string) }), valueExpression);
                    break;
                case Operators.StartsWith:
                    binaryExpression = Expression.Call(propertyExpression, typeof(string).GetMethod("StartsWith", new[] { typeof(string) }), valueExpression);
                    break;
                case Operators.EndsWith:
                    binaryExpression = Expression.Call(propertyExpression, typeof(string).GetMethod("EndsWith", new[] { typeof(string) }), valueExpression);
                    break;

                case Operators.Between:
                    var lowerBoundExpression = Expression.GreaterThanOrEqual(propertyExpression, Expression.Constant(condition.Value));
                    var upperBoundExpression = Expression.LessThanOrEqual(propertyExpression, Expression.Constant(condition.Value2));
                    binaryExpression = Expression.AndAlso(lowerBoundExpression, upperBoundExpression);
                    break;
                case Operators.NotBetween:
                    var notLowerBoundExpression = Expression.LessThan(propertyExpression, Expression.Constant(condition.Value));
                    var notUpperBoundExpression = Expression.GreaterThan(propertyExpression, Expression.Constant(condition.Value2));
                    binaryExpression = Expression.OrElse(notLowerBoundExpression, notUpperBoundExpression);
                    break;
                case Operators.IsIn:
                    var valuesExpression = Expression.Constant(condition.Values);
                    var methodInfo = typeof(Enumerable).GetMethods().First(m => m.Name == "Contains" && m.GetParameters().Length == 2).MakeGenericMethod(propertyExpression.Type);
                    binaryExpression = Expression.Call(methodInfo, valuesExpression, propertyExpression);
                    break;
                case Operators.IsNotIn:
                    var valuesExpression2 = Expression.Constant(condition.Values);
                    var methodInfo2 = typeof(Enumerable).GetMethods().First(m => m.Name == "Contains" && m.GetParameters().Length == 2).MakeGenericMethod(propertyExpression.Type);
                    binaryExpression = Expression.Not(Expression.Call(methodInfo2, valuesExpression2, propertyExpression));
                    break;
                default:
                    throw new InvalidOperationException("Invalid operator");
            }



            // Combine the binary expression with the final expression
            if (finalExpression is null)
            {
                finalExpression = binaryExpression;
            }
            else
            {
                finalExpression = Expression.AndAlso(finalExpression, binaryExpression);
            }
        }

        finalExpression ??= Expression.Equal(Expression.Constant(1), Expression.Constant(1));


        // Create and return the final lambda expression
        return Expression.Lambda<Func<T, bool>>(finalExpression, parameter);
    }

}

