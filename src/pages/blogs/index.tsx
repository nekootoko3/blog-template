import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import styled from "styled-components";

import Date from "../../components/date";
import Tag from "../../components/tag";
import Layout from "../../components/layout";
import { headingMd, headingLg } from "../../styles/font";
import { getSortedBlogsData, BlogData } from "../../lib/blogs";

type Props = {
  allBlogsData: BlogData[];
};

const Blog: React.FC<Props> = ({ allBlogsData }) => {
  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <HeadingBlog>
        <HeadingBlogTitle>Blog</HeadingBlogTitle>
        <BlogList>
          {allBlogsData.map(({ slug, updatedAt, title, tags }: BlogData) => (
            <BlogListItem key={slug}>
              <Link href="/blogs/[slug]" as={`/blogs/${slug}`}>
                <BlogTitle>{title}</BlogTitle>
              </Link>
              <small>
                <Date dateString={updatedAt} />
                {tags.map((tag) => (
                  <Tag name={tag} key={tag} />
                ))}
              </small>
            </BlogListItem>
          ))}
        </BlogList>
      </HeadingBlog>
    </Layout>
  );
};

export default Blog;

export const getStaticProps: GetStaticProps = async () => {
  const allBlogsData = getSortedBlogsData();
  return {
    props: {
      allBlogsData,
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

const BlogTitle = styled.div`
  cursor: pointer;
`;
