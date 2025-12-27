import { Heart, Diamond, Club, Spade } from "lucide-react";

interface MeldGuideProps {
  trump: "hearts" | "diamonds" | "clubs" | "spades";
}

const SuitIcon = ({ suit, size = 12 }: { suit: "hearts" | "diamonds" | "clubs" | "spades"; size?: number }) => {
  const iconProps = { size, strokeWidth: 2.5 };
  switch (suit) {
    case "hearts":
      return <Heart {...iconProps} className="text-red-500 fill-red-500" />;
    case "diamonds":
      return <Diamond {...iconProps} className="text-red-500 fill-red-500" />;
    case "clubs":
      return <Club {...iconProps} className="text-gray-800 fill-gray-800" />;
    case "spades":
      return <Spade {...iconProps} className="text-gray-800 fill-gray-800" />;
  }
};

const Card = ({ rank, suit }: { rank: string; suit: "hearts" | "diamonds" | "clubs" | "spades" }) => {
  const isRed = suit === "hearts" || suit === "diamonds";
  return (
    <div className={`inline-flex items-center justify-center gap-0.5 px-1 py-0.5 bg-white rounded shadow-sm border border-gray-200 min-w-[28px] ${isRed ? "text-red-500" : "text-gray-800"}`}>
      <span className="text-xs font-bold leading-none">{rank}</span>
      <SuitIcon suit={suit} size={10} />
    </div>
  );
};

const AllSuits = ({ size = 10 }: { size?: number }) => (
  <div className="flex gap-0.5">
    <SuitIcon suit="spades" size={size} />
    <SuitIcon suit="hearts" size={size} />
    <SuitIcon suit="diamonds" size={size} />
    <SuitIcon suit="clubs" size={size} />
  </div>
);

export const MeldGuide = ({ trump }: MeldGuideProps) => {
  const allSuits: Array<"hearts" | "diamonds" | "clubs" | "spades"> = ["spades", "hearts", "diamonds", "clubs"];
  
  return (
    <div className="w-full max-w-lg mx-auto mt-4 p-3 bg-muted/50 rounded-lg">
      <h3 className="text-sm font-semibold text-center mb-3 text-muted-foreground">Meld Reference</h3>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Type I - Runs & Marriages */}
        <div className="space-y-2">
          <h4 className="font-semibold text-muted-foreground border-b pb-1">Runs & Marriages</h4>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <Card rank="A" suit={trump} />
              <Card rank="10" suit={trump} />
              <Card rank="K" suit={trump} />
              <Card rank="Q" suit={trump} />
              <Card rank="J" suit={trump} />
            </div>
            <span className="font-bold text-green-600 whitespace-nowrap">150</span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Card rank="K" suit={trump} />
              <Card rank="Q" suit={trump} />
              <span className="text-muted-foreground text-[10px]">(trump)</span>
            </div>
            <span className="font-bold text-green-600">40</span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Card rank="K" suit="spades" />
              <Card rank="Q" suit="spades" />
              <span className="text-muted-foreground text-[10px]">(other)</span>
            </div>
            <span className="font-bold text-green-600">20</span>
          </div>
        </div>

        {/* Type II - Pinochle */}
        <div className="space-y-2">
          <h4 className="font-semibold text-muted-foreground border-b pb-1">Pinochle</h4>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Card rank="J" suit="diamonds" />
              <Card rank="Q" suit="spades" />
            </div>
            <span className="font-bold text-green-600">40</span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Card rank="J" suit="diamonds" />
              <Card rank="J" suit="diamonds" />
              <Card rank="Q" suit="spades" />
              <Card rank="Q" suit="spades" />
            </div>
            <span className="font-bold text-green-600">300</span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Card rank="9" suit={trump} />
              <span className="text-muted-foreground text-[10px]">(Dix)</span>
            </div>
            <span className="font-bold text-green-600">10</span>
          </div>
        </div>

        {/* Type III - Around */}
        <div className="col-span-2 space-y-2">
          <h4 className="font-semibold text-muted-foreground border-b pb-1">Around (one of each suit)</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Aces</span>
                <AllSuits />
              </div>
              <span className="font-bold text-green-600">100</span>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Kings</span>
                <AllSuits />
              </div>
              <span className="font-bold text-green-600">80</span>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Queens</span>
                <AllSuits />
              </div>
              <span className="font-bold text-green-600">60</span>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">Jacks</span>
                <AllSuits />
              </div>
              <span className="font-bold text-green-600">40</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
