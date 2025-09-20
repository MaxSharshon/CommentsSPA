namespace Comments.Core.Entities;

public static class CommentConstraints
{
    public const int MAX_USERNAME_LENGTH = 100;
    public const int MAX_EMAIL_LENGTH = 200;
    public const int MAX_HOME_PAGE_LENGTH = 500;
    public const int MAX_TEXT_LENGTH = 5000;

    public const string USERNAME_PATTERN = "^[A-Za-z0-9]+$";
}