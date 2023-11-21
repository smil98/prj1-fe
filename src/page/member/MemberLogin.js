import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "Login successful",
          status: "success",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "Incorrect id or password",
          status: "error",
        });
      });
  }

  return (
    <Box
      p={10}
      borderRadius={10}
      boxShadow="base"
      w={{ sm: "100%", lg: "30%" }}
      mt={10}
      ml={{ sm: "0%", lg: "35%" }}
    >
      <Heading textAlign="center" mb={5}>
        Login
      </Heading>
      <FormControl mb={3}>
        <FormLabel>ID</FormLabel>
        <Input
          type="text"
          value={id}
          placeholder="Enter your ID"
          onChange={(e) => setId(e.target.value)}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        Log in
      </Button>
    </Box>
  );
}
