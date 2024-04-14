import { Connection } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import aether_ritual from "../assets/aether-ritual-gif-compressed.gif";
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import {
  Signer,
  Transaction,
  Umi,
  generateSigner,
  publicKey,
  signTransaction,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { toast } from "react-toastify";
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSetMintArgs,
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import tier_1_scroll from "../assets/tier-1-scroll-compressed.png";
import tier_2_scroll from "../assets/tier-2-scroll-compressed.png";
import tier_3_scroll from "../assets/tier-3-scroll-compressed.png";
import tier_1_price from "../assets/tier-1-price-compressed.png";
import tier_2_price from "../assets/tier-2-price-compressed.png";
import tier_3_price from "../assets/tier-3-price-compressed.png";
import sybiland_logo from "../assets/favicon.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import PreviousTierButton from "./PreviousTierButton";
import NextTierButton from "./NextTierButton";

const TREASURY_ADDRESS = "7SBCjYUpm5y25Qvzi1MnzazrKnACP6wNs1H4SWXUojBu";
const TIER_1_CANDY_MACHINE_ADDRESS =
  "H91yqGGy4UpFv9yC7NWqux3wHbwGppVGejoCXuhU465v";
const TIER_2_CANDY_MACHINE_ADDRESS =
  "DFezhxhu5ozsKkBFcHTnkLaUkx2Zc6dfDzquuzu9pvW9";
const TIER_3_CANDY_MACHINE_ADDRESS =
  "4Xr7zbxhrwxCQiN6WJL3UusSsh5QobC8tFMmJrtyzXBN";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MintingBox = () => {
  const navigate = useNavigate();
  const walletContext: WalletContextState = useWallet();
  const { wallet, connect } = walletContext;
  const [minting, setMinting] = useState<boolean>(false);
  const small = useMediaQuery({ query: "(max-width: 850px)" });
  const [displayedTier, setDisplayedTier] = useState<number>(0);

  const handleNext = () => {
    if (displayedTier == 2) return;
    setDisplayedTier((prev) => (prev + 1) % 3);
  };

  const handlePrevious = () => {
    if (displayedTier == 0) return;
    setDisplayedTier((prev) => (prev - 1) % 3);
  };

  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata())
    .use(mplCandyMachine())
    .use(walletAdapterIdentity(walletContext));

  useEffect(() => {
    console.log("Changed wallet");
    console.log(wallet);
  }, [wallet]);

  const buildTransaction = (
    umi: Umi,
    candyMachine: CandyMachine,
    candyGuard: CandyGuard,
    nftMint: Signer,
    mintArgs: Partial<DefaultGuardSetMintArgs> | undefined,
    latestBlockhash: string,
    units: number
  ) => {
    let tx = transactionBuilder().add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
        nftMint,
        candyGuard: candyGuard.publicKey,
        mintArgs,
        tokenStandard: candyMachine.tokenStandard,
      })
    );
    tx = tx.prepend(setComputeUnitLimit(umi, { units }));
    tx = tx.prepend(setComputeUnitPrice(umi, { microLamports: 500 }));
    tx = tx.setBlockhash(latestBlockhash);
    return tx.build(umi);
  };

  const getRequiredCU = async (umi: Umi, transaction: Transaction) => {
    const defaultCU = 800_000;
    const web3tx = toWeb3JsTransaction(transaction);
    let connection = new Connection(umi.rpc.getEndpoint(), "finalized");
    const simulatedTx = await connection.simulateTransaction(web3tx, {
      replaceRecentBlockhash: true,
      sigVerify: false,
    });
    if (simulatedTx.value.err || !simulatedTx.value.unitsConsumed) {
      return defaultCU;
    }
    return simulatedTx.value.unitsConsumed + 20_000 || defaultCU;
  };

  const handleMint = async (candyMachineAddress: string) => {
    if (minting) return;

    setMinting(true);

    try {
      const mintArgs: Partial<DefaultGuardSetMintArgs> = {
        solPayment: some({
          destination: publicKey(TREASURY_ADDRESS),
        }),
      };

      const nftMint = generateSigner(umi);

      const candyMachine = await fetchCandyMachine(
        umi,
        publicKey(candyMachineAddress)
      );
      const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);

      const latestBlockhash = (await umi.rpc.getLatestBlockhash()).blockhash;

      const txForSimulation = buildTransaction(
        umi,
        candyMachine,
        candyGuard,
        nftMint,
        mintArgs,
        latestBlockhash,
        1_400_000
      );
      const requiredCu = await getRequiredCU(umi, txForSimulation);

      const transaction = buildTransaction(
        umi,
        candyMachine,
        candyGuard,
        nftMint,
        mintArgs,
        latestBlockhash,
        requiredCu
      );

      const signedTx = await signTransaction(transaction, [umi.payer, nftMint]);
      const result = await umi.rpc.sendTransaction(signedTx);

      console.log(result);

      // const buffer = Buffer.from(result.buffer);
      // const hexString = buffer.toString("hex");
      // console.log(hexString);
      // toast.success(hexString);

      setMinting(false);
      return true;
    } catch (error: any) {
      console.log(error);
      setMinting(false);
      toast.error(`Aether Ritual failed: ${error.message}`);
      return false;
    }
  };

  const handleMintTier1 = async () => {
    if (minting) return;

    toast.info("Aether Ritual commencing!");
    await sleep(600);
    toast.info("Summoning Tier 1 Sybiland Forces...");

    const ritualResult = await handleMint(TIER_1_CANDY_MACHINE_ADDRESS);
    if (ritualResult) {
      toast.success(`Aether Ritual successful!`);
      toast.success(`Summoned - T1 Archer`);
    }
  };

  const handleMintTier2 = async () => {
    if (minting) return;
    toast.info("Aether Ritual commencing!");
    await sleep(600);
    toast.info("Summoning Tier 2 Sybiland Forces...");

    const ritualResult = await handleMint(TIER_2_CANDY_MACHINE_ADDRESS);
    if (ritualResult) {
      toast.success(`Aether Ritual successful!`);
      toast.success(`Summoned - T2 Berserker`);
    }
  };

  const handleMintTier3 = async () => {
    if (minting) return;
    toast.info("Aether Ritual commencing!");
    await sleep(600);
    toast.info("Summoning Tier 3 Sybiland Forces...");

    const ritualResult = await handleMint(TIER_3_CANDY_MACHINE_ADDRESS);
    if (ritualResult) {
      toast.success(`Aether Ritual successful!`);
      toast.success(`Summoned - T3 Frontline Warrior`);
    }
  };

  return (
    <div className="mint-page">
      <div className="sybiland-logo-favicon">
        <img src={sybiland_logo} onClick={() => navigate("/")} />
      </div>
      <div className="wallet-button-wrapper">
        <WalletMultiButton className="wallet-multi-button" />
      </div>

      {small && (
        <div className="mint-ritual-box-small">
          {displayedTier == 0 && (
            <div className="warrior-tier-mint-card">
              <img src={tier_1_scroll} />
              <img src={tier_1_price} />
              <button className="summon-button" onClick={handleMintTier1} />
            </div>
          )}
          {displayedTier == 1 && (
            <div className="warrior-tier-mint-card">
              <img src={tier_2_scroll} />
              <img src={tier_2_price} />
              <button className="summon-button" onClick={handleMintTier2} />
            </div>
          )}
          {displayedTier == 2 && (
            <div className="warrior-tier-mint-card">
              <img src={tier_3_scroll} />
              <img src={tier_3_price} />
              <button className="summon-button" onClick={handleMintTier3} />
            </div>
          )}
          <div className="tier-navigator">
            <PreviousTierButton
              currentTier={displayedTier}
              handlePrevious={handlePrevious}
            />
            <NextTierButton
              currentTier={displayedTier}
              handleNext={handleNext}
            />
          </div>
        </div>
      )}
      {!small && (
        <div className="mint-ritual-box">
          <div className="warrior-tier-mint-card">
            <img src={tier_1_scroll} />
            <img src={tier_1_price} />
            <button className="summon-button" onClick={handleMintTier1} />
          </div>
          <div className="warrior-tier-mint-card">
            <img src={tier_2_scroll} />
            <img src={tier_2_price} />
            <button className="summon-button" onClick={handleMintTier2} />
          </div>
          <div className="warrior-tier-mint-card">
            <img src={tier_3_scroll} />
            <img src={tier_3_price} />
            <button className="summon-button" onClick={handleMintTier3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MintingBox;
