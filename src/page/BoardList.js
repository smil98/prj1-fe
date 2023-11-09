import { Box, Table, Thead, Tr, Th, Td, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
export function BoardList() {
  const [boardList, setBoardList] = useState(null);

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
        </Table>
        {boardList || <Spinner />}
        {boardList &&
          boardList.map((board) => (
            <Tr>
              <Td>{board.id}</Td>
              <Td>{board.title}</Td>
              <Td>{board.writer}</Td>
              <Td>{board.inserted}</Td>
            </Tr>
          ))}
      </Box>
    </Box>
  );
}
