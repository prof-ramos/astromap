import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBirthDataSchema, type InsertBirthData, type ChartGenerationResponse, type AstralChart } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Clock, MapPin, Info, Stars, ChevronRight, ChevronLeft } from "lucide-react";
import { detectTimezone, formatTimezone } from "@/lib/timezone";
import { Progress } from "@/components/ui/progress";

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

  // Wizard state
  const steps = useMemo(
    () => [
      { id: 1, title: "Identificação" },
      { id: 2, title: "Data e Hora" },
      { id: 3, title: "Local e Fuso" },
      { id: 4, title: "Gerar" },
    ],
    []
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = steps.length;
  const progressValue = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // auto detect timezone on mount
    const tz = detectTimezone();
    form.setValue("timezone", tz);
  }, [form]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
    <Card className="glass-card rounded-2xl border-white/30" aria-labelledby="form-title">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#3FCFF9]/20 flex items-center justify-center mr-3">
                <User className="text-[#3FCFF9]" size={20} />
              </div>
              <h3 id="form-title" className="text-xl font-semibold text-gray-800">Dados de Nascimento</h3>
            </div>
            <span className="text-sm text-gray-600" aria-live="polite">Etapa {currentStep} de {totalSteps}</span>
          </div>
          <Progress value={progressValue} aria-label="Progresso do formulário" />
          <div className="mt-2 flex gap-2 text-xs text-gray-600" aria-hidden>
            {steps.map((s) => (
              <span key={s.id} className={`flex-1 text-center ${currentStep === s.id ? 'text-[#3FCFF9] font-medium' : ''}`}>{s.title}</span>
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
          {currentStep === 1 && (
            <div role="group" aria-labelledby="step-1-title" className="space-y-6">
              <h4 id="step-1-title" className="sr-only">Identificação</h4>
              <InputGroup
                name="name"
                type="text"
                placeholder="Digite seu nome completo"
                label="Nome Completo"
                icon={User}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div role="group" aria-labelledby="step-2-title" className="space-y-6">
              <h4 id="step-2-title" className="sr-only">Data e Hora</h4>
              <InputGroup
                name="birthDate"
                type="date"
                placeholder="Selecione sua data de nascimento"
                label="Data de Nascimento"
                icon={Calendar}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup
                  name="birthTime"
                  type="time"
                  placeholder="Selecione sua hora de nascimento"
                  label="Hora de Nascimento"
                  icon={Clock}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => form.setValue('birthTime', '12:00')}
                    aria-label="Não sei a hora exata"
                  >
                    Não sei a hora
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div role="group" aria-labelledby="step-3-title" className="space-y-6">
              <h4 id="step-3-title" className="sr-only">Local e Fuso</h4>
              <InputGroup
                name="birthCity"
                type="text"
                placeholder="Ex: São Paulo, SP"
                label="Cidade de Nascimento"
                icon={MapPin}
              />

              <Card className="glass-card bg-[#3FCFF9]/10 border-[#3FCFF9] rounded-xl" aria-live="polite">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Info className="text-[#3FCFF9] mr-2" size={16} />
                    <span className="text-sm text-gray-700">
                      Fuso horário detectado automaticamente: <strong>{formatTimezone(form.watch('timezone'))}</strong>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4" aria-live="polite">
              <p className="text-sm text-gray-700">Revise seus dados antes de gerar o mapa:</p>
              <ul className="text-sm text-gray-800 space-y-1">
                <li><strong>Nome:</strong> {form.watch('name') || '—'}</li>
                <li><strong>Data:</strong> {form.watch('birthDate') || '—'}</li>
                <li><strong>Hora:</strong> {form.watch('birthTime') || '—'}</li>
                <li><strong>Cidade:</strong> {form.watch('birthCity') || '—'}</li>
                <li><strong>Fuso:</strong> {formatTimezone(form.watch('timezone'))}</li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || generateChartMutation.isPending}
              className="flex-1"
            >
              <ChevronLeft className="mr-2" size={16} /> Voltar
            </Button>
            {currentStep < totalSteps && (
              <Button
                type="button"
                onClick={async () => {
                  // validate visible fields lightly before next
                  let fieldsToValidate: (keyof InsertBirthData)[] = [];
                  if (currentStep === 1) fieldsToValidate = ['name'];
                  if (currentStep === 2) fieldsToValidate = ['birthDate', 'birthTime'];
                  if (currentStep === 3) fieldsToValidate = ['birthCity'];
                  const isValid = await form.trigger(fieldsToValidate);
                  if (isValid) handleNext();
                }}
                className="flex-1"
              >
                Continuar <ChevronRight className="ml-2" size={16} />
              </Button>
            )}
            {currentStep === totalSteps && (
              <Button 
                type="submit" 
                disabled={generateChartMutation.isPending}
                className="flex-[2] cosmic-button text-white py-4 font-semibold hover:shadow-lg transition-all hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#3FCFF9]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={generateChartMutation.isPending}
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
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
