import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function MemberEdit() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState();
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const id = params.get("id");

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => {
        setMember(response.data);
        setEmail(response.data.email);
        setNickName(response.data.nickName);
      })
      .catch();
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  let sameOriginNic = false;
  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
    sameOriginNic = member.nickName === nickName;
  }

  let nickChecked = sameOriginNic || nickNameAvailable;

  //check if its same as original || if there are any duplicates
  let emailChecked = sameOriginEmail || emailAvailable;

  function handelEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then((res) => {
        setEmailAvailable(false);
        if (res.status === 204) {
          toast({
            description: "Please fill in the Email",
            status: "error",
          });
        } else {
          toast({
            description: "Email already exists",
            status: "warning",
          });
        }
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "Email Available",
            status: "success",
          });
        }
      });
  }

  function handleSubmit() {
    axios
      .put("/api/member/edit", {
        id: member.id,
        password,
        email,
        nickName,
      })
      .then(() => navigate("/"))
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "You have no rights to edit account info",
            status: "error",
          });
        } else {
          toast({
            description: "An Error has occurred while updating info",
            status: "error",
          });
        }
      });
  }

  function handleNickCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/checknic?" + params)
      .then((res) => {
        setNickNameAvailable(false);
        if (res.status === 204) {
          toast({
            description: "Please fill in the Nickname",
            status: "error",
          });
        } else {
          toast({
            description: "Nickname already exists",
            status: "warning",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "Nickname available",
            status: "success",
          });
        }
      });
  }

  return (
    <Center>
      <Card w="lg">
        <CardHeader>
          <Heading textAlign="center">Edit {id}'s Account Info</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormHelperText>
              If left blank, the password won't change
            </FormHelperText>
          </FormControl>
          {password.length > 0 && (
            <FormControl mb={2}>
              <FormLabel>Re-enter Password</FormLabel>
              <Input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl mb={2}>
            <FormLabel>Nickname</FormLabel>
            <Flex>
              <Input
                type="text"
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                  setNickNameAvailable(false);
                }}
              />
              <Button isDisabled={nickChecked} onClick={handleNickCheck}>
                Check
              </Button>
            </Flex>
          </FormControl>
          {/*if email is changed check whether new=orig or not */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Flex>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailAvailable(false);
                }}
              />
              <Button isDisabled={emailChecked} onClick={handelEmailCheck}>
                Check
              </Button>
            </Flex>
          </FormControl>
        </CardBody>
        <CardFooter justifyContent="center" gap={1}>
          <Button
            isDisabled={
              emailChecked === false ||
              passwordChecked === false ||
              nickChecked === false
            }
            colorScheme="blue"
            onClick={onOpen}
          >
            Edit
          </Button>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Account Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to update this account?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
