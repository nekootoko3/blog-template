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
          こんにちは、nekootoko3 です。
        </p>
        <p>
          ソフトウェアエンジニアをやっています。
        </p>
        <p>
          趣味は旅行とバスケです。
        </p>
      </HeadingBio>
    </Layout>
  );
};

export default Home;

const HeadingBio = styled.section`
  ${headingMd}
`;
