import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>next-zoup prototype</title>
        <meta name="description" content="A prototypical zoup implementation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://github.com/runjak/next-zoup">next-zoup!</a>
        </h1>

        <p className={styles.description}>
          This is a prototypical implementation of the{" "}
          <a href="https://github.com/zoupio/spec/blob/main/spec.md">
            zoup spec
          </a>
          .
        </p>

        <p>
          Some experiments are happening at <Link href="/yetzt-proxy">/yetzt-proxy</Link>.
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
