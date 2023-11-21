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
  Flex,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faHeart,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

import * as PropTypes from "prop-types";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

function Pagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mt={5}>
      <Flex justifyContent="center">
        {pageInfo.prevPageNumber && (
          <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </PageButton>
        )}

        {pageNumbers.map((pageNumber) => (
          <PageButton
            key={pageNumber}
            variant={
              pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
            }
            pageNumber={pageNumber}
          >
            {pageNumber}
          </PageButton>
        ))}

        {pageInfo.nextPageNumber && (
          <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
            <FontAwesomeIcon icon={faAngleRight} />
          </PageButton>
        )}
      </Flex>
    </Box>
  );
}

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    // /?k=keyword
    const params = new URLSearchParams();
    params.set("k", keyword);

    navigate("/?" + params);
  }

  return (
    <Flex>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>Search</Button>
    </Flex>
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
                  {board.countFile > 0 && (
                    <Badge ml={1} mb={0.5} colorScheme="orange">
                      <FontAwesomeIcon icon={faImages} />
                      {board.countFile}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>
                  {formatDateTime(board.inserted)}, {board.ago}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <SearchComponent />
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
