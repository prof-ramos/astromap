import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ZodiacRingProps {
  className?: string;
}

interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  dates: string;
  color: string;
  bgColor: string;
}

const zodiacSigns: ZodiacSign[] = [
  { name: "Áries", symbol: "♈", element: "Fogo", dates: "21/03 - 19/04", color: "#FF6B6B", bgColor: "rgba(255, 107, 107, 0.15)" },
  { name: "Touro", symbol: "♉", element: "Terra", dates: "20/04 - 20/05", color: "#4ECDC4", bgColor: "rgba(78, 205, 196, 0.15)" },
  { name: "Gêmeos", symbol: "♊", element: "Ar", dates: "21/05 - 20/06", color: "#45B7D1", bgColor: "rgba(69, 183, 209, 0.15)" },
  { name: "Câncer", symbol: "♋", element: "Água", dates: "21/06 - 22/07", color: "#96CEB4", bgColor: "rgba(150, 206, 180, 0.15)" },
  { name: "Leão", symbol: "♌", element: "Fogo", dates: "23/07 - 22/08", color: "#FF6B6B", bgColor: "rgba(255, 107, 107, 0.15)" },
  { name: "Virgem", symbol: "♍", element: "Terra", dates: "23/08 - 22/09", color: "#4ECDC4", bgColor: "rgba(78, 205, 196, 0.15)" },
  { name: "Libra", symbol: "♎", element: "Ar", dates: "23/09 - 22/10", color: "#45B7D1", bgColor: "rgba(69, 183, 209, 0.15)" },
  { name: "Escorpião", symbol: "♏", element: "Água", dates: "23/10 - 21/11", color: "#96CEB4", bgColor: "rgba(150, 206, 180, 0.15)" },
  { name: "Sagitário", symbol: "♐", element: "Fogo", dates: "22/11 - 21/12", color: "#FF6B6B", bgColor: "rgba(255, 107, 107, 0.15)" },
  { name: "Capricórnio", symbol: "♑", element: "Terra", dates: "22/12 - 19/01", color: "#4ECDC4", bgColor: "rgba(78, 205, 196, 0.15)" },
  { name: "Aquário", symbol: "♒", element: "Ar", dates: "20/01 - 18/02", color: "#45B7D1", bgColor: "rgba(69, 183, 209, 0.15)" },
  { name: "Peixes", symbol: "♓", element: "Água", dates: "19/02 - 20/03", color: "#96CEB4", bgColor: "rgba(150, 206, 180, 0.15)" },
];

export function ZodiacRing({ className = "" }: ZodiacRingProps) {
  const [hoveredSign, setHoveredSign] = useState<ZodiacSign | null>(null);
  const centerX = 150;
  const centerY = 150;
  const radius = 110;

  return (
    <div className={`relative ${className}`}>
      <div className="w-80 h-80 relative mx-auto">
        {/* SVG Ring */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="absolute inset-0"
        >
          <defs>
            <radialGradient id="zodiacGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(63, 207, 249, 0.1)" />
              <stop offset="100%" stopColor="rgba(136, 255, 71, 0.05)" />
            </radialGradient>
            <filter id="zodiacGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 20}
            fill="url(#zodiacGradient)"
            opacity="0.3"
          />
          
          {/* Outer ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(63, 207, 249, 0.3)"
            strokeWidth="2"
            strokeDasharray="5,5"
            filter="url(#zodiacGlow)"
          />
          
          {/* Inner ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 40}
            fill="none"
            stroke="rgba(136, 255, 71, 0.4)"
            strokeWidth="1"
          />
        </svg>

        {/* Zodiac Signs */}
        {zodiacSigns.map((sign, index) => {
          const angle = (index * 30 - 90) * Math.PI / 180;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const isHovered = hoveredSign?.name === sign.name;

          return (
            <div
              key={sign.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`,
              }}
              onMouseEnter={() => setHoveredSign(sign)}
              onMouseLeave={() => setHoveredSign(null)}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 zodiac-icon"
                style={{
                  backgroundColor: isHovered ? sign.bgColor : 'rgba(255, 255, 255, 0.15)',
                  borderColor: isHovered ? sign.color : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: isHovered ? `0 0 20px ${sign.color}40` : 'none',
                }}
              >
                <span
                  className="text-2xl font-bold transition-colors duration-300"
                  style={{ color: isHovered ? sign.color : '#666' }}
                >
                  {sign.symbol}
                </span>
              </div>
            </div>
          );
        })}

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {hoveredSign ? (
              <Card className="glass-card border-white/30 max-w-xs animate-in fade-in duration-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span
                      className="text-3xl mr-2"
                      style={{ color: hoveredSign.color }}
                    >
                      {hoveredSign.symbol}
                    </span>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800">{hoveredSign.name}</h3>
                      <p className="text-sm text-gray-600">{hoveredSign.element}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{hoveredSign.dates}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="glass-card rounded-full p-6 border-white/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center animate-pulse-slow">
                  <span className="text-white text-2xl">✦</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">Explore os signos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}