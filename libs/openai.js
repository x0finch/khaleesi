import axios from "axios";

const OPENAI_API = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function generate(data) {
  const completion = await axios
    .post(
      OPENAI_API,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: generatePrompt(data) }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    )
    .then((res) => res.data);

  return completion.choices[0].message.content;
}

function generatePrompt(data) {
  const {
    addressAge,
    balance,
    txCount,
    tokensCount,
    nftsCount,
    gasUsed,
    lastTxTime,
    portfolio,
  } = data;

  return `以下是以太坊钱包地址称号获取的逻辑：
  AddressAge 是指一个钱包地址的使用时间，时间越大代表越资深。若 AddressAge 少于 3 年参考称号风暴中的前行者，链上拓荒的探索者，若 AddressAge 多于 3 年，则参考光辉见证者，脉络掌握者，驾驭波动的智者，牛熊穿梭者。
  LastTxTime 是指钱包地址最后一笔交易距离现在的时间，时间间隔越短，代表地址越活跃。若 LastTxTime 小于 100 天，则参考称号热血火拼者，伺机而动的猎手。若 LastTxTime 大于 100 天，则参考称号稳健的长期持币者，不动产主，沉睡的守护者。
  Balance 是指钱包里有多少 ETH 余额，ETH 余额越大, 代表对以太坊忠诚度越高，若 Balance 小于 1 个则参考称号以太坊观望者，以太币少量投资者，若 Balance 大于 1 个则参考称号以太坊王国呼唤者，以太坊王国的追随者，以太坊王国的传教士。
  Portfolio 是指钱包的财富值，财富值越大代表越富有。若 Portfolio 小于 1000 美金则参考称号赤手空拳的勇士，未来财富之光，黑暗丛林的猎人，若 Portfolio 大于 1000 美金则参考称号数字财富之主，链上资本家，富可敌国的领主。
  TxCount 是指钱包地址的转账次数，次数越多代表操作越频繁。若 TxCount 小于 100 个则参考称号未经打磨的宝石，区块链荒原的流浪者，微光闪耀的新星。若 TxCount 大于 100 个则参考称号探索之路的勇士，疯狂的链上搬运工，万物皆可交易的主宰。
  TokensCount 是指钱包地址中持有币种的种类数量，持有的越多，代表投资的种类越多，若 TokensCount 少于 20 种则参考称号少数派的守护者，睿智无比的自律之神。若 TokensCount 大于 20 种则参考称号币种元素掌握者，币种统治者暨全境守护者。
  NFTsCount 是指持有 NFT 的数量，数量越大，代表越喜欢收藏 NFT。若 NFTsCount 小于 5 个则参考称号孤独的收藏家，数字艺术的守卫者，艺术品鉴爵士团长。若 NFTsCount 大于 5 个则参考称号勇敢的艺术品收藏领主，铁血数字艺术品收藏家，数字艺术品收藏之王。
  GasUsed 是指钱包地址消耗的手续费数量，数量越大，代表消耗的手续费越多。如果 GasUsed 小于 4 个参考称号矿工费不焚者，矿工费珍惜者。若 GasUsed 大于 4 个则参考称号矿工费使徒，矿工费猎手，矿工费地狱焚者，矿工费风暴之神。
  ——
  要求：我需要你根据以上逻辑，联想更多中二的名字并给予地址称号：
  - AddressAge: ${addressAge} 年，
  - LastTxTime: ${lastTxTime} 天，
  - Balance: ${balance} 个,
  - Portfolio: ${portfolio} 美金,
  - TxCount: ${txCount} 个,
  - TokensCount: ${tokensCount} 种,
  - NFTsCount: ${nftsCount} 个,
  - GasUsed: ${gasUsed} 个
  每一个称号用点号链接，需要 8 个称号连在一起，只输出称号即可，不需要句号结尾`;
}
