import {Button, HStack} from "@chakra-ui/react";

const TagPanel = ({onInsertTag, onTogglePreview, isPreview}) => {
    return (
        <HStack spacing={2} mb={2}>
            {["i", "strong", "code", "a"].map((tag) => (
                <Button
                    key={tag}
                    size="xs"
                    variant="outline"
                    onClick={() => onInsertTag(tag)}
                >
                    {tag}
                </Button>
            ))}
            <Button
                size="xs"
                variant="solid"
                className="justify-right"
                onClick={() => onTogglePreview((p) => !p)}
            >
                {isPreview ? "Hide" : "Preview"}
            </Button>
        </HStack>
    )
}

export default TagPanel