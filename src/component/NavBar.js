import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPen,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const urlParams = new URLSearchParams();
  if (login !== "") {
    urlParams.set("id", login.id);
  }

  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

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
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} style={{ marginRight: "0.5em" }} />
        Home
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>
          <FontAwesomeIcon icon={faPen} style={{ marginRight: "0.5em" }} />
          Write
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/join")}>
          <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "0.5em" }} />
          Sign Up
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5em" }} />
          Member List
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5em" }} />
          Account Info
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon
            icon={faRightToBracket}
            style={{ marginRight: "0.5em" }}
          />
          Login
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            style={{ marginRight: "0.5em" }}
          />
          Log out
        </Button>
      )}
      {isAuthenticated() && <Box>Welcome, {login.nickName}</Box>}
    </Flex>
  );
}
