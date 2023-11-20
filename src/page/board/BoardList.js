import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Spinner,
  Tbody,
  Heading,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

function Pagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
      )}

      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          onClick={() => navigate("/?p=" + pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      {pageInfo.nextPageNumber && (
        <Button
          variant="ghost"
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      )}
    </Box>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateTimeString),
    );
  };

  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading>Read Boards</Heading>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>Title</Th>
              <Th>by</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.countLike != 0 && board.countLike}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge ml={1} mb={0.5} colorScheme="blue">
                      {board.countComment}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>
                  {formatDateTime(board.inserted)}
                  {board.ago}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
