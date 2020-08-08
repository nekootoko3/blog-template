import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";

import Date from "../../components/date";
import Layout from "../../components/layout";
import {
  getAllBlogSlugs,
  getBlogData,
  BlogDataWithContent,
} from "../../lib/blogs";
import React from "react";

type Props = {
  blogData: BlogDataWithContent;
};

const Blog: React.FC<Props> = ({ blogData }) => {
  return (
    <Layout>
      <Head>
        <title>{blogData.title}</title>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css"
        />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
      </Head>
      <article>
        <h1>{blogData.title}</h1>
        <>
          <Date dateString={blogData.updatedAt} />
        </>
        <div dangerouslySetInnerHTML={{ __html: blogData.contentHtml }} />
      </article>
    </Layout>
  );
};

export default Blog;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blogData = await getBlogData(params ? (params.slug as string) : "");
  return {
    props: {
      blogData,
    },
  };
};
