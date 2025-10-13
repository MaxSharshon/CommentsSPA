export const insertTagAtCursor = (textarea, tagName) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let openingTag = `<${tagName}>`;
    let closingTag = `</${tagName}>`;
    
    if (tagName === "a") {
        openingTag = `<${tagName} href="" title="">`;
    }
    
    const newText = 
        textarea.value.substring(0, start) +
        openingTag +
        selectedText +
        closingTag +
        textarea.value.substring(end);
    
    textarea.value = newText;
    
    let cursorPosition;
    if (selectedText.length > 0) {
        cursorPosition = start + openingTag.length + selectedText.length + closingTag.length;
    } else {
        cursorPosition = start + openingTag.length;
    }
    
    textarea.focus();
    textarea.setSelectionRange(cursorPosition, cursorPosition);
    
    return newText;
}