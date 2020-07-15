import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { heading2Xl, headingLg } from "../styles/font";

const name = "nekootoko3";
export const siteTitle = "nekootoko3 のほのぼの日記";

function Layout({ children, home }) {
  return (
    <Container>
      <Head>
        <link rel="icon" href="/favicon.ico" />
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
        {home ? (
          <>
            <HeaderHomeImage src="/images/profile.png" alt="name" />
            <HomeHeading>{name}</HomeHeading>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <HeaderImage src="/images/profile.png" alt={name} />
              </a>
            </Link>
            <Heading>
              <Link href="/">
                <BackToHome>{name}</BackToHome>
              </Link>
            </Heading>
          </>
        )}
      </Header>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </Container>
  );
}

export default Layout;

const Container = styled.div`
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const BackToHome = styled.a`
  margin: 3rem 0 0;
`;

const HomeHeading = styled.h1`
  ${heading2Xl}
`;

const Heading = styled.h2`
  ${headingLg}
`;
