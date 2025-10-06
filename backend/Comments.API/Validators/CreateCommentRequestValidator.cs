using Comments.API.Contracts;
using Comments.Core.Entities;
using FluentValidation;

namespace Comments.API.Validators;

public sealed class CreateCommentRequestValidator : AbstractValidator<CreateCommentRequest>
{
    public CreateCommentRequestValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("UserName is required")
            .Matches("^[A-Za-z0-9]+$").WithMessage("Only latin letters and digits are allowed")
            .MaximumLength(CommentConstraints.MAX_USERNAME_LENGTH);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(CommentConstraints.MAX_EMAIL_LENGTH);

        RuleFor(x => x.HomePage)
            .MaximumLength(CommentConstraints.MAX_HOME_PAGE_LENGTH)
            .Must(url => string.IsNullOrWhiteSpace(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
            .WithMessage("HomePage must be a valid URL");
        
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Text is required")
            .MaximumLength(CommentConstraints.MAX_TEXT_LENGTH);

        RuleFor(x => x.FilePath)
            .Must(IsSafeRelativePath)
            .WithMessage("FilePath must be safe relative path.");
        
        RuleFor(x => x.CaptchaId)
            .NotEmpty().WithMessage("CaptchaId is required");

        RuleFor(x => x.CaptchaCode)
            .NotEmpty().WithMessage("CaptchaCode is required")
            .Matches("^[A-Za-z0-9]{4,}$").WithMessage("CaptchaCode must contain only letters and digits");
    }

    private static bool IsSafeRelativePath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path)) return true;
        if (Path.IsPathRooted(path)) return false;
        var normalized = path.Replace('\\', '/');
        return !normalized.Contains("..");
    }
}