import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemeberSignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(true);

  let isQualified = true;

  if (idAvailable === false) {
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
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
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
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
