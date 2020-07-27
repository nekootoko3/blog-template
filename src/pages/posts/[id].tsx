import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";

import Date from "../../components/date";
import Layout from "../../components/layout";
import {
  getAllPostIds,
  getPostData,
  PostDataWithContent,
} from "../../lib/posts";
import React from "react";

type Props = {
  postData: PostDataWithContent;
};

const Post: React.FC<Props> = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1>{postData.title}</h1>
        <>
          <Date dateString={postData.updatedAt} />
        </>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params ? (params.id as string) : "");
  return {
    props: {
      postData,
    },
  };
};
