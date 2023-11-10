import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: "Post has been deleted successfully",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "Error has occurred while deleting",
          status: error,
        });
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <Heading>View Post</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input value={board.content} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Writer</FormLabel>
        <Input value={board.writer} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Date</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>
      <Button colorScheme="purple" onClick={() => navigate("/edit/" + id)}>
        Edit
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        Delete
      </Button>

      {/*  Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this post?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleDelete} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
