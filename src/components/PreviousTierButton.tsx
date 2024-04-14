import tier_1_scroll from "../assets/tier-1-scroll-compressed.png";
import tier_2_scroll from "../assets/tier-2-scroll-compressed.png";
import tier_3_scroll from "../assets/tier-3-scroll-compressed.png";

const PreviousTierButton = ({
  currentTier,
  handlePrevious,
}: {
  currentTier: number;
  handlePrevious: () => void;
}) => {
  return (
    <>
      {currentTier == 0 && <></>}
      {currentTier == 1 && (
        <div className="warrior-tier-button" onClick={handlePrevious}>
          <img src={tier_1_scroll} />
        </div>
      )}
      {currentTier == 2 && (
        <div className="warrior-tier-button" onClick={handlePrevious}>
          <img src={tier_2_scroll} />
        </div>
      )}
    </>
  );
};

export default PreviousTierButton;
