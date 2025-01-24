import { Button } from "@/components/ui/button";
import { Utensils, Check, AlertCircle, Pizza, Sandwich, CookingPot, ChefHat, Beef, Cherry } from "lucide-react";
import { Step, Customer } from "../types/game";

interface PrepStationProps {
  selectedCustomer: Customer | null;
  currentSteps: Step[];
  onStepClick: (step: Step) => void;
  onServe: () => void;
  stepNames: Record<Step, string>;
}

export const PrepStation = ({ 
  selectedCustomer, 
  currentSteps, 
  onStepClick, 
  onServe,
  stepNames 
}: PrepStationProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <ChefHat className="w-5 h-5" />
          Prep Station
        </h2>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Current Order</h3>
        {selectedCustomer ? (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <CookingPot className="w-5 h-5 text-orange-500" />
              <span>Preparing: {selectedCustomer.dish}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSteps.map((step, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {stepNames[step]}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Select a customer to start preparing their order
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline"
          onClick={() => onStepClick('bun')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Sandwich className="w-5 h-5 text-orange-500" />
          Add Bun
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('patty')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Pizza className="w-5 h-5 text-orange-500" />
          Add Patty
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('topBun')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Sandwich className="w-5 h-5 text-orange-500 rotate-180" />
          Add Top Bun
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('sausage')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Beef className="w-5 h-5 text-orange-500" />
          Add Sausage
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('toppings')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Utensils className="w-5 h-5 text-orange-500" />
          Add Toppings
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('fries')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Pizza className="w-5 h-5 text-orange-500" />
          Add Fries
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('salt')}
          disabled={!selectedCustomer}
          className="bg-white/80 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 h-14"
        >
          <Cherry className="w-5 h-5 text-orange-500" />
          Add Salt
        </Button>
        <Button 
          onClick={onServe}
          variant="default"
          className={`col-span-2 h-14 transition-all ${
            selectedCustomer
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!selectedCustomer}
        >
          <Check className="w-5 h-5 mr-2" />
          Serve Order
        </Button>
      </div>
    </div>
  );
};