import { useState } from "react";
import { BirthDataForm } from "@/components/birth-data-form";
import { ChartPreview } from "@/components/chart-preview";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ZodiacRing } from "@/components/zodiac-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Stars, 
  Rocket, 
  Play, 
  Zap, 
  Gift, 
  Download, 
  User, 
  Award, 
  Heart, 
  Wand2,
  Shield,
  Sun,
  Moon,
  MapPin,
  Calendar,
  Clock,
  ChartPie,
  Instagram,
  Youtube,
  Mail,
  Menu,
  Info,
  CheckCircle,
  CloudLightning,
  Cog,
  Satellite,
  Calculator
} from "lucide-react";
import type { AstralChart } from "@shared/schema";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<AstralChart | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans antialiased">
      {/* Navigation Header */}
      <header className="relative z-50 px-4 py-6">
        <nav className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center animate-pulse-slow">
                  <Stars className="text-white animate-glow" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800 font-serif">Psicóloga Em Outra Dimensão</h1>
                  <p className="text-sm text-gray-600">Gerador de Mapa Astral</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-[#3FCFF9] transition-colors"
                >
                  Sobre
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-[#3FCFF9] transition-colors"
                >
                  Como Funciona
                </button>
                <Button 
                  onClick={() => scrollToSection('generator')}
                  className="bg-[#3FCFF9] text-white hover:bg-[#3FCFF9]/90"
                >
                  Gerar Mapa
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating zodiac symbols background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-[#3FCFF9] opacity-20 animate-float">
              <Moon size={48} />
            </div>
            <div className="absolute top-20 right-16 text-[#88ff47] opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
              <Sun size={36} />
            </div>
            <div className="absolute bottom-20 left-20 text-[#3FCFF9] opacity-25 animate-float star-animation" style={{ animationDelay: '1s' }}>
              <Stars size={24} />
            </div>
            <div className="absolute bottom-32 right-12 text-[#88ff47] opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
              <Wand2 size={36} />
            </div>
          </div>

          <Card className="glass-card rounded-3xl border-white/30 relative z-10">
            <CardContent className="p-8 md:p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center animate-glow shadow-lg">
                <ChartPie className="text-white animate-spin-slow drop-shadow-sm" size={32} />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 font-serif">
                Descubra Seu{" "}
                <span className="bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] bg-clip-text text-transparent">
                  Mapa Astral
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Gere seu mapa astral completo em segundos. Sem cadastro, sem custo. 
                Receba um relatório detalhado e sua carta natal em formato profissional.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Button 
                  size="lg"
                  onClick={() => scrollToSection('generator')}
                  className="cosmic-button w-full sm:w-auto text-white hover:scale-105 transition-all shadow-lg py-4 font-semibold"
                >
                  <Rocket className="mr-2" size={20} />
                  Gerar Meu Mapa Agora
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto glass-card border-2 border-[#88ff47] text-gray-700 hover:bg-[#88ff47]/20 hover:text-gray-800 transition-all hover:scale-105"
                >
                  <Play className="mr-2" size={20} />
                  Ver Demonstração
                </Button>
              </div>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3FCFF9]/20 flex items-center justify-center">
                    <Zap className="text-[#3FCFF9]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Instantâneo</h3>
                  <p className="text-sm text-gray-600">Geração em menos de 5 segundos</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#88ff47]/20 flex items-center justify-center">
                    <Gift className="text-[#88ff47]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">100% Gratuito</h3>
                  <p className="text-sm text-gray-600">Sem cadastro ou pagamento</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3FCFF9]/20 flex items-center justify-center">
                    <Download className="text-[#3FCFF9]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Download Completo</h3>
                  <p className="text-sm text-gray-600">SVG + PDF detalhado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Astral Chart Generator */}
      <section id="generator" className="relative px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
              Gerador de Mapa Astral
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Preencha seus dados de nascimento para gerar seu mapa astral personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BirthDataForm 
              onSubmit={() => setIsLoading(true)}
              onSuccess={(chart) => {
                setGeneratedChart(chart);
                setIsLoading(false);
              }}
              onError={() => setIsLoading(false)}
            />
            <ChartPreview chart={generatedChart} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative px-4 py-16 bg-gradient-to-r from-transparent via-white/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um processo simples e intuitivo para descobrir os segredos do seu mapa astral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="glass-card rounded-2xl border-white/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Preencha Seus Dados</h3>
                <p className="text-gray-600 mb-4">
                  Informe seu nome completo, data, hora e cidade de nascimento para cálculos precisos.
                </p>
                <div className="flex justify-center space-x-2">
                  <User className="text-[#3FCFF9]" size={20} />
                  <Calendar className="text-[#88ff47]" size={20} />
                  <Clock className="text-[#3FCFF9]" size={20} />
                  <MapPin className="text-[#88ff47]" size={20} />
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="glass-card rounded-2xl border-white/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#88ff47] to-[#3FCFF9] flex items-center justify-center">
                  <span className="text-black font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Processamento Astral</h3>
                <p className="text-gray-600 mb-4">
                  Nossa tecnologia calcula as posições planetárias exatas do momento do seu nascimento.
                </p>
                <div className="flex justify-center space-x-2">
                  <Cog className="text-[#88ff47] animate-spin" size={20} />
                  <Satellite className="text-[#3FCFF9]" size={20} />
                  <Calculator className="text-[#88ff47]" size={20} />
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="glass-card rounded-2xl border-white/30 text-center hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Receba Seus Resultados</h3>
                <p className="text-gray-600 mb-4">
                  Baixe sua carta natal em SVG e um relatório completo em PDF com interpretações detalhadas.
                </p>
                <div className="flex justify-center space-x-2">
                  <Download className="text-[#3FCFF9]" size={20} />
                  <ChartPie className="text-[#88ff47]" size={20} />
                  <Stars className="text-[#3FCFF9]" size={20} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Details */}
          <Card className="mt-12 glass-card rounded-2xl border-white/30">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="text-[#3FCFF9] mr-2" size={24} />
                    Privacidade e Segurança
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="text-[#88ff47] mr-2" size={16} />
                      Nenhum dado pessoal armazenado
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-[#88ff47] mr-2" size={16} />
                      Processamento server-side seguro
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-[#88ff47] mr-2" size={16} />
                      Conformidade com LGPD
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Rocket className="text-[#88ff47] mr-2" size={24} />
                    Performance
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CloudLightning className="text-[#3FCFF9] mr-2" size={16} />
                      Geração em menos de 5 segundos
                    </li>
                    <li className="flex items-center">
                      <CloudLightning className="text-[#3FCFF9] mr-2" size={16} />
                      API Astrologer profissional
                    </li>
                    <li className="flex items-center">
                      <CloudLightning className="text-[#3FCFF9] mr-2" size={16} />
                      Otimizado para mobile
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card rounded-3xl border-white/30 text-center">
            <CardContent className="p-8 md:p-12">
              {/* Professional headshot placeholder */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] p-1">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="text-gray-400" size={48} />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
                Psicóloga Em Outra Dimensão
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Combinando conhecimento astrológico ancestral com tecnologia moderna, oferecemos uma ferramenta 
                única para autoconhecimento e desenvolvimento pessoal. Nossa missão é democratizar o acesso 
                à astrologia profissional.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3FCFF9]/20 flex items-center justify-center">
                    <Award className="text-[#3FCFF9]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Precisão</h3>
                  <p className="text-sm text-gray-600">Cálculos astronômicos exatos</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#88ff47]/20 flex items-center justify-center">
                    <Heart className="text-[#88ff47]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Acessibilidade</h3>
                  <p className="text-sm text-gray-600">Gratuito para todos</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#3FCFF9]/20 flex items-center justify-center">
                    <Wand2 className="text-[#3FCFF9]" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Intuição</h3>
                  <p className="text-sm text-gray-600">Interface intuitiva</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Button 
                  onClick={() => scrollToSection('generator')}
                  className="cosmic-button text-white hover:scale-105 transition-all shadow-lg"
                >
                  <Stars className="mr-2" size={20} />
                  Comece Sua Jornada
                </Button>
                <Button 
                  variant="outline"
                  className="glass-card border border-[#88ff47] text-gray-700 hover:bg-[#88ff47]/20 hover:text-gray-800 transition-all hover:scale-105"
                  onClick={() => window.open('mailto:contato@psicologaemoutradimensao.com')}
                >
                  <Mail className="mr-2" size={20} />
                  Entre em Contato
                </Button>
              </div>
              
              {/* Interactive Zodiac Ring */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Explore os Signos do Zodíaco</h3>
                <ZodiacRing className="mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-card rounded-2xl border-white/30">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3FCFF9] to-[#88ff47] flex items-center justify-center">
                      <Stars className="text-white" size={16} />
                    </div>
                    <h3 className="font-bold text-gray-800 font-serif">Psicóloga Em Outra Dimensão</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Democratizando o acesso à astrologia profissional através da tecnologia.
                  </p>
                  <div className="flex space-x-3">
                    <button className="w-8 h-8 rounded-full bg-[#3FCFF9]/20 flex items-center justify-center text-[#3FCFF9] hover:bg-[#3FCFF9]/30 transition-all">
                      <Instagram size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#88ff47]/20 flex items-center justify-center text-[#88ff47] hover:bg-[#88ff47]/30 transition-all">
                      <Youtube size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Links Úteis</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <button 
                        onClick={() => scrollToSection('generator')}
                        className="hover:text-[#3FCFF9] transition-colors"
                      >
                        Gerar Mapa
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => scrollToSection('how-it-works')}
                        className="hover:text-[#3FCFF9] transition-colors"
                      >
                        Como Funciona
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => scrollToSection('about')}
                        className="hover:text-[#3FCFF9] transition-colors"
                      >
                        Sobre
                      </button>
                    </li>
                    <li>
                      <button className="hover:text-[#3FCFF9] transition-colors">FAQ</button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Suporte</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <button className="hover:text-[#3FCFF9] transition-colors">Política de Privacidade</button>
                    </li>
                    <li>
                      <button className="hover:text-[#3FCFF9] transition-colors">Termos de Uso</button>
                    </li>
                    <li>
                      <button 
                        onClick={() => window.open('mailto:contato@psicologaemoutradimensao.com')}
                        className="hover:text-[#3FCFF9] transition-colors"
                      >
                        Contato
                      </button>
                    </li>
                    <li>
                      <button className="hover:text-[#3FCFF9] transition-colors">Relatório de Bug</button>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-white/20 mt-8 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  © 2024 Psicóloga Em Outra Dimensão. Todos os direitos reservados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>

      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
