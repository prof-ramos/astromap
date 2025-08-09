import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPie, Download, Sun, Moon } from "lucide-react";
import type { AstralChart, ParsedChartData } from "@shared/schema";

interface ChartPreviewProps {
  chart: AstralChart | null;
}

export function ChartPreview({ chart }: ChartPreviewProps) {
  const handleDownloadSVG = async () => {
    if (!chart) return;
    
    try {
      const response = await fetch(`/api/download-svg/${chart.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mapa-astral-${chart.id}.svg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!chart) return;
    
    try {
      const response = await fetch(`/api/download-pdf/${chart.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-astral-${chart.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const chartData: ParsedChartData | null = chart ? JSON.parse(chart.chartData) : null;

  return (
    <Card className="glass-card rounded-2xl border-white/30">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#88ff47]/20 flex items-center justify-center mr-3">
              <ChartPie className="text-[#88ff47]" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Sua Carta Natal</h3>
          </div>
          {chart && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadSVG}
                className="glass-card border border-[#3FCFF9] text-[#3FCFF9] hover:bg-[#3FCFF9]/20 hover:text-[#3FCFF9] hover:scale-105 transition-all"
              >
                <Download className="mr-1" size={16} />
                SVG
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPDF}
                className="glass-card border border-[#88ff47] text-[#88ff47] hover:bg-[#88ff47]/20 hover:text-[#88ff47] hover:scale-105 transition-all"
              >
                <Download className="mr-1" size={16} />
                PDF
              </Button>
            </div>
          )}
        </div>

        {/* Chart Container */}
        <div className="relative">
          {chart ? (
            <div className="w-full h-80 rounded-xl flex items-center justify-center">
              <div 
                dangerouslySetInnerHTML={{ __html: chart.svgData }}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="astral-chart-placeholder w-full h-80 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center animate-pulse">
                  <ChartPie className="text-white animate-spin" size={32} />
                </div>
                <p className="text-gray-600 font-medium">Preencha os dados para gerar seu mapa</p>
                <p className="text-sm text-gray-500 mt-1">A carta natal aparecerá aqui</p>
              </div>
            </div>
          )}

          {/* Enhanced Zodiac Elements (decorative when no chart) */}
          {!chart && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Animated zodiac symbols with enhanced styling */}
              {[
                { symbol: "♈", color: "#FF6B6B", position: "top-4 left-1/2 -translate-x-1/2", delay: "0s" },
                { symbol: "♉", color: "#4ECDC4", position: "top-8 right-8", delay: "0.2s" },
                { symbol: "♊", color: "#45B7D1", position: "right-4 top-1/2 -translate-y-1/2", delay: "0.4s" },
                { symbol: "♋", color: "#96CEB4", position: "bottom-8 right-8", delay: "0.6s" },
                { symbol: "♌", color: "#FF6B6B", position: "bottom-4 left-1/2 -translate-x-1/2", delay: "0.8s" },
                { symbol: "♍", color: "#4ECDC4", position: "bottom-8 left-8", delay: "1s" },
                { symbol: "♎", color: "#45B7D1", position: "left-4 top-1/2 -translate-y-1/2", delay: "1.2s" },
                { symbol: "♏", color: "#96CEB4", position: "top-8 left-8", delay: "1.4s" },
              ].map((zodiac, index) => (
                <div 
                  key={zodiac.symbol}
                  className={`absolute ${zodiac.position} transform animate-float zodiac-icon`}
                  style={{ 
                    animationDelay: zodiac.delay,
                    filter: `drop-shadow(0 0 8px ${zodiac.color}40)`
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${zodiac.color}20`,
                      borderColor: `${zodiac.color}60`
                    }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ color: zodiac.color }}
                    >
                      {zodiac.symbol}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Decorative stars */}
              <div className="absolute top-16 right-16 animate-pulse-slow">
                <span className="text-[#3FCFF9] text-sm opacity-60">✦</span>
              </div>
              <div className="absolute bottom-16 left-16 animate-pulse-slow" style={{ animationDelay: '1s' }}>
                <span className="text-[#88ff47] text-xs opacity-50">✧</span>
              </div>
              <div className="absolute top-1/3 left-12 animate-pulse-slow" style={{ animationDelay: '2s' }}>
                <span className="text-[#3FCFF9] text-xs opacity-40">✦</span>
              </div>
              <div className="absolute bottom-1/3 right-12 animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                <span className="text-[#88ff47] text-sm opacity-50">✧</span>
              </div>
            </div>
          )}
        </div>

        {/* Chart Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card className="glass-card bg-[#3FCFF9]/10 border-[#3FCFF9]/30">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Sun className="text-[#3FCFF9] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Signo Solar</p>
                  <p className="font-semibold text-gray-800">
                    {chart ? chart.sunSign : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card bg-[#88ff47]/10 border-[#88ff47]/30">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Moon className="text-[#88ff47] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Signo Lunar</p>
                  <p className="font-semibold text-gray-800">
                    {chart ? chart.moonSign : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {chartData && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Ascendente</p>
              <p className="font-semibold text-lg text-[#3FCFF9]">{chartData.risingSign}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
