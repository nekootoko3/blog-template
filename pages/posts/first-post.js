import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import styled from "styled-components";

export default function FirstPost() {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <Title>FirstPost</Title>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  );
}

const Title = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`;
