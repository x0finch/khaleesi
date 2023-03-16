import Head from "next/head";
import { useState, useMemo } from "react";
import styles from "./index.module.css";
import axios from "axios";
import * as transpose from "../libs/transpose";
import * as zerion from "../libs/zerion";
import * as random from "../libs/random";
import * as openai from "../libs/openai";

const ETH_ADDRESS_PATTERN = /^(0x)[0-9a-f]{40}$/i;

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState();
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
    setResult("");

    try {
      const data = await getData(address);
      console.log("data: ", data);

      const result = await openai.generate(data);
      console.log("result: ", result);

      let names = result.split(".");
      const randomIndex = Math.floor(Math.random() * names.length);

      data.mostUsedDex && names.splice(randomIndex, 0, data.mostUsedDex);
      names.splice(0, 0, data.prefix);

      setResult(names.filter((name) => name).join("·"));
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
        <div className={styles.result}>{result}</div>
      </main>
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
