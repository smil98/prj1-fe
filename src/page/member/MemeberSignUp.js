import {
  Box,
  Button,
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

  let isQualified = true;
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

  return (
    <Box>
      <Heading>Sign Up</Heading>
      <FormControl>
        <FormLabel>id</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
