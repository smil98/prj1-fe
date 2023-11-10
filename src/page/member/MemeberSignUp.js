import {
  Box,
  Button,
  FormControl,
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
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>check password</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue">
        Sign up
      </Button>
    </Box>
  );
}
