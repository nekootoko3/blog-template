import styled from "styled-components";

type Props = {
  name: string;
};

const Tag: React.FC<Props> = (props) => {
  return <Container>{props.name}</Container>;
};

export default Tag;

const Container = styled.div``;
