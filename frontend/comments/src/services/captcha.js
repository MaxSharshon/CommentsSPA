export async function generateCaptcha() {
    const response = await fetch("/api/captcha/generate");
    if (!response.ok) {
        throw new Error("Failed to fetch captcha");
    }
    return await response.json();
}