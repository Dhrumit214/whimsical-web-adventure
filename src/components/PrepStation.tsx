import { Button } from "@/components/ui/button";
import { Utensils, Check, AlertCircle, Pizza, Sandwich, CookingPot } from "lucide-react";
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Utensils className="w-5 h-5" />
        Prep Station
      </h2>
      
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 animate-fade-in">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Current Order</h3>
        {selectedCustomer ? (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <CookingPot className="w-5 h-5 text-orange-500" />
              Preparing: {selectedCustomer.dish}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSteps.map((step, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-scale-in"
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
          className="hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Sandwich className="w-4 h-4" />
          Add Bun
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('patty')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Pizza className="w-4 h-4" />
          Add Patty
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('topBun')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform"
        >
          Add Top Bun
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('sausage')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform"
        >
          Add Sausage
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('toppings')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform"
        >
          Add Toppings
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('fries')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform"
        >
          Add Fries
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStepClick('salt')}
          disabled={!selectedCustomer}
          className="hover:scale-105 transition-transform"
        >
          Add Salt
        </Button>
        <Button 
          onClick={onServe}
          variant="default"
          className={`col-span-2 transition-all ${
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