import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Flex,
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
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const toast = useToast();
  const navigate = useNavigate();

  const { hasAccess, isAdmin } = useContext(LoginContext);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateTimeString),
    );
  };

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
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <Heading>View Post</Heading>
      <Box m={3} borderWidth="1px" p={3}>
        <Stack spacing={0} direction={"row"}>
          <Text fontSize={"3xl"} as={"b"}>
            {board.title}
          </Text>
          <Text p={3} lineHeight={8}>
            {formatDateTime(board.inserted)}
          </Text>

          {(hasAccess(board.writer) || isAdmin()) && (
            <Box p={1}>
              <Button
                colorScheme="purple"
                variant={"ghost"}
                onClick={() => navigate("/edit/" + id)}
              >
                <EditIcon />
              </Button>
              <Button variant="ghost" colorScheme="red" onClick={onOpen}>
                <DeleteIcon />
              </Button>
            </Box>
          )}
        </Stack>
        <Text mt={-3}>
          <Badge>{board.nickName}</Badge>
        </Text>
        <Text mt={10}>{board.content}</Text>
      </Box>

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
      <Box m={3} p={3}>
        <CommentContainer boardId={id} />
      </Box>
    </Box>
  );
}
