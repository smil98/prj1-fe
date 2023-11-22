import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../component/NavBar";

export function HomeLayout() {
  return (
    <Box mx={{ base: 0, md: 10, lg: 30 }}>
      <NavBar />
      <Outlet />
    </Box>
  );
}
