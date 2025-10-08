import React, {useEffect, useState} from 'react'
import {Button, HStack, VStack} from "@chakra-ui/react";
import CommentItem from "@/components/CommentItem.jsx";
import {fetchComments} from "@/services/comments.js";
import SortPanel from "@/components/SortPanel.jsx";
import Pagination from "@/components/Pagination.jsx";
import {useDisclosure} from "@chakra-ui/icons";
import CommentFormModal from "@/components/CommentFormModal.jsx";

function App() {
    const [comments, setComments] = useState([]);
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const loadComments = async (p = page) => {
        let response = await fetchComments(sortBy, order, p);
        setComments(response.items ?? []);
        setTotalPages(response.totalPages ?? 1);
        setPage(p);
    };
    
    useEffect(() => {
        loadComments();
    }, [page, sortBy, order])

    return (
        <VStack className="gap-4 w-full items-center p-4">
            <HStack>
                <SortPanel
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    order={order}
                    setOrder={setOrder}
                />
                
                <>
                    <Button onClick={onOpen} colorScheme="purple">New comment</Button>
                    <CommentFormModal 
                        isOpen={isOpen}
                        onClose={onClose} 
                        onSubmit={() => loadComments(1)}/>
                </>
            </HStack>
            
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
                                     loadComments={loadComments}
                        />
                    </VStack>
                );
            })}
            
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage}
            />
        </VStack>
    )
}

export default App;