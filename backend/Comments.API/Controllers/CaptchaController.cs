using Comments.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Comments.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CaptchaController(IMemoryCache cache) : ControllerBase
{
    private const int CAPTCHA_LENGTH = 6;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    [HttpGet("generate")]
    public IActionResult GenerateCaptcha()
    {
        var captchaCode = CaptchaService.GenerateCaptchaCode(CAPTCHA_LENGTH);
        var captchaId = Guid.NewGuid().ToString();

        cache.Set(captchaId, captchaCode, CacheDuration);
        var base64Image = Convert.ToBase64String(CaptchaService.GenerateCaptchaImage(captchaCode));

        return Ok(new
        {
            CaptchaId = captchaId,
            CaptchaImage = $"data:image/png;base64,{base64Image}"
        });
    }
    
    [HttpGet("generate-image")]
    [Produces("image/png")]
    public IActionResult GenerateCaptchaImage()
    {
        var captchaCode = CaptchaService.GenerateCaptchaCode(CAPTCHA_LENGTH);
        var captchaId = Guid.NewGuid().ToString();

        cache.Set(captchaId, captchaCode, CacheDuration);
        var imageBytes = CaptchaService.GenerateCaptchaImage(captchaCode);

        Response.Headers["X-Captcha-Id"] = captchaId;
        return File(imageBytes, "image/png");
    }

    [HttpGet("refresh")]
    public IActionResult RefreshCaptcha([FromQuery] string captchaId)
    {
        if (string.IsNullOrWhiteSpace(captchaId))
        {
            return BadRequest($"{nameof(captchaId)} is required.");
        }

        cache.Remove(captchaId);

        var newCaptchaCode = CaptchaService.GenerateCaptchaCode(CAPTCHA_LENGTH);
        cache.Set(captchaId, newCaptchaCode, CacheDuration);

        var base64Image = Convert.ToBase64String(CaptchaService.GenerateCaptchaImage(newCaptchaCode));

        return Ok(new
        {
            CaptchaId = captchaId,
            CaptchaImage = $"data:image/png;base64,{base64Image}"
        });
    }
}