namespace Comments.Core.Entities;

public class Comment
{
    public Guid Id { get; set; }

    public Guid? ParentId { get; set; }
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; } = new List<Comment>();

    public required string UserName { get; init; }
    public required string Email { get; init; }
    public string? HomePage { get; init; }

    public required string Text { get; init; }

    public DateTime CreatedAt { get; set; }

    public string? FilePath { get; init; }

    public static Comment Create(
        string userName,
        string email,
        string text,
        Guid? parentId = null,
        string? homePage = null,
        string? filePath = null,
        DateTime? createdAtUtc = null)
    {
        userName = (userName ?? string.Empty).Trim();
        email = (email ?? string.Empty).Trim().ToLowerInvariant();
        text = (text ?? string.Empty).Trim();
        homePage = string.IsNullOrWhiteSpace(homePage) ? null : homePage.Trim();
        filePath = string.IsNullOrWhiteSpace(filePath) ? null : filePath.Trim();

        if (string.IsNullOrWhiteSpace(userName))
            throw new ArgumentException("UserName is required.", nameof(userName));
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required.", nameof(email));
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text is required.", nameof(text));

        if (userName.Length > CommentConstraints.MAX_USERNAME_LENGTH)
            throw new ArgumentException($"Max length of UserName — {CommentConstraints.MAX_USERNAME_LENGTH}.",
                nameof(userName));
        if (email.Length > CommentConstraints.MAX_EMAIL_LENGTH)
            throw new ArgumentException($"Max length of Email — {CommentConstraints.MAX_EMAIL_LENGTH}.", nameof(email));
        if (homePage is { Length: > CommentConstraints.MAX_HOME_PAGE_LENGTH })
            throw new ArgumentException($"Max length of HomePage — {CommentConstraints.MAX_HOME_PAGE_LENGTH}.",
                nameof(homePage));
        if (text is { Length: > CommentConstraints.MAX_TEXT_LENGTH })
            throw new ArgumentException($"Max length of Text — {CommentConstraints.MAX_TEXT_LENGTH}.", nameof(text));

        if (!CommentRegex.UserName().IsMatch(userName))
            throw new ArgumentException("Only latin letters and digits are allowed.", nameof(userName));

        try
        {
            _ = new System.Net.Mail.MailAddress(email);
        }
        catch
        {
            throw new ArgumentException("Invalid email format.", nameof(email));
        }

        if (homePage is not null && !Uri.IsWellFormedUriString(homePage, UriKind.Absolute))
            throw new ArgumentException("HomePage must be a valid URL", nameof(homePage));

        if (filePath is not null)
            if (Path.IsPathRooted(filePath) || filePath.Replace('\\', '/').Contains(".."))
                throw new ArgumentException("FilePath must be safe relative path.", nameof(filePath));

        return new Comment
        {
            ParentId = parentId,
            UserName = userName,
            Email = email,
            HomePage = homePage,
            Text = text,
            CreatedAt = createdAtUtc ?? DateTime.UtcNow,
            FilePath = filePath
        };
    }
}