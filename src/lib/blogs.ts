import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

type MatterResultData = {
  title: string;
  createdAt: string;
  updatedAt: string;
  canPublish: boolean;
};

export type BlogData = {
  slug: string;
  tags: string[];
} & MatterResultData;

export type BlogDataWithContent = {
  contentHtml: string;
} & BlogData;

type GetSortedBlogsData = () => BlogData[];

const blogsDirectory = path.join(process.cwd(), "blogs");

export const getSortedBlogsData: GetSortedBlogsData = () => {
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogsData = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");

      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const tags = matterResult.data.tags?.split(",")?.map((tag: string) => {
        return tag.trim();
      }) as string[];

      return {
        ...(matterResult.data as MatterResultData),
        slug,
        tags,
      };
    })
    .filter(({ canPublish }: BlogData) => {
      return canPublish;
    });
  // Sort blogs by updatedAt
  return allBlogsData.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getAllBlogSlugs = () => {
  const fileNames = fs.readdirSync(blogsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getBlogData = async (slug: string) => {
  const fullPath = path.join(blogsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { updatedAt: string; title: string }),
  };
};
