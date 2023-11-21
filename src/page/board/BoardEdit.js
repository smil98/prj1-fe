import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const [isEditing, setIsEditing] = useState(false);
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);

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
    console.log(removeFileIds);
    axios
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileIds,
        uploadFiles,
      })
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

  console.log(removeFileIds);
  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
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
      {board.files.length > 0 &&
        board.files.map((file) => (
          <Box key={file.id} my="5px" border="3px solid black">
            <FormControl display="flex" alignItems="center">
              <FormLabel>
                <FontAwesomeIcon color="red" icon={faTrashCan} />
              </FormLabel>
              <Switch
                value={file.id}
                colorScheme="red"
                onChange={handleRemoveFileSwitch}
              />
            </FormControl>
            <Box>
              <Image src={file.url} alt={file.name} width="100%" />
            </Box>
          </Box>
        ))}
      <FormControl>
        <FormLabel>Image</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          can upload 1MB per file maximum, total under 10MB
        </FormHelperText>
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
            <Button colorScheme="blue" onClick={handleSubmit}>
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
