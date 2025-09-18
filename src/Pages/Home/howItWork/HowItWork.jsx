import { Repeat2, Rss, Soup } from "lucide-react";
import "./howItWork.css";
import Title from "../../../components/Title";

function HowItWork() {
  const workSteps = [
    {
      id: 1,
      title: "Post Food",
      description: "Share details of surplus food.",
      icon: <Soup size={65} className="custom-icon" />,
    },
    {
      id: 2,
      title: "Connect Locally",
      description: "Match with nearby receivers.",
      icon: <Rss size={65} className="custom-icon" />,
    },
    {
      id: 3,
      title: "Share & Impact",
      description: "Food gets used, not wasted.",
      icon: <Repeat2 size={65} className="custom-icon" />,
    },
  ];
  return (
    <div className="my-16">
      <Title titleName="How It Works" />
      <div className="grid gap-8 md:grid-cols-3">
        {workSteps.map((step) => (
          <div
            key={step.id}
            className="p-4 border rounded-lg bg-white shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="mb-4 ">{step.icon}</div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWork;
