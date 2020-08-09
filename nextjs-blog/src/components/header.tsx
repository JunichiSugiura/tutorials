import { IconButton } from "theme-ui";
import { IoMdSunny } from "react-icons/io";
import { useToggleColorMode } from "src/logic/styles";
import styled from "@emotion/styled";

export function Header() {
  const toggleColorMode = useToggleColorMode();

  return (
    <Container>
      <h1>NextJS Blog</h1>
      <IconButton aria-label="Toggle dark mode" onClick={toggleColorMode}>
        <IoMdSunny size={28} />
      </IconButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  padding: 0 1rem;
`;
