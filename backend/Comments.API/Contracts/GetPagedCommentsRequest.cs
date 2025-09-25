namespace Comments.API.Contracts;

public record GetPagedCommentsRequest
{
    public int Page { get; init; } = 1;
    
    private readonly string? _sortBy;
    public string? SortBy
    {
        get => _sortBy;
        init => _sortBy = value?.Trim().ToLowerInvariant();
    }

    private readonly string? _order;
    public string? Order
    {
        get => _order;
        init => _order = value?.Trim().ToLowerInvariant();
    }
}