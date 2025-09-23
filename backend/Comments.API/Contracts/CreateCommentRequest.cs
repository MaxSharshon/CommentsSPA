namespace Comments.API.Contracts;

public record CreateCommentRequest(
    Guid? ParentId,
    string UserName,
    string Email,
    string Text,
    string? HomePage,
    string? FilePath
);