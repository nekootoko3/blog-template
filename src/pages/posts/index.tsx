import Link from "next/link";
import Head from "next/head";
import Date from "../../components/date";
import Layout from "../../components/layout";
import { headingMd, headingLg } from "../../styles/font";
import { getSortedPostsData, PostData } from "../../lib/posts";
import { GetStaticProps } from "next";
import styled from "styled-components";

type Props = {
  allPostsData: PostData[];
};

const Post: React.FC<Props> = ({ allPostsData }) => {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
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

export default Post;

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

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
