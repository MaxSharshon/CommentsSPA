import React, {useEffect, useState} from 'react'
import {VStack} from "@chakra-ui/react";
import CommentItem from "@/components/CommentItem.jsx";
import {fetchComments} from "@/services/comments.js";

function App() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let comments = await fetchComments();
            console.log(comments);
            setComments(comments);
        };
        fetchData();
    }, [])

    return (
        <VStack className="gap-4 w-full items-center p-4">
            {comments.map((c) => {
                return (
                    <VStack className="w-full max-w-3xl gap-4" align="stretch" key={c.id}>
                        <CommentItem key={c.id}
                                     id={c.id}
                                     username={c.username} 
                                     email={c.email} 
                                     text={c.text} 
                                     createdAt={c.createdAt}/>
                    </VStack>
                );
            })}
        </VStack>
    )
}

export default App;