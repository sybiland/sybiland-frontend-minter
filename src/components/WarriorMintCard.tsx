import low_tier_warrior from "../assets/low-tier-archer.mp4";
import mid_tier_warrior from "../assets/mid-tier-front-warrior.mp4";
import top_tier_warrior from "../assets/top-tier-ships-crew.mp4";

export enum WarriorTier {
  LOW,
  MID,
  TOP,
}

const getWarriorImg = (tier: WarriorTier) => {
  switch (tier) {
    case WarriorTier.LOW:
      return low_tier_warrior;
    case WarriorTier.MID:
      return mid_tier_warrior;
    case WarriorTier.TOP:
      return top_tier_warrior;
    default:
      return low_tier_warrior;
  }
};

const getWarriorTitle = (tier: WarriorTier) => {
  switch (tier) {
    case WarriorTier.LOW:
      return "Low Tier Archer";
    case WarriorTier.MID:
      return "Mid Tier Front Warrior";
    case WarriorTier.TOP:
      return "Top Tier Ships Crew";
    default:
      return "Low Tier Archer";
  }
};

const WarriorMintCard = ({
  handleMint,
  warriorTier,
}: {
  handleMint: () => void;
  warriorTier: WarriorTier;
}) => {
  return (
    <div className="warrior-mint-card-container">
      <text>{getWarriorTitle(warriorTier)}</text>
      <video height={250} width={250} autoPlay muted>
        <source src={getWarriorImg(warriorTier)} type="video/mp4" />
      </video>
      <button onClick={handleMint}>MINT</button>
    </div>
  );
};

export default WarriorMintCard;
