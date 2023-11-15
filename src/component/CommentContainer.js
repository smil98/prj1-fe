import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        Write
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDelete, isSubmitting }) {
  const { hasAccess, isAdmin } = useContext(LoginContext);
  const navigate = useNavigate();
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
        <Heading size="md">Comment List</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyConent="space-between" gap={2}>
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{formatDateTime(comment.inserted)}</Text>
                {(hasAccess(comment.memberId) || isAdmin()) && (
                  <>
                    <Button
                      size="xs"
                      variant="link"
                      onClick={() => navigate("/comment/edit" + comment.id)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      size="xs"
                      variant="link"
                      color="red"
                      isDisabled={isSubmitting}
                      onClick={() => onDelete(comment.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </>
                )}
              </Flex>
              <Text pt="2" sx={{ whiteSpace: "pre-wrap" }} fontSize="sm">
                {comment.comment}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete(id) {
    //TODO : modal, then, catch, finally
    setIsSubmitting(true);
    axios.delete("/api/comment/" + id).finally(() => setIsSubmitting(false));
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

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDelete={handleDelete}
      />
    </Box>
  );
}
