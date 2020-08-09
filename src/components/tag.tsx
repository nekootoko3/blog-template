import styled from "styled-components";

type Props = {
  name: string;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Tag: React.FC<Props> = (props) => {
  return (
    <Container onClick={props.handleClick} name={props.name}>
      {props.name}
    </Container>
  );
};

export default Tag;

const handleColorType = (name: string) => {
  switch (name) {
    case "ruby":
      return "#CC342D";
    case "redis":
      return "#D82C20";
    case "rails":
      return "#cc0000";
    case "javascript":
      return "#F0DB4F";
    default:
      return "gray";
  }
};

const Container = styled.div<{ name: string }>`
  padding: 0 10px;
  background-color: ${({ name }) => handleColorType(name)};
  color: white;
  border-radius: 20px;

  &:nth-child(n + 2) {
    margin-left: 5px;
  }
`;
