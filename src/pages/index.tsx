import Head from "next/head";
import styled from "styled-components";
import { headingMd } from "../styles/font";
import Layout, { siteTitle } from "../components/layout";

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <HeadingBio>
        <p>
          こんにちは、僕はいわゆる猫です。パソコンを使うことができるハイパーな猫です。
        </p>
        <p>最近の猫の毎日は平和です。</p>
      </HeadingBio>
    </Layout>
  );
};

export default Home;

const HeadingBio = styled.section`
  ${headingMd}
`;
