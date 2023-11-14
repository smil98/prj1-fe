import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  return (
    <Flex>
      <Button onClick={() => navigate("/")}>Home</Button>
      <Button onClick={() => navigate("/write")}>Write</Button>
      <Button onClick={() => navigate("/join")}>Sign Up</Button>
      <Button onClick={() => navigate("/member/list")}>Member List</Button>
      <Button onClick={() => navigate("/login")}>Log in</Button>
    </Flex>
  );
}
