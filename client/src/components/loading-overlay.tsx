import { Card, CardContent } from "@/components/ui/card";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="glass-card rounded-2xl border-white/30 max-w-sm mx-4">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white/30 border-t-[#3FCFF9] animate-spin"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gerando Seu Mapa Astral</h3>
          <p className="text-sm text-gray-600">Calculando posições planetárias...</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] h-2 rounded-full animate-pulse w-3/5"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
