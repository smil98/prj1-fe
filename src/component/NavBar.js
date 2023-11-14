import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);

  function handleLogout() {
    // TODO : add possible stuff after logout
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "Logout Successful",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "Something has gone wrong while logging out",
          status: "error",
        });
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>Home</Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>Write</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/join")}>Sign Up</Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>Member List</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>Log in</Button>
      )}
      {isAuthenticated() && <Button onClick={handleLogout}>Log out</Button>}
    </Flex>
  );
}
