export const fetchComments = async () => {
    try {
        const response = await fetch(`/api/comments/top`);
        if (!response.ok) {
            console.error("Failed to fetch comments");
            return [];
        }
        const data = await response.json();
        return data.items ?? [];
    } catch (error) {
        console.error("fetchComments error: ", error);
        return [];
    }
}

export const fetchReplies = async (commentId) => {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies`);
        if (!response.ok) {
            console.error("Failed to fetch replies for comment: ", commentId);
            return [];
        }
        const data = await response.json();
        return data.items ?? [];
    } catch (error) {
        console.error("fetchReplies error for comment: ", error);
        return [];
    }
}