import { Check, Sandwich, Pizza, Utensils } from "lucide-react";

interface RecipeStepsProps {
  steps: string[];
  completedSteps: string[];
}

const getStepIcon = (step: string) => {
  switch (step.toLowerCase()) {
    case "add bun":
    case "add top bun":
      return <Sandwich className="w-4 h-4 text-orange-500" />;
    case "add patty":
    case "add fries":
      return <Pizza className="w-4 h-4 text-orange-500" />;
    case "add toppings":
      return <Utensils className="w-4 h-4 text-orange-500" />;
    default:
      return null;
  }
};

export const RecipeSteps = ({ steps, completedSteps }: RecipeStepsProps) => {
  return (
    <div className="space-y-2 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="font-semibold text-gray-700">Recipe Steps:</h3>
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              completedSteps.includes(step)
                ? "bg-green-100 text-green-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm">
              {completedSteps.includes(step) ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </span>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium">{step}</span>
              {getStepIcon(step)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};