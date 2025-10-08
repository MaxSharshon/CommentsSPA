import {Avatar, Box, HStack, IconButton, VStack, Text, Button, Collapse, Spinner} from "@chakra-ui/react";
import {ChatIcon, ChevronDownIcon, ChevronRightIcon, useDisclosure} from "@chakra-ui/icons";
import moment from "moment";
import {useState} from "react";
import {fetchReplies} from "@/services/comments.js";
import CommentFormModal from "@/components/CommentFormModal.jsx";
import DOMPurify from "dompurify";

const CommentItem = ({id, username, email, text, createdAt, level = 0, sortBy, order, loadComments, page}) => {
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [repliesLoaded, setRepliesLoaded] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toggleReplies = async () => {
        if (!showReplies && !loadingReplies) {
            setLoadingReplies(true);
            const fetched = await fetchReplies(id, sortBy, order);
            setReplies(fetched.items ?? []);
            setRepliesLoaded(true);
            setLoadingReplies(false);
            setShowReplies(true);
        } else {
            setShowReplies(!showReplies);
        }
    }

    return (
        <Box className="p-6 shadow-sm rounded-lg border border-gray-200 w-full"
             style={{marginLeft: level * 20}}>
            <VStack align="stretch" spacing={4}>
                <HStack align="start" spacing={3}>
                    <Avatar size="sm" name={username}/>
                    <HStack justify="space-between" className="w-full">
                        <VStack align="start" spacing={0}>
                            <Text className="font-bold">{username}</Text>
                            <Text className="text-sm text-gray-500">{email}</Text>
                            <Text className="text-xs text-gray-400">
                                {moment(createdAt).format("DD/MM/YY hh:mm:ss")}
                            </Text>
                        </VStack>

                        <IconButton
                            aria-label="Reply"
                            icon={<ChatIcon/>}
                            size="sm"
                            variant="ghost"
                            onClick={onOpen}
                        />
                    </HStack>
                </HStack>

                <Box
                    className="text-sm text-gray-800 whitespace-pre-line text-left"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text, {
                            ALLOWED_TAGS: ["a", "code", "i", "strong"],
                            ALLOWED_ATTR: ["href", "title"]
                        }) }}
                />

                <Button
                    onClick={toggleReplies}
                    size="sm"
                    variant="ghost"
                    leftIcon={showReplies ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                    alignSelf="flex-start"
                >
                    {showReplies ? "Hide replies" : "Show replies"}
                </Button>

                <Collapse in={showReplies} animateOpacity>
                    <VStack align="stretch" spacing={3} pt={2}>
                        {loadingReplies && <Spinner size="sm"/>}
                        {!loadingReplies && replies.length === 0 && (
                            <Text className="text-sm text-gray-500 pl-2">No replies yet</Text>
                        )}

                        {!loadingReplies &&
                            replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    id={reply.id} 
                                    username={reply.username} 
                                    email={reply.email} 
                                    text={reply.text}
                                    createdAt={reply.createdAt}
                                    level={level + 1}
                                    sortBy={sortBy}
                                    order={order}
                                    loadComments={loadComments}
                                    page={page}
                                />
                            ))}
                        
                        <CommentFormModal 
                            isOpen={isOpen}
                            onClose={onClose} 
                            parentId={id}
                            onSubmit={() => {loadComments(page)}}
                        />
                    </VStack>
                </Collapse>
            </VStack>
        </Box>
    );
};

export default CommentItem;
