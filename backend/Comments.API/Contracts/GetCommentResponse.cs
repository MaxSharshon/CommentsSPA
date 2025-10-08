namespace Comments.API.Contracts;

public record GetCommentResponse(
    Guid Id,
    Guid? ParentId,
    string Username,
    string Email,
    string Text,
    string? HomePage,
    string? FilePath, 
    DateTime CreatedAt);