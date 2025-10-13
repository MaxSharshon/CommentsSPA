import { allowedTags } from "@/utils/allowedTags.js";

const validateTags = (text) => {
        const tagRegex = /<\/?([a-z]+)(\s+[^>]*)?>/gi;
        let match;
        while ((match = tagRegex.exec(text)) !== null) {
            const tag = match[1].toLowerCase();
            if (!allowedTags.includes(tag)) return false;
        }
        return true;
    };

export const validateCommentForm = (form) => {
    const errors = {};

    if (!form.username.trim()) {
        errors.username = "Username is required";
    } else {
        const usernameRegex = /^[A-Za-z0-9]+$/;
        if (!usernameRegex.test(form.username)) {
            errors.username = "Username can only contain Latin letters and numbers";
        }
    }

    if (!form.email.trim()) {
        errors.email = "Email is required";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            errors.email = "Email format is invalid";
        }
    }

    if (form.homepage.trim()) {
        try {
            const url = new URL(form.homepage);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                errors.homepage = "Homepage must start with http:// or https://";
            }
        } catch {
            errors.homepage = "Homepage URL is invalid";
        }
    }

    if (!form.text.trim()) errors.text = "Comment cannot be empty";
    if (!validateTags(form.text)) errors.text = "Only i, strong, code, and a tags are allowed";

    if (!form.captchaCode.trim()) errors.captchaCode = "CAPTCHA code is required";

    return errors;
};