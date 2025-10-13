export const fetchComments = async (sortBy = "createdAt", order = "desc", page = 1) => {
    try {
        const response = await fetch(`/api/comments/top?sortBy=${sortBy}&order=${order}&page=${page}`);
        if (!response.ok) {
            console.error("Failed to fetch comments");
            return { items: [], page: 1, totalPages: 1 };
        }
        return await response.json();
    } catch (error) {
        console.error("fetchComments error: ", error);
        return { items: [], page: 1, totalPages: 1 };
    }
}

export const fetchReplies = async (commentId, sortBy = "createdAt", order = "desc", page = 1) => {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies?sortBy=${sortBy}&order=${order}&page=${page}`);
        if (!response.ok) {
            console.error("Failed to fetch replies for comment: ", commentId);
            return { items: [], page: 1, totalPages: 1 };
        }
        return await response.json();
    } catch (error) {
        console.error("fetchReplies error for comment: ", error);
        return { items: [], page: 1, totalPages: 1 };
    }
}

export async function submitComment(commentData) {
    const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw  errorData.errors || new Error(`Failed to submit comment: ${response.statusText}`);
    }
    
    return response.json();
}