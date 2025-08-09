import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBirthDataSchema, type InsertBirthData, type ChartGenerationResponse, type AstralChart } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Clock, MapPin, Info, Stars } from "lucide-react";
import { detectTimezone, formatTimezone } from "@/lib/timezone";

interface BirthDataFormProps {
  onSubmit: () => void;
  onSuccess: (chart: AstralChart) => void;
  onError: () => void;
}

export function BirthDataForm({ onSubmit, onSuccess, onError }: BirthDataFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertBirthData>({
    resolver: zodResolver(insertBirthDataSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthCity: "",
      timezone: "America/Sao_Paulo"
    }
  });

  const generateChartMutation = useMutation({
    mutationFn: async (data: InsertBirthData) => {
      const response = await apiRequest("POST", "/api/generate-chart", data);
      return await response.json() as ChartGenerationResponse;
    },
    onSuccess: (data) => {
      if (data.success && data.chart) {
        onSuccess(data.chart);
        toast({
          title: "Mapa Astral Gerado!",
          description: "Seu mapa astral foi gerado com sucesso. Você pode fazer o download agora."
        });
      } else {
        onError();
        toast({
          title: "Erro na Geração",
          description: data.error || "Ocorreu um erro ao gerar o mapa astral",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      onError();
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar com o servidor. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: InsertBirthData) => {
    onSubmit();
    generateChartMutation.mutate(data);
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const InputGroup = ({ 
    name, 
    type, 
    placeholder, 
    label, 
    icon: Icon, 
    required = true 
  }: {
    name: keyof InsertBirthData;
    type: string;
    placeholder: string;
    label: string;
    icon: any;
    required?: boolean;
  }) => {
    const fieldValue = form.watch(name);
    const hasValue = fieldValue && fieldValue.toString().length > 0;
    const isFocused = focusedField === name;
    const error = form.formState.errors[name];

    return (
      <div className="input-group relative">
        <label 
          className={`floating-label absolute transition-all duration-300 pointer-events-none ${
            isFocused || hasValue 
              ? 'top-1 left-3 text-xs text-[#3FCFF9] font-medium transform scale-85' 
              : 'top-3.5 left-3 text-gray-600'
          }`}
        >
          {label}
        </label>
        <Input
          {...form.register(name)}
          type={type}
          placeholder={isFocused ? placeholder : ""}
          className={`glass-input pt-6 pb-2 px-3 text-gray-800 ${error ? 'border-red-500' : ''}`}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          required={required}
        />
        <div className="absolute right-3 top-4 text-gray-400">
          <Icon size={20} />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1 ml-3">{error.message}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="glass-card rounded-2xl border-white/30">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-[#3FCFF9]/20 flex items-center justify-center mr-3">
            <User className="text-[#3FCFF9]" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Dados de Nascimento</h3>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <InputGroup
            name="name"
            type="text"
            placeholder="Digite seu nome completo"
            label="Nome Completo"
            icon={User}
          />

          <InputGroup
            name="birthDate"
            type="date"
            placeholder="Selecione sua data de nascimento"
            label="Data de Nascimento"
            icon={Calendar}
          />

          <InputGroup
            name="birthTime"
            type="time"
            placeholder="Selecione sua hora de nascimento"
            label="Hora de Nascimento"
            icon={Clock}
          />

          <InputGroup
            name="birthCity"
            type="text"
            placeholder="Ex: São Paulo, SP"
            label="Cidade de Nascimento"
            icon={MapPin}
          />

          {/* Timezone Info */}
          <Card className="glass-card bg-[#3FCFF9]/10 border-[#3FCFF9] rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Info className="text-[#3FCFF9] mr-2" size={16} />
                <span className="text-sm text-gray-700">
                  Fuso horário detectado automaticamente: <strong>America/Sao_Paulo (UTC-3)</strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            type="submit" 
            disabled={generateChartMutation.isPending}
            className="cosmic-button w-full text-white py-4 font-semibold hover:shadow-lg transition-all hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#3FCFF9]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateChartMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Gerando Mapa...
              </>
            ) : (
              <>
                <Stars className="mr-2" size={18} />
                Gerar Mapa Astral
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
