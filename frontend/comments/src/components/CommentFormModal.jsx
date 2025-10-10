import {
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    HStack,
    Image,
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
import {useEffect, useState} from "react";
import TagPanel from "@/components/TagPanel.jsx";
import CaptchaField from "@/components/CaptchaField.jsx";

const CommentFormModal = ({isOpen, onClose, parentId = null, onSubmit}) => {
    const toast = useToast();

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
            const response = await fetch("/api/captcha/generate");
            const data = await response.json();
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

    const insertTag = (tag) => {
        let snippet = tag === "a" ? `<a href="" title=""></a>` : `<${tag}></${tag}>`;
        setForm((prev) => ({...prev, text: prev.text + snippet}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    homepage: form.homepage,
                    text: form.text,
                    captchaId: form.captchaId,
                    captchaCode: form.captchaCode,
                    parentId: parentId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                let description = "An error occurred";

                if (errorData.errors) {
                    description = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                        .join("\n");
                } else if (errorData.title) {
                    description = errorData.title;
                }

                toast({
                    title: "Server validation failed",
                    description,
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                });
                return;
            }

            toast({
                title: "Comment submitted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onSubmit?.();
            onClose();
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast({
                title: "Network error",
                description: "Could not submit comment. Please try again.",
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
                                    onInsertTag={insertTag}
                                    onTogglePreview={() => setShowPreview((p) => !p)}
                                    isPreview={showPreview}
                                />

                                <Textarea
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
