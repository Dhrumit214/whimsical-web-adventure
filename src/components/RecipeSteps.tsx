import { Check } from "lucide-react";

interface RecipeStepsProps {
  steps: string[];
  completedSteps: string[];
}

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
            <span className="text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};