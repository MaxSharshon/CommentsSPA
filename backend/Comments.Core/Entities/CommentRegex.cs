using System.Text.RegularExpressions;

namespace Comments.Core.Entities;

public static partial class CommentRegex
{
    [GeneratedRegex(CommentConstraints.USERNAME_PATTERN)]
    public static partial Regex UserName();
}