import styled from "styled-components";

type Props = {
  name: string;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Tag: React.FC<Props> = (props) => {
  return <Container onClick={props.handleClick}>{props.name}</Container>;
};

export default Tag;

const Container = styled.div``;
