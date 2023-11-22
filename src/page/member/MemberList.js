import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const [list, setList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/list").then((response) => setList(response.data));
  }, []);

  if (list === null) {
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    const params = new URLSearchParams();
    params.set("id", id);
    navigate("/member?" + params.toString());
  }

  return (
    <Box>
      <Heading>Member List</Heading>
      <Table mt={8}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Password</Th>
            <Th>Nickname</Th>
            <Th>Email</Th>
            <Th>Registration Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            <Tr
              _hover={{ cursor: "pointer" }}
              onClick={() => handleTableRowClick(member.id)}
              key={member.id}
            >
              <Td>{member.id}</Td>
              <Td>{member.password}</Td>
              <Td>{member.nickName}</Td>
              <Td>{member.email}</Td>
              <Td>{member.inserted}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
