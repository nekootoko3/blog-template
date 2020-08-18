import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import styled from "styled-components";

import Date from "../../components/date";
import Tag from "../../components/tag";
import Layout from "../../components/layout";
import { headingMd } from "../../styles/font";
import { getSortedBlogsData, BlogData } from "../../lib/blogs";

type Props = {
  allBlogsData: BlogData[];
};

const Blog: React.FC<Props> = ({ allBlogsData }) => {
  const [selectedTags, setTags] = useState([] as string[]);
  const addTag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget.textContent) {
      return;
    }
    if (!selectedTags.includes(e.currentTarget.textContent)) {
      setTags(selectedTags.concat(e.currentTarget.textContent));
    }
  };

  const removeTag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget.textContent) {
      return;
    }
    setTags(
      selectedTags.filter((selectedTag) => {
        return selectedTag !== e.currentTarget.textContent;
      })
    );
  };

  const isShowableBlog = (tags: string[]) => {
    if (selectedTags.length === 0) {
      return true;
    }

    return (
      selectedTags.filter((selectedTag) => {
        return tags.includes(selectedTag);
      }).length !== 0
    );
  };

  return (
    <Layout>
      <Head>
        <title>Blog</title>
      </Head>
      <HeadingBlog>
        <SelectedTagsWrapper>
          <TagsHeader>Tags:</TagsHeader>
          <SelectedTags>
            {selectedTags.map((selectedTag) => (
              <Tag
                name={selectedTag}
                handleClick={removeTag}
                key={selectedTag}
              />
            ))}
          </SelectedTags>
        </SelectedTagsWrapper>
      </HeadingBlog>
      <BlogList>
        {allBlogsData.map(({ slug, updatedAt, title, tags }: BlogData) => {
          if (!isShowableBlog(tags)) {
            return;
          }

          return (
            <BlogListItem key={slug}>
              <Link href="/blogs/[slug]" as={`/blogs/${slug}`}>
                <BlogTitle>{title}</BlogTitle>
              </Link>
              <DateWrapper>
                <Date dateString={updatedAt} />
              </DateWrapper>
              <TagsWrapper>
                {" "}
                <BlogTags>
                  {tags.map((tag) => (
                    <Tag name={tag} key={tag} handleClick={addTag} />
                  ))}
                </BlogTags>
              </TagsWrapper>
            </BlogListItem>
          );
        })}
      </BlogList>
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

const SelectedTagsWrapper = styled.div`
  font-size: 0.8rem;
  display: flex;
`;

const TagsHeader = styled.div`
  margin-right: 0.2rem;
`;

const SelectedTags = styled.div`
  display: flex;
`;

const BlogTags = styled.div`
  display: flex;
`;

const BlogList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 1rem 0 0;
`;

const BlogListItem = styled.li`
  margin: 0 0 1.25rem;
`;

const BlogTitle = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DateWrapper = styled.div`
  font-size: 1rem;
`;

const TagsWrapper = styled.div`
  margin-top: 0.1rem;
`;
