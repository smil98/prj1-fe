import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);
  const [params] = useSearchParams();
  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data))
      .catch(() => console.log("error"));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>{params.get("id")} Account Info</Heading>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input type="text" value={member.email} readOnly />
      </FormControl>
      <FormControl>
        <Button colorScheme="purple">Edit</Button>
        <Button colorScheme="red">Delete</Button>
      </FormControl>
    </Box>
  );
}
