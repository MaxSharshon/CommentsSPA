export const fetchComments = async (sortBy = "createdAt", order = "desc") => {
    try {
        const response = await fetch(`/api/comments/top?sortBy=${sortBy}&order=${order}`);
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

export const fetchReplies = async (commentId, sortBy = "createdAt", order = "desc") => {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies?sortBy=${sortBy}&order=${order}`);
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