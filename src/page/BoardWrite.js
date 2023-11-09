import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const toast = useToast();

  function handleSubmit() {
    axios
      .post("/api/board/add", {
        title,
        content,
        writer,
      })
      .then(() => {
        toast({
          description: "Post has been saved successfully.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "Oops! Something has gone wrong!",
          status: "error",
        });
      })
      .finally(() => console.log("finished"));
  }

  return (
    <Box>
      <h1>Write Post</h1>
      <Box>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Body</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>Writer</FormLabel>
          <Input
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
          ></Input>
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="blue">
          Save
        </Button>
      </Box>
    </Box>
  );
}
