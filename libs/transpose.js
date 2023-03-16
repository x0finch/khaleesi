import axios from "axios";

const TRANSPOSE_API = "https://api.transpose.io";
const TRANSPOSE_API_KEY = process.env.NEXT_PUBLIC_TRANSPOSE_API_KEY;

function runSQL(sql, parameters) {
  return axios
    .post(
      `${TRANSPOSE_API}/sql`,
      {
        sql,
        parameters,
      },
      {
        headers: {
          "X-API-KEY": TRANSPOSE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data.results);
}

export async function getAddressAge(address) {
  const results = await runSQL(
    `
select timestamp from ethereum.transactions
where from_address = '{{address}}'
and nonce = 0 limit 1
`,
    { address }
  );

  if (!results || results.length <= 0) {
    return null;
  }

  const date = new Date(results[0].timestamp);
  return Number(((Date.now() - date.getTime()) / oneYear).toFixed(1));
}

const oneDay = 24 * 60 * 60 * 1000;
const oneYear = 365 * oneDay;

export async function getLastTxTime(address) {
  const results = await runSQL(
    `
select timestamp from ethereum.transactions
where from_address = '{{address}}'
order by timestamp desc limit 1
`,
    { address }
  );

  if (!results || results.length <= 0) {
    return null;
  }

  const date = new Date(results[0].timestamp);
  return Math.floor((Date.now() - date.getTime()) / oneDay);
}

export async function getBalance(address) {
  const results = await runSQL(
    `
select balance from ethereum.native_token_owners
where owner_address = '{{address}}' limit 1
`,
    { address }
  );
  if (!results || results.length <= 0) {
    return null;
  }

  const balance = Number(results[0].balance);
  return Number((balance / 1e18).toFixed(2));
}

export async function getTxCount(address) {
  const results = await runSQL(
    `
select nonce from ethereum.transactions
where from_address = '{{address}}'
order by timestamp desc limit 1
`,
    { address }
  );
  if (!results || results.length <= 0) {
    return null;
  }

  const nonce = Number(results[0].nonce);
  return nonce >= 0 ? nonce : 0;
}

export async function getTokensCount(address) {
  const results = await runSQL(
    `
select count(contract_address) from ethereum.token_owners
where owner_address = '{{address}}'
`,
    { address }
  );
  if (!results || results.length <= 0) {
    return null;
  }

  const count = Number(results[0].count);
  return count >= 0 ? count : 0;
}

export async function getNFTsCount(address) {
  const results = await runSQL(
    `
select count(contract_address) from ethereum.nft_owners
where owner_address = '{{address}}'
`,
    { address }
  );
  if (!results || results.length <= 0) {
    return null;
  }

  const count = Number(results[0].count);
  return count >= 0 ? count : 0;
}

export async function getMostUsedDEX(address) {
  const results = await runSQL(
    `
select exchange_name, count(distinct transaction_hash) from ethereum.dex_swaps
where origin_address = '{{address}}'
group by exchange_name
order by exchange_name desc limit 1
`,
    { address }
  );
  if (!results || results.length <= 0) {
    return null;
  }

  let name = results[0].exchange_name;
  if (!name) {
    return null;
  }

  name = `${name[0].toUpperCase()}${name.slice(1)}`;
  return `${name}之子`;
}

export async function getGasUsed(address) {
  const results = await runSQL(
    `
select sum(gas_price * gas_used) gas from ethereum.transactions
where from_address = '{{address}}'
`,
    { address }
  );

  if (!results || results.length <= 0) {
    return null;
  }

  const gas = Number(results[0].gas);
  return gas > 0 ? Number((gas / 1e18).toFixed(2)) : 0;
}
