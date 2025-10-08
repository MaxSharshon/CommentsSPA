using AutoMapper;
using Comments.API.Contracts;
using Comments.Core.Entities;
using Comments.Data.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Comments.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(CommentsContext context, IMapper mapper, IMemoryCache memoryCache) : ControllerBase
{
    private const int PAGE_SIZE = 25;
    
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateCommentRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid || !ValidateCaptcha(request))
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
    public Task<IActionResult> GetCommentsAsync([FromQuery] GetPagedCommentsRequest request, CancellationToken ct = default)
    {
        return GetPagedAsync(request, null, ct);
    }
    
    [HttpGet("{id:guid}/replies")]
    public async Task<IActionResult> GetRepliesAsync(
        Guid id,
        [FromQuery] GetPagedCommentsRequest request,
        CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);
        
        if(!await context.Comments.AsNoTracking().AnyAsync(c => c.Id == id, ct))
            return NotFound();

        return await GetPagedAsync(request, id, ct);
    }
    
    private async Task<IActionResult> GetPagedAsync(
        [FromQuery] GetPagedCommentsRequest request,
        Guid? parentId,
        CancellationToken ct = default)
    {
        var sortBy = request.SortBy ?? CommentSortFields.CREATED_AT;
        var order = request.Order ?? OrderFields.DESC;

        var query = context.Comments.AsNoTracking().Where(c => c.ParentId == parentId);
        query = ApplyCommentSorting(query, order, sortBy);

        var totalItems = await query.LongCountAsync(ct);
        var totalPages = (int)Math.Ceiling(totalItems / (double)PAGE_SIZE);

        var comments = await query
            .Skip((request.Page - 1) * PAGE_SIZE)
            .Take(PAGE_SIZE)
            .ToListAsync(ct);

        var items = comments.Select(mapper.Map<GetCommentResponse>).ToList();
        return Ok(new PagedCommentsResponse(items, request.Page, PAGE_SIZE, totalItems, totalPages));
    }

    private static IQueryable<Comment> ApplyCommentSorting(IQueryable<Comment> query, string order, string sortBy)
    {
        var isDesc = order == OrderFields.DESC;
        query = sortBy switch
        {
            CommentSortFields.USER_NAME => isDesc
                ? query.OrderByDescending(c => c.Username).ThenByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.Username).ThenBy(c => c.CreatedAt),
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
    
    private bool ValidateCaptcha(CreateCommentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CaptchaId) || string.IsNullOrWhiteSpace(request.CaptchaCode))
        {
            ModelState.AddModelError(nameof(request.CaptchaId), "CaptchaId and CaptchaCode are required.");
            return false;
        }

        if (!memoryCache.TryGetValue<string>(request.CaptchaId, out var expectedCode))
        {
            ModelState.AddModelError(nameof(request.CaptchaId), "CAPTCHA expired or not found.");
            return false;
        }

        if (!string.Equals(expectedCode, request.CaptchaCode.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ModelState.AddModelError(nameof(request.CaptchaCode), "Invalid CAPTCHA code.");
            return false;
        }

        memoryCache.Remove(request.CaptchaId);
        return true;
    }
}
