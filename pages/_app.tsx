import { useEffect } from "react";
import Router from "next/router";
import { AppProps } from "next/app";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import * as gtag from "../lib/gtag";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
      Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    line-height: 1.6;
    font-size: 18px;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    display: block;
  }
`;

const handleGa = () => {
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
};

const BlogTemplate: React.FC<AppProps> = ({ Component, pageProps }) => {
  if (process.env.NODE_ENV === "production") {
    handleGa();
  }

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default BlogTemplate;
