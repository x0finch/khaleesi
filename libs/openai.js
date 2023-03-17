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
AddressAge 是指一个钱包地址使用的年龄，年龄越大，代表越资深，一般一个钱包地址年龄不会超过 3 年。参考称号:风暴中的前行者，光辉见证者，脉络掌握者，驾驭波动的智者，牛熊穿梭者
LastTxTime 是指钱包地址最后一笔交易距离现在的时间，时间间隔越短，代表地址越活跃，参考称号:热血火拼者，伺机而动的猎手，稳健的长期持币者，不动产主，沉睡的守护者
Balance 是指钱包里有多少 ETH 余额，余额越大忠诚度越高，参考称号:以太坊王国呼唤者，以太坊王国的追随者，以太坊王国的传教士
Portfolio 是指钱包的财富值，财富值越大代表越富有，参考称号:赤手空拳的勇士，未来财富之光，黑暗丛林的猎人，数字财富之主，链上资本家，富可敌国的领主
TxCount 是指钱包地址的转账次数，次数越多代表操作越频繁。参考称号:未经打磨的宝石，区块链荒原的流浪者，微光闪耀的新星，探索之路的勇士，疯狂的链上搬运工，万物皆可交易的主宰
TokensCount 是指钱包地址中持有币种的种类数量，持有的越多，代表投资的种类越多，一般一个钱包地址不会超过 20 个币种。参考称号:少数派的守护者，睿智无比的自律之神，币种元素掌握者，币种统治者暨全境守护者
NFTsCount 是指持有 NFT 的数量，数量越大，代表越喜欢收藏 NFT。参考称号:孤独的收藏家，数字艺术的守卫者，艺术品鉴爵士团长，勇敢的艺术品收藏领主，铁血数字艺术品收藏家，数字艺术品收藏之王
GasUsed 是指钱包地址消耗的手续费数量，数量越大，代表消耗的手续费越多, 一般钱包地址矿工费不会超过 4 个以太坊。参考称号:不焚者，矿工费解放者，矿工费使徒，矿工费猎手，矿工费地狱焚者，矿工费风暴之神
——
要求：我需要你根据以上逻辑，联想更多中二的名字并给予地址称号：
- AddressAge: ${addressAge}，
- LastTxTime: ${lastTxTime}，
- Balance: ${balance},
- Portfolio: ${portfolio},
- TxCount: ${txCount},
- TokensCount: ${tokensCount},
- NFTsCount: ${nftsCount},
- GasUsed: ${gasUsed}
每一个称号用点号链接，需要 8 个称号连在一起，只输出称号即可`;
}
