import React, {useEffect, useState} from 'react'
import {HStack, Select, VStack} from "@chakra-ui/react";
import CommentItem from "@/components/CommentItem.jsx";
import {fetchComments} from "@/services/comments.js";
import SortPanel from "@/components/SortPanel.jsx";

function App() {
    const [comments, setComments] = useState([]);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    const loadComments = async () => {
        let comments = await fetchComments(sortBy, order);
        setComments(comments);
    };
    
    useEffect(() => {
        loadComments();
    }, [sortBy, order])

    return (
        <VStack className="gap-4 w-full items-center p-4">
            <SortPanel
                sortBy={sortBy}
                setSortBy={setSortBy}
                order={order}
                setOrder={setOrder}
            />
            
            {comments.map((c) => {
                return (
                    <VStack className="w-full max-w-3xl gap-4" align="stretch" key={c.id}>
                        <CommentItem key={c.id}
                                     id={c.id}
                                     username={c.username} 
                                     email={c.email} 
                                     text={c.text} 
                                     createdAt={c.createdAt}
                                     sortBy={sortBy}
                                     order={order}
                        />
                    </VStack>
                );
            })}
        </VStack>
    )
}

export default App;