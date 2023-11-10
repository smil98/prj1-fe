import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect } from "react";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board == null) {
    return <Spinner />;
  }

  function handleSubmit() {
    axios
      .put("/api/board/edit/", board)
      .then(() => {
        toast({
          description: "Post has been updated successfully",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "An error has occurred while updating",
          status: "error",
        });
      })
      .finally();
  }

  return (
    <Box>
      <Heading>Edit No. {id} Post</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Writer</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue">
        Save
      </Button>
      {/* navigate(-1) : previous route*/}
      <Button onClick={() => navigate(-1)}>Cancel</Button>
    </Box>
  );
}
