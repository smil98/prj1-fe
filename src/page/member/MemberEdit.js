import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberEdit() {
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState();
  const [emailAvailable, setEmailAvailable] = useState(true);
  const toast = useToast();
  const id = params.get("id");

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => {
        setMember(response.data);
        setEmail(response.data.email);
      })
      .catch();
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  let sameOriginEmail = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

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

  return (
    <Box>
      <Heading textAlign="center">Edit {id}'s Account Info</Heading>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
      </FormControl>
      <FormControl>
        <FormLabel>Re-enter Password</FormLabel>
        <Input type="password" />
      </FormControl>
      {/*if email is changed check whether new=orig or not */}
      {/* */}
      <FormControl>
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
          <Button isDisabled={emailChecked} onClick={handelEmailCheck}>
            Check
          </Button>
        </Flex>
      </FormControl>
    </Box>
  );
}
