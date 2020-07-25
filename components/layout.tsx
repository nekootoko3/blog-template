import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { headingLg } from "../styles/font";
import { GaTrackingId, GaEnabled } from "../lib/gtag";

type Props = {
  children: React.ReactNode;
};

const navivationItems: { label: string; page: string }[] = [
  { label: "Home", page: "/" },
  { label: "Blog", page: "/posts" },
  { label: "Contact", page: "/contact" },
];

const name = "nekootoko3";
export const siteTitle = "nekootoko3 のほのぼの日記";

const Layout: React.FC<Props> = ({ children }) => {
  const { pathname } = useRouter();

  return (
    <Container>
      <Head>
        {GaEnabled && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GaTrackingId}`}
          />
        )}
        {GaEnabled && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GaTrackingId}', {
                      page_path: window.location.pathname,
                    });
                  `,
            }}
          />
        )}
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
        <SiteTitle>{siteTitle}</SiteTitle>
        <AvatarImage src="/images/profile.png" />
        <NavigationList>
          {navivationItems.map(({ label, page }) => (
            <Link href={page}>
              <NavigationItem selected={pathname === page} key={page}>
                {label}
              </NavigationItem>
            </Link>
          ))}
        </NavigationList>
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
  flex-direction: column;
  align-items: center;
`;

const SiteTitle = styled.div`
  ${headingLg}
  font-size: 1.8rem;
  text-align: center;
`;

const AvatarImage = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
`;

const NavigationList = styled.div`
  margin-top: 1rem;
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
