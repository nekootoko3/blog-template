import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { heading2Xl, headingLg } from "../styles/font";

type Props = {
  children: React.ReactNode;
};

const navivationItems: { label: string; page: string }[] = [
  { label: "Home", page: "/" },
  { label: "Blog", page: "/blog" },
  { label: "Contact", page: "/contact" },
];

const name = "nekootoko3";
export const siteTitle = "nekootoko3 のほのぼの日記";

const Layout: React.FC<Props> = ({ children }) => {
  const { pathname } = useRouter();

  return (
    <Container>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css"
        />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header>
        {navivationItems.map(({ label, page }) => (
          <Link href={page}>
            <NavigationItem selected={pathname === page}>
              {label}
            </NavigationItem>
          </Link>
        ))}
      </Header>
      <main>{children}</main>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavigationItem = styled.div<{ selected: boolean }>`
  margin: 0 0.5rem 1rem;
  font-size: 1.2rem;
  ${(props) =>
    props.selected
      ? css`
          font-weight: bold;
        `
      : css`
          font-weight: 300;
          cursor: pointer;
        `}
`;

const HeaderImage = styled.img`
  width: 6rem;
  height: 6rem;
`;
const HeaderHomeImage = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
`;

const NameLink = styled.a`
  color: inherit;
`;

const BackToHome = styled.a`
  margin: 3rem 0 0;
`;

const HomeHeading = styled.h1`
  ${heading2Xl}
`;

const Heading = styled.h2`
  ${headingLg}
`;
