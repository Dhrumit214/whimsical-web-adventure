import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, Unlock, DollarSign, Timer, ArrowRight } from "lucide-react";
import { MenuItem } from "@/types/game";
import { toast } from "sonner";

interface UpgradesShopProps {
  money: number;
  menuItems: MenuItem[];
  onUnlockItem: (itemId: string) => void;
}

export const UpgradesShop = ({ money, menuItems, onUnlockItem }: UpgradesShopProps) => {
  const handleUnlock = (item: MenuItem) => {
    if (money >= item.unlockCost) {
      onUnlockItem(item.id);
      toast.success(`Unlocked ${item.name}!`, {
        description: `You can now take orders for ${item.name} and earn $${item.price} per order.`
      });
    } else {
      toast.error("Not enough money!", {
        description: `You need $${item.unlockCost - money} more to unlock ${item.name}.`
      });
    }
  };

  const calculateROI = (item: MenuItem) => {
    return Math.ceil(item.unlockCost / item.price);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <DollarSign className="w-4 h-4" />
          Upgrades Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrades Shop</DialogTitle>
          <DialogDescription>
            Unlock new menu items to earn more money!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                item.isUnlocked ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {item.isUnlocked ? (
                  <Unlock className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Earns ${item.price} per order
                </p>
                {!item.isUnlocked && (
                  <>
                    <p className="flex items-center gap-2">
                      <Timer className="w-4 h-4" />
                      ROI: {calculateROI(item)} orders to break even
                    </p>
                    <Button
                      onClick={() => handleUnlock(item)}
                      disabled={money < item.unlockCost}
                      className="w-full mt-2"
                    >
                      Unlock for ${item.unlockCost}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};