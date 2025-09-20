using AutoMapper;
using Comments.API.Contracts;
using Comments.Core.Entities;
using Comments.Data.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Comments.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(CommentsContext context, IMapper mapper) : ControllerBase
{
    private const int PAGE_SIZE = 25;
    
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateCommentRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        Comment comment;
        try
        {
            comment = mapper.Map<Comment>(request);
        }
        catch (ArgumentException ex)
        {
            ModelState.AddModelError(ex.ParamName ?? "payload", ex.Message);
            return ValidationProblem(ModelState);
        }

        await context.Comments.AddAsync(comment, ct);
        await context.SaveChangesAsync(ct);

        var response = mapper.Map<GetCommentResponse>(comment);
        return CreatedAtAction("GetById", new { id = comment.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetCommentResponse>> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var comment = await context.Comments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        if (comment is null) return NotFound();
        return mapper.Map<GetCommentResponse>(comment);
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTopAsync(
        [FromQuery] GetTopCommentsRequest request,
        CancellationToken ct = default)
    {
        if(!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var sortBy = request.SortBy ?? CommentSortFields.CREATED_AT;
        var order = request.Order ?? OrderFields.DESC;

        var query = context.Comments
            .AsNoTracking()
            .Where(x => x.ParentId == null);

        query = ApplyCommentSorting(query, order, sortBy);

        var totalItems = await query.LongCountAsync(ct);
        var totalPages = (int)Math.Ceiling(totalItems / (double)PAGE_SIZE);

        var comments = await query
            .Skip((request.Page - 1) * PAGE_SIZE)
            .Take(PAGE_SIZE)
            .ToListAsync(ct);

        var items = comments.Select(mapper.Map<GetCommentResponse>).ToList();

        var result = new PagedCommentsResponse(items, request.Page, PAGE_SIZE, totalItems, totalPages);
        return Ok(result);
    }

    private static IQueryable<Comment> ApplyCommentSorting(IQueryable<Comment> query, string order, string sortBy)
    {
        var isDesc = order == OrderFields.DESC;
        query = sortBy switch
        {
            CommentSortFields.USER_NAME => isDesc
                ? query.OrderByDescending(c => c.UserName).ThenByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.UserName).ThenBy(c => c.CreatedAt),
            CommentSortFields.EMAIL => isDesc
                ? query.OrderByDescending(c => c.Email).ThenByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.Email).ThenBy(c => c.CreatedAt),
            CommentSortFields.CREATED_AT => isDesc
                ? query.OrderByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.CreatedAt),
            _ => query.OrderByDescending(c => c.CreatedAt)
        };
        return query;
    }
}
