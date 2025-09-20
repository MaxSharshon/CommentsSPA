namespace Comments.API.Contracts;

public static class CommentSortFields
{
    public const string USER_NAME = "username";
    public const string EMAIL = "email";
    public const string CREATED_AT = "createdat";

    public static readonly string[] All = [USER_NAME, EMAIL, CREATED_AT];
}