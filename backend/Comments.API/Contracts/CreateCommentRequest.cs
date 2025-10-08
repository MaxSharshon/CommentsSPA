namespace Comments.API.Contracts;

public record CreateCommentRequest(
    Guid? ParentId,
    string Username,
    string Email,
    string Text,
    string? HomePage,
    string? FilePath,
    string CaptchaId,
    string CaptchaCode
);