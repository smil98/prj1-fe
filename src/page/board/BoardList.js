import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Spinner,
  Tbody,
  Heading,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateTimeString),
    );
  };

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>Read Boards</Heading>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>by</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge ml={1} mb={0.5} colorScheme="blue">
                      {board.countComment}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>{formatDateTime(board.inserted)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
