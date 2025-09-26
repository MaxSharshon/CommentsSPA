using Ganss.Xss;

namespace Comments.Core.Entities;

public static class HtmlSanitizerUtil
{
    private static readonly HtmlSanitizer Sanitizer = CreateSanitizer();

    public static string Sanitize(string input)
    {
        return Sanitizer.Sanitize(input ?? string.Empty);
    }
    
    private static HtmlSanitizer CreateSanitizer()
    {
        var sanitizer = new HtmlSanitizer();
        
        ClearSanitizerSettings(sanitizer);
        ConfigureAllowedHtmlTags(sanitizer);

        sanitizer.KeepChildNodes = true;

        sanitizer.RemovingAttribute += (_, e) => { };
        
        return sanitizer;
    }

    private static void ConfigureAllowedHtmlTags(HtmlSanitizer sanitizer)
    {
        AddAllowedHtmlTags(sanitizer);
        AddAllowedSanitizerAttributes(sanitizer);
        AddAllowedSchemes(sanitizer);
    }

    private static void AddAllowedSchemes(HtmlSanitizer sanitizer)
    {
        sanitizer.AllowedSchemes.Add("http");
        sanitizer.AllowedSchemes.Add("https");
    }

    private static void AddAllowedSanitizerAttributes(HtmlSanitizer sanitizer)
    {
        sanitizer.AllowedAttributes.Add("href");
        sanitizer.AllowedAttributes.Add("title");
    }

    private static void AddAllowedHtmlTags(HtmlSanitizer sanitizer)
    {
        sanitizer.AllowedTags.Add("a");
        sanitizer.AllowedTags.Add("code");
        sanitizer.AllowedTags.Add("i");
        sanitizer.AllowedTags.Add("strong");
    }

    private static void ClearSanitizerSettings(HtmlSanitizer sanitizer)
    {
        sanitizer.AllowedTags.Clear();
        sanitizer.AllowedSchemes.Clear();
        sanitizer.AllowedAttributes.Clear();
    }
}