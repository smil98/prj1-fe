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

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => console.log("success"))
      .catch(() => console.log("failure"))
      .finally(() => console.log("finished"));
  }

  return (
    <Box>
      <Heading>Login</Heading>
      <FormControl>
        <FormLabel>ID</FormLabel>
        <Input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        Log in
      </Button>
    </Box>
  );
}
