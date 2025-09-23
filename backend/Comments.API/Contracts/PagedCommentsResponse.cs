namespace Comments.API.Contracts;

public record PagedCommentsResponse(
    IReadOnlyList<GetCommentResponse> Items,
    int Page,
    int PageSize,
    long TotalItems,
    int TotalPages);