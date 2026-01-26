"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Scissors, User, Mail, Phone, FileText, Lock, MapPin, Briefcase, Calendar, Clock, Home, Loader2 } from "lucide-react";

export default function CadastroPage() {
  // Campos obrigatórios
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [specialty, setSpecialty] = useState("cabeleireiro");
  const [experience, setExperience] = useState("");
  const [instagram, setInstagram] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cityState, setCityState] = useState("");
  const [number, setNumber] = useState("");
  const [hasSchedule, setHasSchedule] = useState("");
  
  // Campo select
  const [workType, setWorkType] = useState("proprio");
  
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidInvite, setIsValidInvite] = useState(false);
  
  const numberInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 1. CAPTURA DO CÓDIGO DE REFERÊNCIA DA URL (?ref=...) E VALIDAÇÃO DE CONVITE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      
      // Verifica se existe ref na URL OU masc_referrer no localStorage
      const hasRefInUrl = !!refCode;
      const hasRefInStorage = !!localStorage.getItem("masc_referrer");
      
      if (hasRefInUrl) {
        localStorage.setItem("masc_referrer", refCode);
        console.log("Código de referência salvo no localStorage:", refCode);
        // Limpa a URL para ficar profissional
        window.history.replaceState({}, '', window.location.pathname);
        setIsValidInvite(true);
      } else if (hasRefInStorage) {
        setIsValidInvite(true);
      } else {
        setIsValidInvite(false);
      }
    }
  }, []);

  // Função para aplicar máscara de CEP
  const maskCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para aplicar máscara de WhatsApp
  const maskPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função para buscar CEP via ViaCEP
  const fetchCEP = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      return;
    }
    
    if (loadingCep) return;
    
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.erro) {
        console.warn("CEP não encontrado:", cleanCep);
        return;
      }
      
      // Preenche os campos automaticamente (exceto número)
      if (data.logradouro) {
        setRua(data.logradouro);
      }
      if (data.bairro) {
        setBairro(data.bairro);
      }
      if (data.localidade && data.uf) {
        setCityState(`${data.localidade}/${data.uf}`);
      }
      
      // Move o foco para o campo número
      setTimeout(() => {
        numberInputRef.current?.focus();
      }, 200);
    } catch (error: any) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoadingCep(false);
    }
  };

  // Handler para mudança de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setCep(masked);
    
    // Busca automática quando completa 8 dígitos
    const cleanCep = masked.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchCEP(masked);
    }
  };

  // Handler para blur do CEP
  const handleCepBlur = () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchCEP(cep);
    }
  };

  // Handler para mudança de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. RESGATE DO PADRINHO: OBRIGATORIAMENTE lê do localStorage
      const referrerId = typeof window !== "undefined" ? localStorage.getItem("masc_referrer") : null;
      console.log("Código de referência lido do localStorage:", referrerId);

      // 2. PREPARAÇÃO DOS DADOS: Monta objeto updates com TODOS os campos incluindo endereço completo
      const updates: any = {
        full_name: fullName,
        phone: phone,
        cpf: cpf,
        specialty: specialty,
        experience: experience,
        instagram: instagram,
        rua: rua,
        bairro: bairro,
        cep: cep,
        number: number,
        city_state: cityState,
        work_type: workType,
        has_schedule: hasSchedule === "sim", // Converte para boolean
        invited_by: referrerId, // OBRIGATORIAMENTE envia o código de referência para a coluna invited_by
        coins: 50,
        updated_at: new Date().toISOString(),
      };

      // 3. FLUXO DE ENVIO: Faz o signUp no Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Se der erro de 'User already registered', prossegue (caso do usuário zumbi)
      if (signUpError && signUpError.message !== "User already registered") {
        throw signUpError;
      }

      // Obtém o ID do usuário (do signUp ou da sessão atual se já existir)
      let userId: string;
      if (authData?.user) {
        userId = authData.user.id;
      } else {
        // Se o usuário já existe, busca da sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("Erro ao obter ID do usuário");
        }
        userId = session.user.id;
      }

      // Logo em seguida, força a atualização dos dados
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        throw updateError;
      }

      // Limpa o indicador do navegador após o sucesso
      if (referrerId) {
        localStorage.removeItem("masc_referrer");
      }

      // 4. REDIRECIONAMENTO: Se tudo der certo, manda para /onboarding
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setError(err.message || "Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para recarregar a página (limpa a URL)
  const handleReload = () => {
    window.location.href = window.location.pathname;
  };

  // Tela de Bloqueio (quando não há convite válido)
  if (!isValidInvite) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              MASC<span className="text-[#C9A66B]">PRO</span>
            </h1>
          </div>

          {/* Card de Bloqueio */}
          <div className="bg-[#0A0A0A] border border-[#C9A66B]/20 rounded-3xl p-8 space-y-6 text-center">
            {/* Ícone de Cadeado Dourado */}
            <div className="flex justify-center">
              <div className="bg-[#C9A66B]/10 border-2 border-[#C9A66B]/30 rounded-full p-6">
                <Lock size={64} className="text-[#C9A66B]" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-black text-[#C9A66B] uppercase tracking-tight">
              Convite Necessário
            </h2>

            {/* Texto Explicativo */}
            <p className="text-slate-300 text-sm leading-relaxed">
              O MASC PRO é uma comunidade exclusiva. Para se cadastrar, você precisa de um Link de Convite válido de um Distribuidor ou Membro.
            </p>

            {/* Botão */}
            <button
              onClick={handleReload}
              className="w-full bg-[#C9A66B] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all mt-4"
            >
              Já tenho um link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Cabeçalho */}
        <div className="text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            MASC<span className="text-[#C9A66B]">PRO</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Crie sua conta como profissional Masc Pro</p>
        </div>

        {/* Container do Formulário (Estilo da Foto) */}
        <form onSubmit={handleSignUp} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* Qual seu Perfil? (Especialidade) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Qual seu Perfil?</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Scissors size={18} />
              </div>
              <select 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-[#C9A66B] transition-all appearance-none cursor-pointer"
              >
                <option value="cabeleireiro">Sou Cabeleireiro(a)</option>
                <option value="barbeiro">Sou Barbeiro(a)</option>
                <option value="esteticista">Sou Esteticista</option>
                <option value="manicure">Sou Manicure/Pedicure</option>
                <option value="outro">Outro</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A66B] pointer-events-none w-5 h-5" />
            </div>
          </div>

          {/* Nome Completo */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <User size={18} />
              </div>
              <input
                type="text" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="Nome"
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Instagram</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-bold">@</div>
              <input
                type="text" 
                required 
                value={instagram} 
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="instagram profissional"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Phone size={18} />
              </div>
              <input
                type="tel" 
                required 
                value={phone} 
                onChange={handlePhoneChange}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          {/* CPF */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">CPF</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <FileText size={18} />
              </div>
              <input
                type="text" 
                required 
                value={cpf} 
                onChange={(e) => setCpf(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="******"
              />
            </div>
          </div>

          {/* Tempo de Experiência */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tempo de Experiência</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Clock size={18} />
              </div>
              <input
                type="text" 
                required 
                value={experience} 
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="Ex: 5 anos"
              />
            </div>
          </div>

          {/* CEP - Primeiro campo de endereço */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">CEP</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <MapPin size={18} />
              </div>
              <input
                type="text" 
                required 
                value={cep} 
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCep && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-[#C9A66B]" />
                </div>
              )}
            </div>
          </div>

          {/* Endereço (Rua) - Largura total */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Endereço (Rua)</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Home size={18} />
              </div>
              <input
                type="text" 
                required 
                value={rua} 
                onChange={(e) => setRua(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="Nome da rua"
              />
            </div>
          </div>

          {/* Número e Bairro lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            {/* Número */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Número</label>
              <div className="relative">
                <input
                  ref={numberInputRef}
                  type="text" 
                  required 
                  value={number} 
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-4 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                  placeholder="123"
                />
              </div>
            </div>

            {/* Bairro */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bairro</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <MapPin size={18} />
                </div>
                <input
                  type="text" 
                  required 
                  value={bairro} 
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                  placeholder="Nome do bairro"
                />
              </div>
            </div>
          </div>

          {/* Cidade/Estado */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cidade/Estado</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <MapPin size={18} />
              </div>
              <input
                type="text" 
                required 
                value={cityState} 
                onChange={(e) => setCityState(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C9A66B] transition-all"
                placeholder="Ex: São Paulo/SP"
              />
            </div>
          </div>

          {/* Tipo de Atuação */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tipo de Atuação</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Briefcase size={18} />
              </div>
              <select 
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-[#C9A66B] transition-all appearance-none cursor-pointer"
              >
                <option value="proprio">Salão Próprio</option>
                <option value="aluguel">Aluga Cadeira</option>
                <option value="comissao">Comissionado</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A66B] pointer-events-none w-5 h-5" />
            </div>
          </div>

          {/* Possui Agenda Online? */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Possui Agenda Online?</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Calendar size={18} />
              </div>
              <select 
                required
                value={hasSchedule} 
                onChange={(e) => setHasSchedule(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-[#C9A66B] transition-all appearance-none cursor-pointer"
              >
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A66B] pointer-events-none w-5 h-5" />
            </div>
          </div>

          {/* Botão Finalizar Cadastro */}
          <button
            type="submit" 
            disabled={loading}
            className="w-full bg-[#C9A66B] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        {/* Link de Login */}
        <p className="text-center text-slate-400 text-sm">
          Já tem conta? <Link href="/login" className="text-[#C9A66B] font-bold hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}