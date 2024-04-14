import tier_1_scroll from "../assets/tier-1-scroll-compressed.png";
import tier_2_scroll from "../assets/tier-2-scroll-compressed.png";
import tier_3_scroll from "../assets/tier-3-scroll-compressed.png";

const NextTierButton = ({
  currentTier,
  handleNext,
}: {
  currentTier: number;
  handleNext: () => void;
}) => {
  return (
    <>
      {currentTier == 0 && (
        <div className="warrior-tier-button" onClick={handleNext}>
          <img src={tier_2_scroll} />
        </div>
      )}
      {currentTier == 1 && (
        <div className="warrior-tier-button" onClick={handleNext}>
          <img src={tier_3_scroll} />
        </div>
      )}
      {currentTier == 2 && <></>}
    </>
  );
};

export default NextTierButton;
