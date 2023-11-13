import { useNavigate, useSearchParams } from "react-router-dom";
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
import React, { useEffect, useState } from "react";
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);
  const [params] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data))
      .catch(() => console.log("error"));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/member?" + params.toString())
      .then(() => {
        toast({
          description: "Account has been deleted",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "You have no rights to delete this account",
            status: "error",
          });
        } else {
          toast({
            description: "An error has occurred while deleting",
            status: "error",
          });
        }
      })
      .finally(() => onClose());

    // TODO : logout function should be added
  }

  return (
    <Box>
      <Heading>{params.get("id")} Account Info</Heading>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Nickname</FormLabel>
        <Input type="text" value={member.nickName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="text" value={member.email} readOnly />
      </FormControl>
      <FormControl>
        <Button
          colorScheme="purple"
          onClick={() => navigate("/member/edit?" + params.toString())}
        >
          Edit
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Account
        </Button>
      </FormControl>

      {/*  Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete your account?</ModalBody>
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
