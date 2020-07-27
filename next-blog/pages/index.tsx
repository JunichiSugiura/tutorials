import { Head } from "src/components";
import { GetStaticProps } from "next";

export default function Home() {
  return (
    <div>
      <Head />
      <main>Welcome</main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
