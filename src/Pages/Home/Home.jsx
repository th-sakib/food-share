import Separator from "../../components/Separator";
import Banner from "../Banner/Banner";
import AvailableFood from "./AvailableFood/AvailableFood";
import HowItWork from "./howItWork/HowItWork";
import ImpactStats from "./ImpactStats/ImpactStats";

function Home() {
  return (
    <div>
      <div className="mx-auto px-2 xs:px-0 xs:max-w-[88%] bannerMd:max-w-[78%] lg:max-w-[80%] xl:max-w-[1200px]">
        {/* bg-gradient-to-b from-backgroundC to-white */}
        <div className="relative overflow-hidden bg-transparent">
          <Banner />
          <HowItWork />
          <AvailableFood />
          <ImpactStats />
        </div>
      </div>
    </div>
  );
}

export default Home;
