using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;

namespace Comments.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly string[] AllowedImageContentTypes = ["image/jpeg", "image/png", "image/gif"];
    private const string ALLOWED_TEXT_CONTENT_TYPE = "text/plain";
    private const int MAX_TXT_SIZE = 100 * 1024;
    private const int MAX_WIDTH = 320;
    private const int MAX_HEIGHT = 240;

    [HttpPost("upload")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadAsync(IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest("File is required.");

        var uploadsRoot = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsRoot);

        if (AllowedImageContentTypes.Contains(file.ContentType))
        {
            await using var input = file.OpenReadStream();
            using var image = await Image.LoadAsync(input, ct);

            var scale = Math.Min((double)MAX_WIDTH / image.Width, (double)MAX_HEIGHT / image.Height);
            if (scale < 1.0)
            {
                var newW = Math.Max(1, (int)Math.Round(image.Width * scale));
                var newH = Math.Max(1, (int)Math.Round(image.Height * scale));
                image.Mutate(ctx => ctx.Resize(newW, newH));
            }

            string ext;
            IImageEncoder encoder;
            switch (file.ContentType)
            {
                case "image/png":
                    ext = ".png";
                    encoder = new PngEncoder { CompressionLevel = PngCompressionLevel.Level6 };
                    break;
                case "image/gif":
                    ext = ".gif";
                    encoder = new GifEncoder();
                    break;
                default:
                    ext = ".jpg";
                    encoder = new JpegEncoder { Quality = 85 };
                    break;
            }

            var safeName = $"{Guid.NewGuid():N}{ext}";
            var savePath = Path.Combine(uploadsRoot, safeName);
            await image.SaveAsync(savePath, encoder, ct);

            var relativePath = Path.Combine("uploads", safeName).Replace('\\', '/');
            return Ok(new { filePath = relativePath, type = "image" });
        }

        if (file.ContentType == ALLOWED_TEXT_CONTENT_TYPE)
        {
            if (file.Length > MAX_TXT_SIZE)
                return BadRequest("TXT must be ≤ 100KB.");

            var safeName = $"{Guid.NewGuid():N}.txt";
            var savePath = Path.Combine(uploadsRoot, safeName);
            await using var fs = System.IO.File.Create(savePath);
            await file.CopyToAsync(fs, ct);

            var relativePath = Path.Combine("uploads", safeName).Replace('\\', '/');
            return Ok(new { filePath = relativePath, type = "text" });
        }

        return BadRequest("Allowed: JPG/PNG/GIF images or TXT file.");
    }
}