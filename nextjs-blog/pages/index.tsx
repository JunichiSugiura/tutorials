import Head from "next/head";
import { GetStaticProps } from "next";

export default function Home() {
  return (
    <div>
      <Head>
        <title>NextJS Blog</title>
        <link
          rel="icon"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/unicorn-face_1f984.png"
        />
      </Head>
      <main>Welcome</main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
