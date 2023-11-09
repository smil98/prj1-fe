import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Spinner,
  Tbody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  return (
    <Box>
      <h1>Read Boards</h1>
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
            {boardList === null ? (
              <Spinner />
            ) : (
              boardList.map((board) => (
                <Tr
                  _hover={{
                    cursor: "pointer",
                  }}
                  key={board.id}
                  onClick={() => navigate("/board/" + board.id)}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.inserted}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
