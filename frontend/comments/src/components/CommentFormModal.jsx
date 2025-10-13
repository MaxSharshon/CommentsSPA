import {
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useToast,
    VStack,
    Box
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import TagPanel from "@/components/TagPanel.jsx";
import CaptchaField from "@/components/CaptchaField.jsx";
import {insertTagAtCursor} from "@/utils/insertTagAtCursor.js";
import {submitComment} from "@/services/comments.js";
import {generateCaptcha} from "@/services/captcha.js";
import {validateCommentForm} from "@/utils/validation.js"

const CommentFormModal = ({isOpen, onClose, parentId = null, onSubmit}) => {
    const toast = useToast();
    const textareaRef = useRef(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        homepage: "",
        text: "",
        captchaId: "",
        captchaCode: ""
    });

    const [errors, setErrors] = useState({});
    const [captchaImage, setCaptchaImage] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            fetchCaptcha();
        }
    }, [isOpen]);

    const fetchCaptcha = async () => {
        try {
            const data = await generateCaptcha();
            setForm((f) => ({...f, captchaId: data.captchaId}));
            setCaptchaImage(data.captchaImage);
        } catch (error) {
            console.error("Error fetching captcha:", error);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
        setErrors((prev) => ({...prev, [name]: undefined}));
    };

    const handleInsertTag = (tag) => {
        if (textareaRef.current) {
            const newText = insertTagAtCursor(textareaRef.current, tag);
            setForm(prev => ({...prev, text: newText}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCommentForm(form)) return;

        try {
            await submitComment({
                username: form.username,
                email: form.email,
                homepage: form.homepage,
                text: form.text,
                captchaId: form.captchaId,
                captchaCode: form.captchaCode,
                parentId: parentId
            });

            toast({
                title: "Comment submitted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onSubmit?.();
            onClose();
        } catch (errorData) {
            console.error("Error submitting comment:", errorData);

            let description = "An error occurred";
            if (errorData.errors) {
                description = Object.entries(errorData.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n");
            } else if (errorData.title) {
                description = errorData.title;
            }
            
            toast({
                title: "Network error",
                description: description,
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader fontSize="xl">
                    {parentId ? "Reply to comment" : "New comment"}
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired isInvalid={!!errors.username}>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    name="username"
                                    value={form.username}
                                    placeholder="Enter your username"
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.username}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    value={form.email}
                                    placeholder="example@mail.com"
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Homepage</FormLabel>
                                <Input
                                    name="homepage"
                                    value={form.homepage}
                                    placeholder="https://example.com"
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.text}>
                                <FormLabel>Text</FormLabel>

                                <TagPanel
                                    onInsertTag={handleInsertTag}
                                    onTogglePreview={() => setShowPreview((p) => !p)}
                                    isPreview={showPreview}
                                />

                                <Textarea
                                    ref={textareaRef}
                                    name="text"
                                    value={form.text}
                                    onChange={handleChange}
                                    placeholder="Enter your comment here..."
                                />
                                <FormErrorMessage>{errors.text}</FormErrorMessage>
                            </FormControl>

                            {showPreview && (
                                <Box
                                    className="p-4 w-full border-2 border-gray-200 bg-gray-50 rounded-md"
                                    dangerouslySetInnerHTML={{__html: form.text}}
                                />
                            )}

                            <CaptchaField
                                captchaImage={captchaImage}
                                onRefresh={fetchCaptcha}
                                value={form.captchaCode}
                                onChange={handleChange}
                                error={errors.captchaCode}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>Cancel</Button>
                        <Button colorScheme="purple" type="submit">Submit</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CommentFormModal;
