import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Heading, Spinner } from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>View Post</Heading>
      <p>No: {board.id}</p>
      <p>Title : {board.title}</p>
      <p>Writer : {board.writer}</p>
      <p>Date : {board.inserted}</p>
      <p>Content : {board.content}</p>
    </Box>
  );
}
