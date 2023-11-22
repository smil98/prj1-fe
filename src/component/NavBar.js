import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
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

  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

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
    <Flex mb={5}>
      <Button
        variant="ghost"
        _hover={{ bg: "none" }}
        onClick={() => navigate("/")}
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
      >
        Home
      </Button>
      {isAuthenticated() && (
        <Button
          variant="ghost"
          _hover={{ bg: "none" }}
          onClick={() => navigate("/write")}
          leftIcon={<FontAwesomeIcon icon={faPen} />}
        >
          Write
        </Button>
      )}
      <Spacer />
      {isAuthenticated() || (
        <Button
          variant="ghost"
          _hover={{ bg: "none" }}
          onClick={() => navigate("/join")}
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
        >
          Sign Up
        </Button>
      )}
      {isAuthenticated() && (
        <>
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              _hover={{ bg: "none" }}
              icon={<Avatar sx={{ width: 6, height: 6 }} />}
            />
            <MenuList>
              <MenuGroup title="Account Settings">
                <MenuItem
                  icon={<FontAwesomeIcon icon={faUser} />}
                  onClick={() => navigate("/member?" + urlParams.toString())}
                >
                  Account Info
                </MenuItem>
              </MenuGroup>
              {isAdmin() && (
                <MenuGroup title="Admin">
                  <MenuItem
                    onClick={() => navigate("/member/list")}
                    icon={<FontAwesomeIcon icon={faUsers} />}
                  >
                    Member List
                  </MenuItem>
                </MenuGroup>
              )}
            </MenuList>
          </Menu>
          <Text fontWeight="semibold" lineHeight={"2.5rem"}>
            Welcome, {login.nickName}
          </Text>
        </>
      )}
      {isAuthenticated() || (
        <Button
          variant="ghost"
          _hover={{ bg: "none" }}
          onClick={() => navigate("/login")}
          leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
        >
          Login
        </Button>
      )}
      {isAuthenticated() && (
        <Button
          variant="ghost"
          _hover={{ bg: "none" }}
          onClick={handleLogout}
          leftIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
        >
          Log out
        </Button>
      )}
    </Flex>
  );
}
