import { Construction } from "lucide-react";
import Navbar from "../../components/Sharable/Navbar";

function ErrorPage() {
  return (
    <div>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center"
        style={{ marginTop: "100px", textAlign: "center", fontSize: "24px" }}
      >
        <Construction size={70} />
        Under Construction
      </div>
    </div>
  );
}

export default ErrorPage;
