import Head from "next/head";
import { useState, useMemo } from "react";
import styles from "./index.module.css";
import * as transpose from "../libs/transpose";
import * as zerion from "../libs/zerion";
import * as random from "../libs/random";
import * as openai from "../libs/openai";
import firework from "./firework";

const ETH_ADDRESS_PATTERN = /^(0x)[0-9a-f]{40}$/i;

export default function Home() {
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const isWrongInput = useMemo(
    () => address && !ETH_ADDRESS_PATTERN.test(address),
    [address]
  );

  async function onSubmit(event) {
    event.preventDefault();

    if (isWrongInput || loading) {
      return;
    } else if (count > 1) {
      alert(`请充值 ${count - 1} ETH!`);
      return;
    }

    setLoading(true);
    setTitle("");

    try {
      const data = await getData(address);
      // new Promise((res) => setTimeout(() => res(0), 3000));
      console.log("data: ", data);

      const result = await openai.generate(data); //Promise.resolve("a.b");

      console.log("result: ", result);

      let names = result.split(".");
      const randomIndex = Math.floor(Math.random() * names.length);

      data.mostUsedDex && names.splice(randomIndex, 0, data.mostUsedDex);
      names.splice(0, 0, data.prefix);

      setTitle(names.filter((name) => name).join("·"));
      firework(document.getElementById("canvas"), 6000);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
      setCount((prev) => prev + 1);
    }
  }

  const buttonName = isWrongInput
    ? "Wrong Address"
    : loading
    ? "Loading"
    : count > 1
    ? `${count - 1} ETH`
    : "Generate";

  return (
    <div>
      <Head>
        <title>title.me</title>
      </Head>

      <main className={styles.main}>
        <h3>
          <span style={{ color: "#10a37f", fontSize: "45px" }}>title</span>.me
        </h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="address"
            placeholder="Enter an address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="submit"
            error={isWrongInput ? "true" : ""}
            loading={loading ? "true" : ""}
            value={buttonName}
          />
        </form>
        {title ? <Certificate title={title} /> : null}
        <canvas id="canvas" className={styles.canvas}>
          Canvas is not supported in your browser.
        </canvas>
      </main>
    </div>
  );
}

function Certificate({ title }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-20%)",
          fontWeight: "bold",
          fontSize: "24px",
          maxWidth: "300px",
          whiteSpace: "normal",
        }}
      >
        {title}
      </div>
      <img
        alt=""
        src="/certificate.png"
        style={{ width: "1000px", objectFit: "contain" }}
      />
    </div>
  );
}

async function getData(address) {
  const [prefix, transposeResults, portfolio] = await Promise.all([
    random.title(),
    getDataFromTranspose(address),
    zerion.getPortfolio(address),
  ]);

  return {
    prefix,
    ...transposeResults,
    portfolio,
  };
}

async function getDataFromTranspose(address) {
  const [addressAge, balance, txCount] = await Promise.all([
    transpose.getAddressAge(address),
    transpose.getBalance(address),
    transpose.getTxCount(address),
  ]);

  await new Promise((res) => setTimeout(() => res(null), 1000));

  const [tokensCount, nftsCount, mostUsedDex] = await Promise.all([
    transpose.getTokensCount(address),
    transpose.getNFTsCount(address),
    transpose.getMostUsedDEX(address),
  ]);

  await new Promise((res) => setTimeout(() => res(null), 1000));

  const [gasUsed, lastTxTime] = await Promise.all([
    transpose.getGasUsed(address),
    transpose.getLastTxTime(address),
  ]);

  return {
    addressAge,
    balance,
    txCount,
    tokensCount,
    nftsCount,
    mostUsedDex,
    gasUsed,
    lastTxTime,
  };
}
