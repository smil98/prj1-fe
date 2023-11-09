import {Box} from "@chakra-ui/react";
import {Outlet} from "react-router-dom";

export function HomeLayout() {
  return (
    <Box>
      <Box>navbar</Box>
      <Outlet />
    </Box>
  );
}