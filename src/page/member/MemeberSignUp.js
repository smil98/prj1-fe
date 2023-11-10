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
import { useNavigate } from "react-router-dom";

export function MemeberSignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

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
      .then(() => {
        toast({
          description: "Sign up successful",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "Please check if all information has been filled",
            status: "error",
          });
        } else {
          toast({
            description: "Error has occurred while signing up",
            status: "error",
          });
        }
      })
      .finally(() => console.log("finished"));
  }

  function handleIdCheck() {
    const searchParam = new URLSearchParams();
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then((res) => {
        setIdAvailable(false);
        if (res.status === 204) {
          toast({
            description: "Please fill in the ID",
            status: "error",
          });
        } else {
          toast({
            description: "ID already exists",
            status: "warning",
          });
        }
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
      <FormControl isInvalid={!emailAvailable}>
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
        </Flex>
        <FormErrorMessage>
          Please Check whether email is available
        </FormErrorMessage>
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
