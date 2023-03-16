import * as zerion from "../../libs/zerion";

export default async function (req, res) {
  const address = req.body.address;
  const portfolio = await zerion.getPortfolioInternal(address);
  res.status(200).json({ portfolio });
}
