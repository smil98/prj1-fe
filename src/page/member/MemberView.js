import { useSearchParams } from "react-router-dom";
import { Heading } from "@chakra-ui/react";

export function MemberView() {
  const [params] = useSearchParams();

  return (
    <div>
      <Heading>{params.get("id")} Account Info</Heading>
    </div>
  );
}
