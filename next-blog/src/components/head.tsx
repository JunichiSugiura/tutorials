import NextHead from "next/head";

interface Props {
  title?: string;
}

export function Head({ title = "NextJS Blog" }: Props) {
  return (
    <NextHead>
      <title>{title}</title>
      <link
        rel="icon"
        href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/unicorn-face_1f984.png"
      />
    </NextHead>
  );
}
