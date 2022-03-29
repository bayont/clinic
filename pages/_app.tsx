import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Footer } from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="min">
        <div className="padding">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MyApp;
