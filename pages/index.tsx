import Head from "next/head";
import styled from "styled-components";
import Link from "next/link";
import Date from "../components/date";
import { headingMd, headingLg } from "../styles/font";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData, PostData } from "../lib/posts";
import { GetStaticProps } from "next";

type Props = {
  allPostsData: PostData[];
};

const Home = ({ allPostsData }: Props) => {
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
          {allPostsData.map(({ id, updatedAt, title }) => (
            <BlogListItem key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                {title}
              </Link>
              <br />
              <small>
                <Date dateString={updatedAt} />
              </small>
            </BlogListItem>
          ))}
        </BlogList>
      </HeadingBlog>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

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
