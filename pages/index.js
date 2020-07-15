import Head from "next/head";
import styled from "styled-components";
import { headingMd } from "../styles/font";
import Layout, { siteTitle } from "../components/layout";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Heading>
        <p>
          こんにちは、僕はいわゆる猫です。パソコンを使うことができるハイパーな猫です。
        </p>
        <p>最近の猫の毎日は平和です。</p>
      </Heading>
    </Layout>
  );
}

const Heading = styled.div`
  ${headingMd}
`;
