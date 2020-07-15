import Head from "next/head";
import styled from "styled-components";
import { headingMd, headingLg } from "../styles/font";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <HeadingBio>
        <p>
          こんにちは、僕はいわゆる猫です。パソコンを使うことができるハイパーな猫です。
        </p>
        <p>最近の猫の毎日は平和です。</p>
      </HeadingBio>
      <HeadingBlog>
        <HeadingBlogTitle>Blog</HeadingBlogTitle>
        <BlogList>
          {allPostsData.map(({ id, date, title }) => (
            <BlogListItem>
              {title}
              <br />
              {id}
              <br />
              {date}
            </BlogListItem>
          ))}
        </BlogList>
      </HeadingBlog>
    </Layout>
  );
}

const HeadingBio = styled.section`
  ${headingMd}
`;

const HeadingBlog = styled.section`
  ${headingMd}
  padding-top: 1px;
`;

const HeadingBlogTitle = styled.div`
  ${headingLg}
`;

const BlogList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
`;

const BlogListItem = styled.li`
  margin: 0 0 1.25rem;
`;

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
