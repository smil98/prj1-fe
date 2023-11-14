import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchLogin } = useContext(LoginContext);

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
      })
      .finally(() => {
        fetchLogin();
      });
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
