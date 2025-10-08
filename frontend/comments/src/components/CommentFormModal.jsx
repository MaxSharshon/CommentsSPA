import {
    Button,
    FormControl,
    FormLabel,
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
import { useEffect, useState } from "react";

const allowedTags = ["i", "strong", "code", "a"];

const CommentFormModal = ({ isOpen, onClose, parentId = null, onSubmit }) => {
    const toast = useToast();

    const [form, setForm] = useState({
        username: "",
        email: "",
        homepage: "",
        text: "",
        captchaId: "",
        captchaCode: ""
    });
    const [captchaImage, setCaptchaImage] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    
    useEffect(() => {
        if (isOpen) fetchCaptcha();
    }, [isOpen]);

    const fetchCaptcha = async () => {
        try {
            const response = await fetch("/api/captcha/generate");
            const data = await response.json();
            setForm((f) => ({ ...f, captchaId: data.captchaId }));
            setCaptchaImage(data.captchaImage);
        } catch (error) {
            console.error("Error fetching captcha:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const insertTag = (tag) => {
        let snippet = "";
        if (tag === "a") {
            snippet = `<a href="" title=""></a>`;
        } else {
            snippet = `<${tag}></${tag}>`;
        }
        setForm((prev) => ({...prev, text: prev.text + snippet}));
    }
    
    const validateTags = (text) => {
        const tagRegex = /<\/?([a-z]+)(\s+[^>]*)?>/gi;
        let match;
        while ((match = tagRegex.exec(text)) !== null) {
            const tag = match[1].toLowerCase();
            if (!allowedTags.includes(tag)) return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateTags(form.text)) {
            toast({
                title: "Invalid HTML tags",
                description: "Only i, strong, code, and a tags are allowed.",
                status: "error",
                duration: 4000
            });
            return;
        }
        
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                toast({
                    title: "Error",
                    description: errorData.title || "Validation or CAPTCHA error",
                    status: "error",
                    duration: 4000
                });
                return;
            }

            toast({
                title: "Comment submitted",
                status: "success",
                duration: 3000
            });
            onSubmit?.();
            onClose();
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast({
                title: "Error submitting comment",
                status: "error",
                duration: 3000
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {parentId ? "Reply to comment" : "New comment"}
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input name="username" value={form.username} onChange={handleChange} />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input name="email" value={form.email} onChange={handleChange} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Homepage</FormLabel>
                                <Input name="homepage" value={form.homepage} onChange={handleChange} />
                            </FormControl>

                            <HStack spacing={2}>
                                {["i", "strong", "code", "a"].map((tag) => (
                                    <Button key={tag} size="xs" variant="outline" onClick={() => insertTag(tag)}>
                                        {tag}
                                    </Button>
                                ))}
                                <Button size="xs" onClick={() => setShowPreview((p) => !p)}>
                                    {showPreview ? "Hide" : "Preview"}
                                </Button>
                            </HStack>
                            
                            <FormControl isRequired>
                                <FormLabel>Text</FormLabel>
                                <Textarea name="text" value={form.text} onChange={handleChange} />
                            </FormControl>

                            {showPreview && (
                                <Box className="p-4 w-full border-2 border-gray-200 bg-gray-50 rounded-md"
                                     dangerouslySetInnerHTML={{ __html: form.text }}
                                />
                            )}

                            {/* CAPTCHA */}
                            <FormControl isRequired>
                                <FormLabel>CAPTCHA</FormLabel>
                                <HStack>
                                    {captchaImage && (
                                        <Image src={captchaImage} alt="Captcha" height="50" />
                                    )}
                                    <Button size="sm" onClick={fetchCaptcha}>
                                        Refresh
                                    </Button>
                                </HStack>
                                <Input
                                    name="captchaCode"
                                    value={form.captchaCode}
                                    onChange={handleChange}
                                    mt={2}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="purple" type="submit">
                            Submit
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CommentFormModal;
