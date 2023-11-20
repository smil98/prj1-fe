import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "./LoginProvider";
import { EditIcon, DeleteIcon, ChatIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box m={3}>
      <Heading size="md" mb={3}>
        Write Comment
      </Heading>
      <Flex gap={2}>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button h={"none"} isDisabled={isSubmitting} onClick={handleSubmit}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  onEdit,
  onSubmitEdit,
  onCancelEdit,
}) {
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

  return (
    <Card>
      <CardHeader>
        <Heading size="md">
          <ChatIcon /> Comments + {commentList.length}
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
          {commentList.map((comment) => (
            <Box key={comment.id}>
              {comment.isEditing ? (
                <Flex alignItems={"stretch"}>
                  <Textarea
                    value={comment.editedContent}
                    onChange={(e) => onEdit(comment.id, e.target.value)}
                  />
                  <Button
                    h={"none"}
                    colorScheme="blue"
                    onClick={() => onSubmitEdit(comment.id)}
                  >
                    Submit
                  </Button>
                  <Button h={"none"} onClick={() => onCancelEdit(comment.id)}>
                    Cancel
                  </Button>
                </Flex>
              ) : (
                <>
                  <Flex justifyConent="space-between" gap={2}>
                    <Heading size="xs">{comment.nickName}</Heading>
                    <Text fontSize="xs">
                      {formatDateTime(comment.inserted)}
                    </Text>
                    <Text fontSize="xs">{comment.ago}</Text>
                    {(hasAccess(comment.memberId) || isAdmin()) && (
                      <>
                        <Button
                          size="xs"
                          variant="link"
                          onClick={() => onEdit(comment.id, comment.comment)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="xs"
                          variant="link"
                          color="red"
                          isDisabled={isSubmitting}
                          onClick={() => onDeleteModalOpen(comment.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </>
                    )}
                  </Flex>
                  <Text pt="2" sx={{ whiteSpace: "pre-wrap" }} fontSize="sm">
                    {comment.comment}
                  </Text>
                </>
              )}
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const handleEdit = (commentId, editedContent) => {
    setCommentList((prevList) =>
      prevList.map((comment) =>
        comment.id === commentId
          ? { ...comment, isEditing: true, editedContent }
          : comment,
      ),
    );
  };

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 401) {
          toast({
            description: "Please login to leave comment",
            status: "error",
          });
          navigate("/login");
        } else {
          toast({
            description: "An error occurred while submitting. Please try again",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleDelete() {
    //TODO : modal, then, catch, finally
    setIsSubmitting(true);
    axios.delete("/api/comment/" + id).finally(() => {
      setIsSubmitting(false);
      onClose();
    });
  }

  function handleDeleteModalOpen(id) {
    setId(id);
    onOpen();
  }

  const handleSubmitEdit = (commentId) => {
    setIsSubmitting(true);
    const editedComment = commentList.find(
      (comment) => comment.id === commentId,
    );
    console.log(commentId);
    console.log(editedComment);
    axios
      .put(`/api/comment/edit/${commentId}`, {
        id: commentId,
        comment: editedComment.editedContent,
      })
      .then((response) => {
        setCommentList((prevList) =>
          prevList.map((comment) =>
            comment.id === commentId
              ? { ...comment, isEditing: false }
              : comment,
          ),
        );
        toast({
          description: "Comment has been edited successfully",
          status: "success",
        });
      })
      .catch((error) =>
        toast({
          description: "An error occurred while updating comment",
          status: "error",
        }),
      )
      .finally(() => setIsSubmitting(false));
  };

  const handleCancelEdit = (commentId) => {
    setCommentList((prevList) =>
      prevList.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: false } : comment,
      ),
    );
  };
  return (
    <Box>
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
        onEdit={handleEdit}
        onSubmitEdit={handleSubmitEdit}
        onCancelEdit={handleCancelEdit}
      />
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      {/*  Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this comment?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
