using Comments.API.Contracts;
using FluentValidation;

namespace Comments.API.Validators;

public class GetTopCommentsRequestValidator : AbstractValidator<GetTopCommentsRequest>
{
    public GetTopCommentsRequestValidator()
    {
        RuleFor(r=>r.Page)
            .GreaterThanOrEqualTo(1);

        RuleFor(r => r.SortBy)
            .NotEmpty()
            .Must(IsValidSortField)
            .WithMessage($"SortBy must be one of the following: {string.Join(", ", CommentSortFields.All)}");
        
        RuleFor(r=> r.Order)
            .NotEmpty()
            .Must(IsValidOrderField)
            .WithMessage($"Order must be one of the following: {string.Join(", ", OrderFields.All)}");
    }

    private static bool IsValidSortField(string? sortBy) =>
        sortBy is not null && CommentSortFields.All.Contains(sortBy);

    private static bool IsValidOrderField(string? order) => 
        order is not null && OrderFields.All.Contains(order);
}