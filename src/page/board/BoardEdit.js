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
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

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
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: "Post has been updated successfully",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description:
              "Request Error has occurred. Make sure all the content has been filled.",
            status: "error",
          });
        } else {
          toast({
            description: "An error has occurred while updating",
            status: "error",
          });
        }
      })
      .finally(() => console.log("successful"));
  }

  return (
    <Box>
      <Heading>Edit No. {id} Post</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input
          value={board.title}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.title = e.target.value;
            });
            setIsEditing(true);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input
          value={board.content}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.content = e.target.value;
            });
            setIsEditing(true);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Writer</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
            setIsEditing(true);
          }}
        />
      </FormControl>
      <Button isDisabled={!isEditing} onClick={onOpen2} colorScheme="blue">
        Save
      </Button>
      {/* navigate(-1) : previous route*/}
      <Button onClick={onOpen}>Cancel</Button>

      {/* Save Edit Modal */}
      <Modal isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Do you want to save this post?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose2}>Continue Editing</Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*  Cancel Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quit Editing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to quit editing?</ModalBody>
          <ModalFooter>
            <Button onClick={() => navigate(-2)}>Quit</Button>
            <Button onClick={onClose} colorScheme="blue">
              Keep Editing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
