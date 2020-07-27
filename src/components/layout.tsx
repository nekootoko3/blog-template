import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { headingLg } from "../styles/font";

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
      <Header>
        <SiteTitle>{siteTitle}</SiteTitle>
        <AvatarImage src="/images/profile.png" />
        <NavigationList>
          {navivationItems.map(({ label, page }) => (
            <Link href={page} key={page}>
              <NavigationItem selected={pathname === page}>
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
