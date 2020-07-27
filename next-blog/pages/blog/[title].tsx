import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

interface Props {
  source: string;
  data: PostData;
}

interface PostData {
  title: string;
  date: string;
  spoiler: string;
}

export default function Post({ source, data }: Props) {
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {hydrate(source, null, 2)}
    </>
  );
}

const blogDirPaths = path.join("pages", "blog");

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getPostAll().map((p) => ({
      params: {
        title: p.data.title,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { title } }) => {
  const { content, data } = getPostAll().find(
    (matter) => matter.data.title === title
  );
  const source = await renderToString(content, null, null, data);
  return {
    props: { source, data },
  };
};

function getPostAll() {
  return fs
    .readdirSync(blogDirPaths)
    .filter((dirName) => /\.md$/.test(dirName))
    .map((dirName) => fs.readFileSync(path.join(blogDirPaths, dirName)))
    .map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orig, ...post } = matter(f);
      return post;
    });
}
