import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DeleteIcon } from "@chakra-ui/icons";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
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
    console.log(selectedImages);
    axios
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        uploadFiles,
        selectedImages
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

  const handleImageSelection = (imageName) => {
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(imageName)) {
        return prevSelectedImages.filter((name) => name !== imageName);
      } else {
        return [...prevSelectedImages, imageName];
      }
    });
  };

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
        {board.files.map((file) => (
          <Tooltip hasArrow label={file.name}>
            <Box my={5}>
              <Image src={file.url} border="3px solid black" alt={file.name} />
            </Box>
          </Tooltip>
        ))}
        <Flex gap={2}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<DeleteIcon ml={2} />}
              colorScheme="red"
            >
              Delete Image
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleImageSelection("*")}>All</MenuItem>
              {board.files.map((file) => (
                <MenuItem onClick={() => handleImageSelection(file.name)}>
                  {file.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>New Attachments</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
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
