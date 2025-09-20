namespace Comments.API.Contracts;

public record GetCommentResponse(
    Guid Id,
    Guid? ParentId,
    string UserName,
    string Email,
    string Text,
    string? HomePage,
    string? FilePath, 
    DateTime CreatedAt);