import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect } from "react";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>Edit No. {id} Post</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input value={board.title} />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input value={board.content} />
      </FormControl>
      <FormControl>
        <FormLabel>Writer</FormLabel>
        <Input value={board.writer} />
      </FormControl>
    </Box>
  );
}
