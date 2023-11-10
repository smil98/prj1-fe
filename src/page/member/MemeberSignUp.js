import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemeberSignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  const toast = useToast();

  let isQualified = true;

  if (idAvailable === false) {
    isQualified = false;
  }

  if (emailAvailable === false) {
    isQualified = false;
  }

  if (password.length === 0) {
    isQualified = false;
  }

  if (password != passwordCheck) {
    isQualified = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/join", {
        id,
        password,
        email,
      })
      .then(() => console.log("success"))
      .catch(() => console.log("error"))
      .finally(() => console.log("finished"));
  }

  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "ID already exists",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "ID available",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() =>
        toast({
          description: "Email already exists",
          status: "warning",
        }),
      )
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "Email Available",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <Heading>Sign Up</Heading>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>Check</Button>
        </Flex>
        <FormErrorMessage>Please Check whether ID exists</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <FormErrorMessage>Please Enter Password</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>check password</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>Password does not match</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={emailAvailable === false}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button onClick={handleEmailCheck}>Check</Button>
          <FormErrorMessage>
            Please Check whether email is available
          </FormErrorMessage>
        </Flex>
      </FormControl>
      <Button
        isDisabled={!isQualified}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        Sign up
      </Button>
    </Box>
  );
}
