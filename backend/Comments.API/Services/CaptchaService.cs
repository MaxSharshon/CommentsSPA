using System.Security.Cryptography;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Comments.API.Services;

public static class CaptchaService
{
    private static readonly char[] Alphabet =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789".ToCharArray();

    private static readonly Lazy<Font> CachedFont = new(CreateFont, isThreadSafe: true);

    public static string GenerateCaptchaCode(int length = 6)
    {
        var code = new char[length];
        for (var i = 0; i < length; i++)
            code[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        return new string(code);
    }

    public static byte[] GenerateCaptchaImage(string captchaCode)
    {
        const int WIDTH = 150;
        const int HEIGHT = 60;

        using var image = new Image<Rgba32>(WIDTH, HEIGHT, Color.White);

        var font = CachedFont.Value;
        image.Mutate(context =>
        {
            var x = 8f;
            foreach (var c in captchaCode)
            {
                var color = Color.FromRgb(
                    (byte)RandomNumberGenerator.GetInt32(50, 200),
                    (byte)RandomNumberGenerator.GetInt32(50, 200),
                    (byte)RandomNumberGenerator.GetInt32(50, 200));
                float y = RandomNumberGenerator.GetInt32(5, 25);

                context.DrawText(c.ToString(), font, color, new PointF(x, y));

                x += 22;
            }

            for (var i = 0; i < 4; i++)
            {
                var p1 = new PointF(RandomNumberGenerator.GetInt32(WIDTH), RandomNumberGenerator.GetInt32(HEIGHT));
                var p2 = new PointF(RandomNumberGenerator.GetInt32(WIDTH), RandomNumberGenerator.GetInt32(HEIGHT));
                var lineColor = Color.FromRgb(
                    (byte)RandomNumberGenerator.GetInt32(150, 255),
                    (byte)RandomNumberGenerator.GetInt32(150, 255),
                    (byte)RandomNumberGenerator.GetInt32(150, 255));
                context.DrawLine(lineColor, 1f, p1, p2);
            }
        });

        using var memoryStream = new MemoryStream();
        image.Save(memoryStream, new PngEncoder());
        return memoryStream.ToArray();
    }

    private static Font CreateFont()
    {
        var assembly = typeof(CaptchaService).Assembly;
        const string RESOURCE_NAME = "Comments.API.Resources.Fonts.DejaVuSans.ttf";

        using var stream = assembly.GetManifestResourceStream(RESOURCE_NAME)
            ?? throw new FileNotFoundException($"Embedded font resource not found: {RESOURCE_NAME}");

        var fontCollection = new FontCollection();
        var family = fontCollection.Add(stream);
        return family.CreateFont(32, FontStyle.Bold);
    }
}
