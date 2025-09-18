import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const BannerText = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:items-start gap-3 lg:gap-5 text-center lg:text-start mt-11 lg:mt-0">
      {/* header part  */}
      <div className="self-center space-y-2 lg:space-y-3">
        <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold leading-11">
          Share Food. Build Community.{" "}
          <span className="text-orange-400">Reduce Waste.</span>
        </h1>
        <p className="text-xl">
          Turn surplus meals into hope. FoodShare connects people with excess
          food to those who need it — reducing waste and feeding communities.
        </p>
      </div>

      <Link to="/all-products">
        <Button className="border-none text-base text-white mr-2 hover:cursor-pointer">
          Donate Food
        </Button>
        <Button className="border-none text-base text-white hover:cursor-pointer">
          Find Food
        </Button>
      </Link>
    </div>
  );
};

export default BannerText;
