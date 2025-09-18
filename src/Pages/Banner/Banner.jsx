import BannerText from "./BannerText";
import Slider from "./Slider";

const Banner = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full justify-center items-center mt-20 bg-transparent">
      {/* text section  */}
      <div className="w-full">
        <BannerText />
      </div>

      {/* Image section  */}
      <div className="w-full grid place-items-center lg:place-items-end">
        <Slider />
      </div>
    </div>
  );
};

export default Banner;
