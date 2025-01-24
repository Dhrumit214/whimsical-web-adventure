import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Smile, Frown, Meh, Angry } from "lucide-react";

interface CustomerAvatarProps {
  id: number;
  patience: number;
}

export const CustomerAvatar = ({ id, patience }: CustomerAvatarProps) => {
  const getEmotionIcon = () => {
    if (patience > 10) return <Smile className="w-6 h-6 text-green-500" />;
    if (patience > 7) return <Meh className="w-6 h-6 text-yellow-500" />;
    if (patience > 3) return <Frown className="w-6 h-6 text-orange-500" />;
    return <Angry className="w-6 h-6 text-red-500" />;
  };

  return (
    <Avatar className="w-12 h-12 border-2 border-white shadow-lg hover:scale-110 transition-transform">
      <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${id}`} />
      <AvatarFallback>{getEmotionIcon()}</AvatarFallback>
    </Avatar>
  );
};