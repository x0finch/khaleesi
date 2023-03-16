import axios from "axios";

const ZERION_API = "https://api.zerion.io";
const ZERION_API_KEY =
  "emtfZGV2X2U1ZTI5ZjJiMDI4YjRkNWNiNWU3MzFkOTIyZWYzODViOg==";

export async function getPortfolioInternal(address) {
  const data = await axios
    .get(`${ZERION_API}/v1/wallets/${address}/portfolio`, {
      headers: {
        authorization: `Basic ${ZERION_API_KEY}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => res.data);

  return data.data.attributes.total.positions;
}

export async function getPortfolio(address) {
  const data = await axios
    .post("/api/portfolio", { address })
    .then((res) => res.data);

  const portfolio = Number(data.portfolio);
  return portfolio > 0 ? portfolio : 0;
}
