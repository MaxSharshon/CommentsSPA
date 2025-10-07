import {HStack, Select} from "@chakra-ui/react";
import React from "react";

const SortPanel = ({sortBy, setSortBy, order, setOrder}) => {
    return (
        <HStack className="w=full max-w-3xl justify-between">
            <HStack className="gap-2">
                <Select value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        size="sm"
                        width="150px">
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="createdAt">Date</option>
                </Select>

                <Select value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        size="sm"
                        width="100px">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </Select>
            </HStack>
        </HStack>
    );
};

export default SortPanel;