import { HStack, Button, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <HStack spacing={2} mt={4} justify="center">
            <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                size="sm"
            />

            {pageNumbers.map((num) => (
                <Button
                    key={num}
                    onClick={() => onPageChange(num)}
                    colorScheme={num === currentPage ? "blue" : "gray"}
                    variant={num === currentPage ? "solid" : "outline"}
                    size="sm"
                >
                    {num}
                </Button>
            ))}

            <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                isDisabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                size="sm"
            />
        </HStack>
    );
};

export default Pagination;
