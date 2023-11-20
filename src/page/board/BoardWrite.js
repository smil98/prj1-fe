import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toast = useToast();

  function handleSubmit() {
    setIsSubmitting(true);
    axios
      .postForm("/api/board/add", {
        title,
        content,
        files,
      })
      .then(() => {
        toast({
          description: "Post has been saved successfully.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "Please check the content",
            status: "error",
          });
        } else {
          toast({
            description: "An error occurred while saving",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <Heading>Write Post</Heading>
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
          <FormLabel>Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <FormHelperText>
            You can only upload files less than 1MB, 10MB total
          </FormHelperText>
        </FormControl>
        <Button
          isDisabled={isSubmitting}
          onClick={handleSubmit}
          colorScheme="blue"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
