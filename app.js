const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

// Design System Colors
const C = {
  bg: "#0A0908",
  bg2: "#0F0D0B",
  panel: "#16130F",
  panel2: "#1C1712",
  border: "#2E2519",
  borderSoft: "#221C15",
  orange: "#FF6A13",
  orangeDeep: "#C94E0A",
  cream: "#F3EEE3",
  creamDim: "#C9C1AF",
  blue: "#4FB3E8",
  blueDeep: "#1E4C63",
  muted: "#8C8375",
  red: "#D6483F",
  green: "#5FA96B",
  yellow: "#E0B34C",
  purple: "#8B6FD6"
};

// Primary Attributes
const ATTRS = [{
  key: "pressao",
  label: "Pressão Espiritual",
  color: C.blue,
  desc: "Reiatsu, controle espiritual e percepção"
}, {
  key: "forca",
  label: "Força",
  color: C.red,
  desc: "Potência física, Zanjutsu e Hakuda"
}, {
  key: "velocidade",
  label: "Velocidade",
  color: C.green,
  desc: "Deslocamento, reflexos e Hohō/Shunpo"
}, {
  key: "resiliencia",
  label: "Resiliência",
  color: C.purple,
  desc: "Resistência física, espiritual e vitalidade"
}];
const ATTRS_FISICOS = ["forca", "velocidade", "resiliencia"];
const CATEGORIAS_TECNICA = ["Hadō", "Bakudō", "Kaidō", "Zanjutsu", "Hakuda", "Hohō", "Outro"];
const ESTADOS = [{
  key: "Inteiro",
  color: C.green,
  label: "Condição Normal"
}, {
  key: "Ferido",
  color: C.yellow,
  label: "Com Danos"
}, {
  key: "Debilitado",
  color: C.orangeDeep,
  label: "Gravemente Prejudicado"
}, {
  key: "Derrotado",
  color: C.red,
  label: "Incapacitado"
}];
const TIPOS_RECOMPENSA = ["Treino em ON (30 linhas)", "Missão Principal (Garantido 15 pts + Giros)", "Miscelânea", "Cena de Arco (90 linhas / 15 pts + Giros)", "Combate em ON", "Sorteio Gacha Comum", "Sorteio Especial", "Avaliação de Cenas (ADM)", "Avaliação de Fichas (ADM)", "Outro"];

// Gacha Rarities & Pools
const RARIDADES_COMUNS = [{
  nome: "Comum",
  peso: 50,
  min: 1,
  max: 3,
  cor: C.muted,
  desc: "+1 a +3 Pontos de Atributo ou recurso menor",
  tipo: "pontos"
}, {
  nome: "Incomum",
  peso: 30,
  min: 3,
  max: 6,
  cor: C.green,
  desc: "+3 a +6 Pontos de Atributo ou Kidō Básico",
  tipo: "pontos"
}, {
  nome: "Rara",
  peso: 14,
  min: 6,
  max: 10,
  cor: C.blue,
  desc: "+6 a +10 Pontos de Atributo ou Técnica Intermediária",
  tipo: "pontos"
}, {
  nome: "Épica",
  peso: 5,
  min: 10,
  max: 15,
  cor: C.purple,
  desc: "+10 a +15 Pontos de Atributo ou Aprimoramento Espiritual",
  tipo: "pontos"
}, {
  nome: "Lendária",
  peso: 1,
  min: 15,
  max: 22,
  cor: C.yellow,
  desc: "+15 a +22 Pontos ou Despertar de Linhagem",
  tipo: "pontos"
}];
const RECOMPENSAS_ESPECIAIS = [{
  id: "esp-1",
  nome: "✨ Super Bônus Espiritual (+25 Pontos Livres)",
  raridade: "Lendária",
  cor: C.yellow,
  desc: "Uma explosão maciça de Reiryoku que concede 25 pontos livres para distribuir!",
  tipo: "pontos",
  valor: 25
}, {
  id: "esp-2",
  nome: "📜 Kidō Secreto Classe Especial (Hadō #88 / Bakudō #79)",
  raridade: "Lendária",
  cor: C.purple,
  desc: "Um pergaminho proibido contendo uma fórmula de Kidō de Classe Especial!",
  tipo: "kido",
  valor: 0
}, {
  id: "esp-3",
  nome: "⚔️ Despertar de Habilidade Shikai Única",
  raridade: "Lendária",
  cor: C.orange,
  desc: "Comunicação profunda com sua Zanpakutō desbloqueando uma técnica autoral de Shikai!",
  tipo: "habilidade",
  valor: 10
}, {
  id: "esp-4",
  nome: "🌟 MISSÃO NARRATIVA INDIVIDUAL — DESPERTAR DE PODER (Prêmio Máximo do RPG)",
  raridade: "Transcendente",
  cor: "#FFFFFF",
  desc: "O PRÊMIO MAIS DIFÍCIL E COBIÇADO DO RPG! Uma missão narrativa exclusiva para o seu personagem guiada pela administração para romper todos os limites e despertar um poder único!",
  tipo: "missao_despertar",
  valor: 30
}];

// Official Kidō Catalog
const CATALOGO_KIDOS = [
// HADŌ (Ataque/Destruição)
{
  id: "h1",
  numero: 1,
  nome: "Shō",
  cat: "Hadō",
  custoReiatsu: 2,
  nivel: "Básico",
  desc: "Dispara uma força cinética invisível a partir da ponta do dedo para repelir o alvo.",
  incant: "—"
}, {
  id: "h4",
  numero: 4,
  nome: "Byakurai",
  cat: "Hadō",
  custoReiatsu: 3,
  nivel: "Básico",
  desc: "Dispara um raio concentrado de eletricidade branca penetrante a partir do dedo indicador.",
  incant: "—"
}, {
  id: "h11",
  numero: 11,
  nome: "Tsuzuri Raiden",
  cat: "Hadō",
  custoReiatsu: 4,
  nivel: "Básico",
  desc: "Canaliza uma corrente elétrica através de qualquer objeto condutor ou lâmina da Zanpakutō.",
  incant: "—"
}, {
  id: "h31",
  numero: 31,
  nome: "Shakkahō",
  cat: "Hadō",
  custoReiatsu: 6,
  nivel: "Intermediário",
  desc: "Gera e dispara uma esfera de chamas vermelhas de alta potência e raio explosivo.",
  incant: "Ó, praticante! Dispersai-vos, rastejai! Queimai a terra e tragai a cinza!"
}, {
  id: "h33",
  numero: 33,
  nome: "Sōkatsui",
  cat: "Hadō",
  custoReiatsu: 7,
  nivel: "Intermediário",
  desc: "Dispara uma torrente avassaladora de energia espiritual azul a partir da palma aberta.",
  incant: "Ó, governante! Máscara de carne e sangue, toda a criação, o bater de asas..."
}, {
  id: "h54",
  numero: 54,
  nome: "Haien",
  cat: "Hadō",
  custoReiatsu: 10,
  nivel: "Avançado",
  desc: "Dispara uma onda de fogo roxo que incinera e desintegra a matéria ao menor contato.",
  incant: "—"
}, {
  id: "h63",
  numero: 63,
  nome: "Raikōhō",
  cat: "Hadō",
  custoReiatsu: 13,
  nivel: "Avançado",
  desc: "Invoca um gigantesco trovão amarelo concentrado que explode com estrondo sísmico.",
  incant: "Salpicado nos ossos da besta! Torre afiada, cristal vermelho, anel de aço..."
}, {
  id: "h73",
  numero: 73,
  nome: "Sōren Sōkatsui",
  cat: "Hadō",
  custoReiatsu: 16,
  nivel: "Mestre",
  desc: "Versão dupla e devastadora do Sōkatsui disparada com ambas as mãos em sincronia.",
  incant: "Máscara de carne e sangue... Coroai com o nome de humano o abismo sem fim!"
}, {
  id: "h88",
  numero: 88,
  nome: "Hiryū Gekizoku Shinten Raihō",
  cat: "Hadō",
  custoReiatsu: 20,
  nivel: "Classe Especial",
  desc: "Um colossal canhão de relâmpagos espirituais capaz de perfurar fortalezas inteiras.",
  incant: "Rugido do dragão celeste, queime o firmamento até a última partícula!"
}, {
  id: "h90",
  numero: 90,
  nome: "Kurohitsugi (Caixão Negro)",
  cat: "Hadō",
  custoReiatsu: 25,
  nivel: "Classe Especial",
  desc: "Cria uma caixa cúbica de gravidade negra ao redor do alvo perfurando-o com incontáveis lanças espirituais.",
  incant: "Transborde, recipiente do caos! Cão louco e insolente, perca a razão..."
},
// BAKUDŌ (Aprisionamento/Restrição/Defesa)
{
  id: "b1",
  numero: 1,
  nome: "Sai",
  cat: "Bakudō",
  custoReiatsu: 2,
  nivel: "Básico",
  desc: "Prende os braços do alvo atrás das costas com uma força magnética invisível.",
  incant: "—"
}, {
  id: "b4",
  numero: 4,
  nome: "Hainawa",
  cat: "Bakudō",
  custoReiatsu: 3,
  nivel: "Básico",
  desc: "Gera uma corda de energia crepitante amarela que amarra o corpo do oponente.",
  incant: "—"
}, {
  id: "b8",
  numero: 8,
  nome: "Seki",
  cat: "Bakudō",
  custoReiatsu: 3,
  nivel: "Básico",
  desc: "Cria um escudo redondo e brilhante no antebraço que repele projéteis e atordoa o atacante.",
  incant: "—"
}, {
  id: "b26",
  numero: 26,
  nome: "Kyokkō",
  cat: "Bakudō",
  custoReiatsu: 5,
  nivel: "Intermediário",
  desc: "Dobra a luz e a percepção de Reiatsu ao redor do usuário, tornando-o completamente invisível.",
  incant: "—"
}, {
  id: "b39",
  numero: 39,
  nome: "Enkōsen",
  cat: "Bakudō",
  custoReiatsu: 7,
  nivel: "Intermediário",
  desc: "Cria um condensado escudo de energia condensada giratória para absorver ataques diretos.",
  incant: "—"
}, {
  id: "b61",
  numero: 61,
  nome: "Rikujō Kōrō",
  cat: "Bakudō",
  custoReiatsu: 12,
  nivel: "Avançado",
  desc: "Seis lâminas reluzentes de luz dourada surgem e perfuram a cintura do alvo, paralisando-o totalmente.",
  incant: "Carruagem do trovão, ponte da roda giratória, com a luz divida em seis!"
}, {
  id: "b62",
  numero: 62,
  nome: "Hyapporankan",
  cat: "Bakudō",
  custoReiatsu: 13,
  nivel: "Avançado",
  desc: "Uma vara de luz se multiplica em uma centena de estacas lançadas para cravar o oponente no chão.",
  incant: "—"
}, {
  id: "b75",
  numero: 75,
  nome: "Gochūtekkan",
  cat: "Bakudō",
  custoReiatsu: 16,
  nivel: "Mestre",
  desc: "Invoca cinco gigantescos pilares de ferro conectados por correntes que esmagam o alvo.",
  incant: "Muralha de areia de ferro, torre de monge, lâmpada de ferro incandescente!"
}, {
  id: "b81",
  numero: 81,
  nome: "Dankū",
  cat: "Bakudō",
  custoReiatsu: 18,
  nivel: "Mestre",
  desc: "Ergue uma barreira translúcida gigantesca que anula completamente qualquer Kidō de Hadō até o #89.",
  incant: "—"
}, {
  id: "b99",
  numero: 99,
  nome: "Kin (Parte 1 / Bankin)",
  cat: "Bakudō",
  custoReiatsu: 25,
  nivel: "Classe Especial",
  desc: "O selamento supremo da Sociedade das Almas em três fases: ataduras, estacas e bloco monumental.",
  incant: "Primeira Canção: Shiryū! Segunda Canção: Hyakurenzan! Canção Final: Bankin Taihō!"
},
// KAIDŌ (Cura/Restauração)
{
  id: "k1",
  numero: 1,
  nome: "Kaidō — Tratamento de Tecidos",
  cat: "Kaidō",
  custoReiatsu: 4,
  nivel: "Básico",
  desc: "Cura cortes superficiais, fecha feridas leves e estanca sangramentos rápidos.",
  incant: "—"
}, {
  id: "k2",
  numero: 2,
  nome: "Kaidō — Revitalização de Reiatsu",
  cat: "Kaidō",
  custoReiatsu: 7,
  nivel: "Intermediário",
  desc: "Canaliza energia restaurativa para aliviar fadiga e recuperar o fluxo de pressão espiritual.",
  incant: "—"
}, {
  id: "k3",
  numero: 3,
  nome: "Kaidō — Sutura Espiritual Avançada",
  cat: "Kaidō",
  custoReiatsu: 12,
  nivel: "Avançado",
  desc: "Restaura ossos fraturados, estende a integridade do hakusui e reverte estado Debilitado.",
  incant: "—"
}, {
  id: "k4",
  numero: 4,
  nome: "Kaidō — Milagre do 4º Esquadrão",
  cat: "Kaidō",
  custoReiatsu: 20,
  nivel: "Mestre",
  desc: "Regeneração emergencial intensiva capaz de salvar um Shinigami à beira do estado Derrotado.",
  incant: "Que a essência da vida reencontre a fonte pura da alma."
}];

// Shikai / Bankai Generator Templates for AI
const ZANPAKUTO_ELEMENTS = [{
  el: "Fogo / Chamas Espirituais",
  verbos: ["Queime", "Incinere", "Reduza a cinzas", "Fulmine"],
  sufixos: ["Homura", "Kagutsuchi", "Engetsu", "Guren", "Hi no Tsume"]
}, {
  el: "Gelo / Vento Congelante",
  verbos: ["Congele", "Dance no gelo", "Petrifique", "Resplandeça"],
  sufixos: ["Shirayuki", "Hyōrinmaru", "Fubuki", "Kōri", "Setsuna"]
}, {
  el: "Relâmpago / Trovão Rápido",
  verbos: ["Troveje", "Rasure o céu", "Desperte", "Fenda"],
  sufixos: ["Raikiri", "Denkō", "Narukami", "Ikazuchi", "Jinrai"]
}, {
  el: "Sombra / Ilusão e Névoa",
  verbos: ["Engula", "Enegreça", "Engane", "Oculte"],
  sufixos: ["Kagebōshi", "Kasumi", "Kurayami", "Kyōka", "Yami"]
}, {
  el: "Aço Puro / Gravidade e Impacto",
  verbos: ["Esmague", "Destroce", "Pese", "Corte"],
  sufixos: ["Zangetsu", "Wabisuke", "Tekken", "Gōken", "Zantetsu"]
}, {
  el: "Veneno / Corrosão Espiritual",
  verbos: ["Corroa", "Pique", "Dissolva", "Sussurre"],
  sufixos: ["Ashisogi", "Suzumebachi", "Dokugan", "Kyodai", "Jakuhō"]
}];
function gerarOpcoesZanpakutoAI(nomePersonagem, tema, tipo = "shikai") {
  const opcoes = [];
  const usados = new Set();
  while (opcoes.length < 4) {
    const elemObj = ZANPAKUTO_ELEMENTS[Math.floor(Math.random() * ZANPAKUTO_ELEMENTS.length)];
    const comando = elemObj.verbos[Math.floor(Math.random() * elemObj.verbos.length)];
    const sufixo = elemObj.sufixos[Math.floor(Math.random() * elemObj.sufixos.length)];
    const nomeZk = `${sufixo}`;
    if (usados.has(nomeZk)) continue;
    usados.add(nomeZk);
    if (tipo === "shikai") {
      opcoes.push({
        id: uid(),
        nome: nomeZk,
        comando: `${comando}, ${nomeZk}!`,
        elemento: elemObj.el,
        habilidade: `Ao liberar a Shikai com o comando "${comando}", a lâmina manifesta o poder de ${elemObj.el.toLowerCase()}. Aumenta o alcance dos golpes e adiciona efeitos temáticos de impacto espiritual durante as trocas de combate.`,
        detalheEstetico: `A forma da espada se transforma em uma lâmina de fio estilizado com padrões gravados brilhando em tonalidade temática.`
      });
    } else {
      const nomeBankai = `Bankai: Kokujō ${nomeZk} Daizō`;
      opcoes.push({
        id: uid(),
        nome: nomeBankai,
        comando: `Bankai — ${nomeBankai}!`,
        elemento: elemObj.el,
        habilidade: `A liberação completa materializa uma entidade colossal ou expansão de domínio no campo de batalha. O poder destrutivo de ${elemObj.el.toLowerCase()} escala a níveis capazes de alterar o clima e a pressão atmosférica do local.`,
        detalheEstetico: `O Shinigami é envolvido por vestes e armaduras de pura Reiatsu enquanto o terreno é completamente transformado.`
      });
    }
  }
  return opcoes;
}

// Power Tier Calculator
function getPowerTier(totalStats) {
  if (totalStats <= 40) return {
    title: "Inexperiente",
    color: C.muted
  };
  if (totalStats <= 70) return {
    title: "Iniciante",
    color: C.green
  };
  if (totalStats <= 120) return {
    title: "Treinado",
    color: C.blue
  };
  if (totalStats <= 200) return {
    title: "Experiente",
    color: C.purple
  };
  if (totalStats <= 300) return {
    title: "Elite",
    color: C.orange
  };
  if (totalStats <= 500) return {
    title: "Alto Nível",
    color: C.yellow
  };
  if (totalStats <= 800) return {
    title: "Monstruoso",
    color: C.red
  };
  if (totalStats <= 1200) return {
    title: "Lendário",
    color: C.orangeDeep
  };
  return {
    title: "Transcendente",
    color: "#E2E8F0"
  };
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function nowStr() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR") + " às " + d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function maskWhats(w) {
  if (!w) return "";
  const cleaned = w.replace(/\D/g, "");
  if (cleaned.length < 4) return cleaned;
  return "•••• " + cleaned.slice(-4);
}

// Sound FX Generator via Web Audio API
function playReiatsuSound(type = 'roll') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'roll') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'kido') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
}

// Initial Default Database
const DEFAULT_DB = {
  adminSenha: "sociedade2026",
  superAdminNome: "ADM Máximo (Comandante Supremo)",
  administradores: [{
    id: "adm-1",
    nome: "ADM Máximo",
    cargo: "Comandante Supremo",
    nivel: "maximo",
    charId: "ren-001"
  }, {
    id: "adm-2",
    nome: "Mestre Kisuke",
    cargo: "Avaliador de Cenas & Fichas",
    nivel: "menor",
    charId: "rukia-002"
  }],
  registrosTarefasAdm: [{
    id: "t1",
    admNome: "Mestre Kisuke",
    tarefa: "Avaliação de Cenas de Arco",
    pontosGanhos: 8,
    data: "21/08/2026 às 14:00"
  }, {
    id: "t2",
    admNome: "Mestre Kisuke",
    tarefa: "Avaliação de 7 Fichas",
    pontosGanhos: 3,
    data: "20/08/2026 às 18:30"
  }],
  combatesArena: [{
    id: "arena-1",
    p1Id: "ren-001",
    p2Id: "rukia-002",
    p1Nome: "Kurosaki Ren",
    p2Nome: "Kuchiki Rukia",
    p1Estado: "Inteiro",
    p2Estado: "Inteiro",
    turno: "Turno 2 — Troca de Hadō e Shunpo",
    juizLog: "Ren abriu com Hadō #4 Byakurai; Rukia esquivou com Hohō e contra-atacou com Bakudō #61.",
    status: "Em Andamento"
  }],
  iaJulgamentos: [{
    id: "ia-1",
    data: "21/08/2026 às 19:40",
    lutador1: "Kurosaki Ren (Velocidade 48, Força 21)",
    lutador2: "Kuchiki Rukia (Pressão 45, Velocidade 42)",
    cenaDesc: "Ren tentou golpear direto com Zanjutsu rápido enquanto Rukia conjurava Rikujō Kōrō.",
    veredito: "Veredito da IA: Devido à diferença de +6 em Velocidade de Ren, seu golpe inicial atinge antes da conjuração completa sem encantamento, porém a alta Pressão Espiritual de Rukia (45 vs 37) reduz o dano total com barreira instintiva de Reiatsu. Ambos sofrem desgaste moderado."
  }],
  rolagensDadosPublicas: [{
    id: "r1",
    autor: "Mestre Kisuke",
    personagem: "Kurosaki Ren",
    dado: "d20",
    resultado: 18,
    categoria: "Positivo (Sucesso Limpo)",
    data: "22/08/2026 às 09:30"
  }],
  personagens: [{
    id: "ren-001",
    nome: "Kurosaki Ren",
    foto: "assets/ichigo-orange.png",
    whatsapp: "11999998888",
    codigo: "REN-8921",
    raca: "Shinigami Ex-Humano",
    esquadrao: "11º Esquadrão",
    faceclaim: "Ichigo Kurosaki",
    idadePlayer: "24",
    aniversarioPlayer: "15/07",
    idadeChar: "18",
    aniversarioChar: "15/07",
    pontosDisponiveis: 7,
    sorteiosComunsRestantes: 2,
    sorteiosEspeciaisRestantes: 1,
    sorteiosDrops: [{
      id: "dr1",
      data: "21/08/2026 às 10:15",
      nome: "Gacha Comum: +5 Pontos Disponíveis",
      cor: C.blue
    }],
    atributos: {
      pressao: 37,
      forca: 28,
      velocidade: 48,
      resiliencia: 26
    },
    kidosConhecidos: [{
      id: "h4",
      numero: 4,
      nome: "Byakurai",
      cat: "Hadō",
      custoReiatsu: 3
    }, {
      id: "b1",
      numero: 1,
      nome: "Sai",
      cat: "Bakudō",
      custoReiatsu: 2
    }, {
      id: "k1",
      numero: 1,
      nome: "Kaidō — Tratamento de Tecidos",
      cat: "Kaidō",
      custoReiatsu: 4
    }],
    tecnicas: [{
      id: "t1",
      nome: "Hadō #4 — Byakurai",
      categoria: "Hadō"
    }, {
      id: "t2",
      nome: "Bakudō #1 — Sai",
      categoria: "Bakudō"
    }, {
      id: "t3",
      nome: "Kaidō — Tratamento Básico",
      categoria: "Kaidō"
    }, {
      id: "t4",
      nome: "Shunpo — Passo Relâmpago",
      categoria: "Hohō"
    }],
    zanpakuto: {
      nome: "Zangetsu (Espírito em despertar)",
      shikai: true,
      bankai: false,
      notas: "Sente a ressonância do espírito durante combates sob pressão. Shikai despertado em treino de arco."
    },
    estado: "Inteiro",
    treinosHoje: 1,
    historico: [{
      id: "h1",
      data: "21/08/2026 às 10:30",
      texto: "Treino em ON aprovado pelo ADM: +2 Velocidade"
    }, {
      id: "h2",
      data: "20/08/2026 às 16:45",
      texto: "Missão Principal: +15 Pontos concedidos + 4 Giros Comuns + 1 Especial"
    }, {
      id: "h3",
      data: "19/08/2026 às 14:10",
      texto: "Combate em ON aprovado: +2 Pressão Espiritual"
    }, {
      id: "h4",
      data: "18/08/2026 às 09:00",
      texto: "Ficha inicial criada na Sociedade das Almas"
    }]
  }, {
    id: "rukia-002",
    nome: "Kuchiki Rukia",
    foto: "assets/ichigo-moon.png",
    whatsapp: "11988887777",
    codigo: "RUK-3312",
    raca: "Shinigami",
    esquadrao: "13º Esquadrão",
    faceclaim: "Rukia Kuchiki",
    idadePlayer: "22",
    aniversarioPlayer: "14/01",
    idadeChar: "150",
    aniversarioChar: "14/01",
    pontosDisponiveis: 12,
    sorteiosComunsRestantes: 1,
    sorteiosEspeciaisRestantes: 0,
    sorteiosDrops: [],
    atributos: {
      pressao: 45,
      forca: 18,
      velocidade: 42,
      resiliencia: 30
    },
    kidosConhecidos: [{
      id: "h33",
      numero: 33,
      nome: "Sōkatsui",
      cat: "Hadō",
      custoReiatsu: 7
    }, {
      id: "b61",
      numero: 61,
      nome: "Rikujō Kōrō",
      cat: "Bakudō",
      custoReiatsu: 12
    }, {
      id: "k2",
      numero: 2,
      nome: "Kaidō — Revitalização de Reiatsu",
      cat: "Kaidō",
      custoReiatsu: 7
    }],
    tecnicas: [{
      id: "t5",
      nome: "Hadō #33 — Sōkatsui",
      categoria: "Hadō"
    }, {
      id: "t6",
      nome: "Bakudō #61 — Rikujō Kōrō",
      categoria: "Bakudō"
    }, {
      id: "t7",
      nome: "Kaidō — Restauração de Reiatsu",
      categoria: "Kaidō"
    }],
    zanpakuto: {
      nome: "Sode no Shirayuki",
      shikai: true,
      bankai: false,
      notas: "Zanpakutō do tipo gelo mais bela da Sociedade das Almas."
    },
    estado: "Inteiro",
    treinosHoje: 0,
    historico: [{
      id: "h5",
      data: "21/08/2026 às 11:15",
      texto: "Recompensa de Missão: +15 Pontos disponíveis"
    }, {
      id: "h6",
      data: "19/08/2026 às 15:30",
      texto: "Ficha registrada com sucesso"
    }]
  }]
};

// Calculate Rankings
function calculateRankings(personagens) {
  if (!personagens || personagens.length === 0) return {
    rankFisico: [],
    rankPressao: []
  };
  const rankFisico = [...personagens].map(p => {
    const f = Number(p.atributos?.forca || 0);
    const v = Number(p.atributos?.velocidade || 0);
    const r = Number(p.atributos?.resiliencia || 0);
    const score = Number(((f + v + r) / 3).toFixed(1));
    return {
      id: p.id,
      nome: p.nome,
      foto: p.foto,
      score,
      forca: f,
      vel: v,
      res: r
    };
  }).sort((a, b) => b.score - a.score);
  const rankPressao = [...personagens].map(p => {
    const score = Number(p.atributos?.pressao || 0);
    return {
      id: p.id,
      nome: p.nome,
      foto: p.foto,
      score
    };
  }).sort((a, b) => b.score - a.score);
  return {
    rankFisico,
    rankPressao
  };
}

// MAIN APP COMPONENT
function App() {
  const [db, setDb] = useState(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [view, setView] = useState("sistemas");
  const [adminCharId, setAdminCharId] = useState(null);
  const [saveErr, setSaveErr] = useState("");
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bleachDB");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure schema updates
        if (!parsed.administradores) parsed.administradores = DEFAULT_DB.administradores;
        if (!parsed.registrosTarefasAdm) parsed.registrosTarefasAdm = DEFAULT_DB.registrosTarefasAdm;
        if (!parsed.combatesArena) parsed.combatesArena = DEFAULT_DB.combatesArena;
        if (!parsed.iaJulgamentos) parsed.iaJulgamentos = DEFAULT_DB.iaJulgamentos;
        if (!parsed.rolagensDadosPublicas) parsed.rolagensDadosPublicas = DEFAULT_DB.rolagensDadosPublicas;
        setDb(parsed);
      } else {
        setDb(DEFAULT_DB);
        localStorage.setItem("bleachDB", JSON.stringify(DEFAULT_DB));
      }
    } catch (e) {
      setDb(DEFAULT_DB);
    } finally {
      setReady(true);
    }
  }, []);
  function saveDb(next) {
    setDb(next);
    try {
      localStorage.setItem("bleachDB", JSON.stringify(next));
      setSaveErr("");
    } catch (e) {
      setSaveErr("Não foi possível salvar os dados no navegador.");
    }
  }
  function logout() {
    setSession(null);
    setAdminCharId(null);
    setView("sistemas");
  }
  const myChar = useMemo(() => {
    if (!db || !session) return null;
    if (session.role === "jogador") return db.personagens.find(p => p.id === session.charId) || null;
    if (session.role === "admin" && adminCharId) return db.personagens.find(p => p.id === adminCharId) || null;
    return null;
  }, [db, session, adminCharId]);
  const {
    rankFisico,
    rankPressao
  } = useMemo(() => {
    return calculateRankings(db?.personagens || []);
  }, [db?.personagens]);
  if (!ready || !db) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col items-center justify-center min-h-screen text-bleach-creamDim"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-cinzel tracking-widest text-bleach-orange animate-pulse mb-3"
    }, "SOCIEDADE DAS ALMAS"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-sans"
    }, "Abrindo port\xF5es do Sereitei..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    session: session,
    onLogout: logout,
    view: view,
    setView: setView,
    nome: myChar?.nome,
    onOpenAdminLogin: () => setShowAdminLoginModal(true)
  }), saveErr && /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto mt-4 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-950/80 border border-red-600/50 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\u26A0\uFE0F ", saveErr), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSaveErr(""),
    className: "text-xs underline ml-4"
  }, "Fechar"))), /*#__PURE__*/React.createElement("main", {
    className: "max-w-6xl mx-auto px-4 py-6"
  }, view === "sistemas" && /*#__PURE__*/React.createElement(SistemasView, null), view === "rankings" && /*#__PURE__*/React.createElement(RankingsView, {
    rankFisico: rankFisico,
    rankPressao: rankPressao,
    myCharId: myChar?.id
  }), view === "kidos" && /*#__PURE__*/React.createElement(KidosView, {
    personagem: myChar,
    isAdmin: session?.role === "admin"
  }), view === "arena" && /*#__PURE__*/React.createElement(ArenaView, {
    db: db,
    saveDb: saveDb,
    session: session,
    myChar: myChar
  }), view === "ficha" && (!session ? /*#__PURE__*/React.createElement(LoginScreen, {
    db: db,
    onLogin: s => {
      setSession(s);
      setView(s.role === "admin" ? "admin" : "ficha");
    },
    onOpenAdminModal: () => setShowAdminLoginModal(true)
  }) : session.role === "jogador" ? /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: false,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  }) : /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-xl p-8 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim mb-4"
  }, "Voc\xEA est\xE1 logado como Administrador."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: "px-6 py-2.5 bg-bleach-orange text-black font-bold uppercase rounded-lg shadow-lg hover:bg-orange-400 transition"
  }, "Ir para o Painel Admin"))), view === "admin" && (!session || session.role !== "admin" ? /*#__PURE__*/React.createElement(AdminLoginScreen, {
    db: db,
    onLoginAdmin: () => {
      setSession({
        role: "admin"
      });
      setView("admin");
    }
  }) : /*#__PURE__*/React.createElement(AdminPanel, {
    db: db,
    saveDb: saveDb,
    onAbrirFicha: id => {
      setAdminCharId(id);
      setView("admin-ficha");
    }
  })), view === "admin-ficha" && session?.role === "admin" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: "inline-flex items-center gap-2 mb-6 px-4 py-2 bg-bleach-panel border border-bleach-border rounded-lg text-sm text-bleach-creamDim hover:text-white hover:border-bleach-orange transition"
  }, "\u2190 Voltar ao Painel Admin"), myChar ? /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: true,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  }) : /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-muted"
  }, "Personagem n\xE3o encontrado.")))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t border-bleach-border/60 bg-bleach-bg2/90 py-6 mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bleach-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-title tracking-widest text-bleach-orange text-sm"
  }, "BLEACH RPG"), /*#__PURE__*/React.createElement("span", null, "\u2022 Sociedade das Almas \xA9 2026")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", null, "Treino em ON (30 linhas) \u2022 Zanpakut\u014D Narrativa & IA \u2022 Arena & Rankings")))), showAdminLoginModal && /*#__PURE__*/React.createElement(AdminLoginModal, {
    db: db,
    onClose: () => setShowAdminLoginModal(false),
    onSuccess: () => {
      setSession({
        role: "admin"
      });
      setView("admin");
      setShowAdminLoginModal(false);
    }
  }));
}

// TOP NAVIGATION BAR
function TopBar({
  session,
  onLogout,
  view,
  setView,
  nome,
  onOpenAdminLogin
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "border-b border-bleach-border bg-bleach-bg2/95 backdrop-blur sticky top-0 z-40 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setView("sistemas"),
    className: "cursor-pointer flex items-center gap-3 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-lg bg-gradient-to-br from-bleach-orange to-bleach-orangeDeep flex items-center justify-center font-cinzel font-black text-black text-xl shadow-lg group-hover:scale-105 transition"
  }, "\u534D"), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-title text-2xl tracking-widest text-bleach-orange leading-none group-hover:text-orange-400 transition"
  }, "BLEACH RPG"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-sans tracking-wider text-bleach-creamDim uppercase"
  }, "Sociedade das Almas"))), /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("sistemas"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "sistemas" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCD6"), /*#__PURE__*/React.createElement("span", null, "Sistemas")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("rankings"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "rankings" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("span", null, "Rankings")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("kidos"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "kidos" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), /*#__PURE__*/React.createElement("span", null, "Kid\u014Ds & Reiatsu")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("arena"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "arena" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), /*#__PURE__*/React.createElement("span", null, "Arena")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("ficha"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "ficha" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("span", null, "Minha Ficha")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "admin" || view === "admin-ficha" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("span", null, "Painel ADM"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, session ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex flex-col text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-bleach-cream"
  }, session.role === "admin" ? "Administrador" : nome || "Jogador"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-orange"
  }, session.role === "admin" ? "Acesso Livre ADM" : "Conectado")), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "px-2.5 py-1 bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-red-400 rounded-md text-xs font-medium transition"
  }, "Sair")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("ficha"),
    className: "px-3 py-1.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-bold rounded-lg text-xs tracking-wider uppercase hover:brightness-110 transition shadow"
  }, "Entrar"))));
}

// CHAIN SVG SEPARATOR
function ChainDivider() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center my-4 overflow-hidden"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 14",
    className: "w-full max-w-[280px] h-3 text-bleach-orange",
    "aria-hidden": "true"
  }, Array.from({
    length: 10
  }).map((_, i) => /*#__PURE__*/React.createElement("ellipse", {
    key: i,
    cx: 15 + i * 30,
    cy: 7,
    rx: 11,
    ry: 5.5,
    fill: "none",
    stroke: i % 2 === 0 ? "currentColor" : "#C94E0A",
    strokeWidth: "2.4",
    transform: i % 2 === 0 ? undefined : `rotate(90 ${15 + i * 30} 7)`
  }))));
}

// SECTION WRAPPER
function Section({
  title,
  subtitle,
  children,
  right,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-bleach-panel border border-bleach-border rounded-xl p-5 mb-5 shadow-lg relative overflow-hidden ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-bleach-borderSoft pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1.5 h-5 bg-bleach-orange rounded-full shadow-[0_0_10px_#FF6A13]"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-xl tracking-wider uppercase text-bleach-cream"
  }, title)), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-0.5 ml-3.5"
  }, subtitle)), right && /*#__PURE__*/React.createElement("div", null, right)), children);
}

// BADGE COMPONENT
function Badge({
  color,
  children,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      borderColor: color,
      backgroundColor: `${color}15`
    },
    className: `inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase border px-2.5 py-1 rounded-full ${className}`
  }, children);
}

// PLAYER LOGIN SCREEN
function LoginScreen({
  db,
  onLogin,
  onOpenAdminModal
}) {
  const [whats, setWhats] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  function entrarJogador(e) {
    e.preventDefault();
    const w = whats.replace(/\D/g, "");
    if (!w || !codigo.trim()) {
      setErro("Por favor, preencha o WhatsApp e o Código de Acesso.");
      return;
    }
    const p = db.personagens.find(c => c.whatsapp.replace(/\D/g, "") === w && c.codigo.trim().toLowerCase() === codigo.trim().toLowerCase());
    if (!p) {
      setErro("WhatsApp ou código de acesso incorretos. Confira com a administração.");
      return;
    }
    onLogin({
      role: "jogador",
      charId: p.id
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-card-ichigo border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl tracking-widest text-bleach-orange reiatsu-text-glow"
  }, "FICHA DO JOGADOR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Insira o seu n\xFAmero e c\xF3digo para acessar seus atributos e rankings"), /*#__PURE__*/React.createElement(ChainDivider, null)), /*#__PURE__*/React.createElement("form", {
    onSubmit: entrarJogador,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "N\xFAmero de WhatsApp"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "(11) 99999-8888",
    value: whats,
    onChange: e => setWhats(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "C\xF3digo de Acesso (Senha do Player)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Ex: REN-8921",
    value: codigo,
    onChange: e => setCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition font-mono"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-300 text-xs font-medium"
  }, "\u26A0\uFE0F ", erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition"
  }, "Entrar na Ficha")), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-borderSoft flex flex-col gap-2 text-center text-xs text-bleach-muted"
  }, /*#__PURE__*/React.createElement("p", null, "N\xE3o possui um c\xF3digo? Solicite com a administra\xE7\xE3o no WhatsApp do RPG."), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAdminModal,
    className: "text-bleach-orange hover:underline font-semibold mt-1"
  }, "\uD83D\uDD10 Sou Administrador (Entrar no Painel ADM)"))));
}

// ADMIN LOGIN SCREEN
function AdminLoginScreen({
  db,
  onLoginAdmin
}) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  function entrarAdmin(e) {
    e.preventDefault();
    if (senha !== db.adminSenha) {
      setErro("Senha de administrador incorreta.");
      return;
    }
    onLoginAdmin();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl tracking-widest text-bleach-orange mt-2"
  }, "PAINEL ADMINISTRATIVO"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Acesso exclusivo para mestres e administradores"), /*#__PURE__*/React.createElement(ChainDivider, null)), /*#__PURE__*/React.createElement("form", {
    onSubmit: entrarAdmin,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "Senha do Administrador"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: senha,
    onChange: e => setSenha(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-300 text-xs font-medium"
  }, "\u26A0\uFE0F ", erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 transition"
  }, "Acessar Painel ADM"))));
}

// ADMIN LOGIN MODAL
function AdminLoginModal({
  db,
  onClose,
  onSuccess
}) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  function submit(e) {
    e.preventDefault();
    if (senha !== db.adminSenha) {
      setErro("Senha incorreta.");
      return;
    }
    onSuccess();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-xl p-6 max-w-sm w-full shadow-2xl relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 text-bleach-muted hover:text-white text-lg font-bold"
  }, "\u2715"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-bleach-orange tracking-wider mb-2"
  }, "LOGIN ADM"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-4"
  }, "Informe a senha da administra\xE7\xE3o."), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Senha de Administrador",
    value: senha,
    onChange: e => setSenha(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bleach-orange"
  }), erro && /*#__PURE__*/React.createElement("div", {
    className: "text-red-400 text-xs"
  }, erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-2.5 bg-bleach-orange text-black font-bold uppercase text-xs rounded-lg shadow hover:bg-orange-400"
  }, "Entrar"))));
}

// TAB: RANKINGS VIEW (PUBLIC)
function RankingsView({
  rankFisico,
  rankPressao,
  myCharId
}) {
  const [aba, setAba] = useState("fisico");
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Quadro de Honra do Sereitei"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "RANKINGS OFICIAIS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Acompanhe os guerreiros mais poderosos da Sociedade das Almas divididos em 2 rankings oficiais: ", /*#__PURE__*/React.createElement("strong", null, "M\xE9dia de Atributos F\xEDsicos"), " (For\xE7a + Velocidade + Resili\xEAncia \xF7 3) e ", /*#__PURE__*/React.createElement("strong", null, "Press\xE3o Espiritual Pura"), " (Reiatsu)."))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 border-b border-bleach-border pb-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAba("fisico"),
    className: `px-5 py-2.5 rounded-xl font-title text-lg tracking-wider uppercase transition flex items-center gap-2 ${aba === "fisico" ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), /*#__PURE__*/React.createElement("span", null, "1. Ranking F\xEDsico (M\xE9dia \xF7 3)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAba("pressao"),
    className: `px-5 py-2.5 rounded-xl font-title text-lg tracking-wider uppercase transition flex items-center gap-2 ${aba === "pressao" ? "bg-bleach-blue text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF00"), /*#__PURE__*/React.createElement("span", null, "2. Ranking de Press\xE3o Espiritual"))), aba === "fisico" ? /*#__PURE__*/React.createElement(Section, {
    title: "Classifica\xE7\xE3o por Poder F\xEDsico",
    subtitle: "Calculado exatamente por: (For\xE7a + Velocidade + Resili\xEAncia) \xF7 3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, rankFisico.map((item, idx) => {
    const isMe = item.id === myCharId;
    const medalha = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: `p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${isMe ? "bg-bleach-orange/10 border-bleach-orange shadow-lg" : "bg-bleach-panel2 border-bleach-borderSoft hover:border-bleach-border"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-title text-xl font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/50" : idx === 2 ? "bg-amber-700/20 text-amber-500 border border-amber-600/50" : "bg-black text-bleach-muted"}`
    }, medalha), /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.foto || 'assets/ichigo-orange.png',
      alt: item.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-orange.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, item.nome), isMe && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-bleach-orange text-black font-extrabold text-[10px] uppercase"
    }, "Voc\xEA")), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-muted flex gap-3 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-red-400"
    }, item.forca)), /*#__PURE__*/React.createElement("span", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-green-400"
    }, item.vel)), /*#__PURE__*/React.createElement("span", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-purple-400"
    }, item.res))))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted uppercase"
    }, "M\xE9dia F\xEDsica"), /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-black font-mono text-bleach-orange"
    }, item.score))));
  }))) : /*#__PURE__*/React.createElement(Section, {
    title: "Classifica\xE7\xE3o por Press\xE3o Espiritual (Reiatsu)",
    subtitle: "Poder de controle espiritual e intensidade da aura"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, rankPressao.map((item, idx) => {
    const isMe = item.id === myCharId;
    const medalha = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: `p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${isMe ? "bg-bleach-blue/10 border-bleach-blue shadow-lg" : "bg-bleach-panel2 border-bleach-borderSoft hover:border-bleach-border"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-title text-xl font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/50" : idx === 2 ? "bg-amber-700/20 text-amber-500 border border-amber-600/50" : "bg-black text-bleach-muted"}`
    }, medalha), /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.foto || 'assets/ichigo-moon.png',
      alt: item.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-moon.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, item.nome), isMe && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-bleach-blue text-black font-extrabold text-[10px] uppercase"
    }, "Voc\xEA")), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-muted mt-0.5"
    }, "Reiatsu pura da alma"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted uppercase"
    }, "Press\xE3o Espiritual"), /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-black font-mono text-bleach-blue"
    }, item.score))));
  }))));
}

// TAB: KIDŌS CATALOG & FLUID REIATSU VISUALIZER
function KidosView({
  personagem
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  // Reiatsu pool simulation
  const pressaoBase = personagem?.atributos?.pressao || 30;
  // Formula: Cap of Reiatsu and Max Spells per Scene
  const maxKidosCena = Math.max(3, Math.floor(pressaoBase / 7) + 1);
  const [kidosUsados, setKidosUsados] = useState(0);
  const [relatoCena, setRelatoCena] = useState("");
  const [registroConjuracoes, setRegistroConjuracoes] = useState([]);
  const restantes = Math.max(0, maxKidosCena - kidosUsados);
  const pctRestante = Math.round(restantes / maxKidosCena * 100);
  function conjurarKido(kido) {
    if (restantes <= 0) {
      alert("Limite de Kidōs atingido para esta cena! Sua Reiatsu precisa se estabilizar.");
      return;
    }
    playReiatsuSound('kido');
    setKidosUsados(prev => prev + 1);
    setRegistroConjuracoes(prev => [{
      id: uid(),
      nome: kido.nome,
      cat: kido.cat,
      hora: new Date().toLocaleTimeString("pt-BR")
    }, ...prev]);
  }
  function resetarReiatsu() {
    setKidosUsados(0);
    setRegistroConjuracoes([]);
  }
  const kidosFiltrados = CATALOGO_KIDOS.filter(k => {
    const matchesCat = categoriaAtiva === "Todos" || k.cat === categoriaAtiva;
    const matchesBusca = k.nome.toLowerCase().includes(busca.toLowerCase()) || k.desc.toLowerCase().includes(busca.toLowerCase()) || k.cat.toLowerCase().includes(busca.toLowerCase());
    return matchesCat && matchesBusca;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-blue/20 border border-bleach-blue text-bleach-blue text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Grim\xF3rio de Encantamentos & Magia Espiritual"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "KID\u014CS DA SOCIEDADE DAS ALMAS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Explore o comp\xEAndio oficial de ", /*#__PURE__*/React.createElement("strong", null, "Had\u014D"), " (Destrui\xE7\xE3o), ", /*#__PURE__*/React.createElement("strong", null, "Bakud\u014D"), " (Aprisionamento) e ", /*#__PURE__*/React.createElement("strong", null, "Kaid\u014D"), " (Cura). Abaixo voc\xEA tamb\xE9m encontra o ", /*#__PURE__*/React.createElement("strong", null, "Visualizador de Reiatsu L\xEDquido"), " para gerenciar seus feiti\xE7os em cena!"))), /*#__PURE__*/React.createElement(Section, {
    title: "\uD83D\uDCA7 Visualizador Din\xE2mico de Reiatsu & Limite de Kid\u014D",
    subtitle: "Representa\xE7\xE3o visual do seu reservat\xF3rio espiritual descendo como l\xEDquido conforme voc\xEA conjura em combate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase font-bold tracking-widest text-bleach-creamDim mb-2"
  }, "Reservat\xF3rio de Reiatsu"), /*#__PURE__*/React.createElement("div", {
    className: "w-32 h-64 border-4 border-bleach-blue/50 rounded-2xl bg-black/80 relative overflow-hidden flex flex-col justify-end p-1 blue-reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col justify-between p-2 pointer-events-none z-20 opacity-30 text-[9px] font-mono text-white"
  }, /*#__PURE__*/React.createElement("span", null, "100% \u2014 Max"), /*#__PURE__*/React.createElement("span", null, "75% \u2014 Est\xE1vel"), /*#__PURE__*/React.createElement("span", null, "50% \u2014 Metade"), /*#__PURE__*/React.createElement("span", null, "25% \u2014 Cr\xEDtico"), /*#__PURE__*/React.createElement("span", null, "0% \u2014 Esgotado")), /*#__PURE__*/React.createElement("div", {
    className: "w-full rounded-xl transition-all duration-700 relative overflow-hidden flex items-center justify-center",
    style: {
      height: `${pctRestante}%`,
      background: pctRestante > 50 ? 'linear-gradient(180deg, #4FB3E8 0%, #1E4C63 100%)' : pctRestante > 20 ? 'linear-gradient(180deg, #FF6A13 0%, #C94E0A 100%)' : 'linear-gradient(180deg, #D6483F 0%, #681A15 100%)',
      boxShadow: '0 0 20px rgba(79, 179, 232, 0.6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white font-title text-3xl font-extrabold drop-shadow z-10"
  }, pctRestante, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted"
  }, "Kid\u014Ds Restantes na Cena:"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-mono font-bold text-bleach-orange mt-0.5"
  }, restantes, " / ", maxKidosCena), /*#__PURE__*/React.createElement("button", {
    onClick: resetarReiatsu,
    className: "mt-3 px-4 py-1.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
  }, "\uD83D\uDD04 Restaurar Reiatsu (Nova Cena)"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2"
  }, "\u270D\uFE0F Descri\xE7\xE3o Livre da Sua Cena com Kid\u014D"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-2"
  }, "Espa\xE7o livre para voc\xEA rascunhar como utilizou seus Kid\u014Ds na sua narra\xE7\xE3o antes de enviar no WhatsApp:"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: relatoCena,
    onChange: e => setRelatoCena(e.target.value),
    placeholder: "Ex: Concentrei minha Reiatsu na ponta do dedo indicador disparando Had\u014D #4 Byakurai em linha reta...",
    className: "w-full bg-black/60 border border-bleach-border rounded-lg p-3 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted"
  }, relatoCena.length, " caracteres"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(relatoCena);
      alert("Texto da cena copiado para a área de transferência!");
    },
    className: "px-3 py-1 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded hover:border-bleach-orange"
  }, "\uD83D\uDCCB Copiar Rascunho"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim mb-2"
  }, "Hist\xF3rico de Kid\u014Ds Disparados Nesta Cena"), registroConjuracoes.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum Kid\u014D conjurado ainda. Clique em \"Conjurar\" nos feiti\xE7os abaixo!") : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, registroConjuracoes.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "px-3 py-1.5 bg-black border border-bleach-border rounded-lg text-xs flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-orange font-bold"
  }, "\u26A1 ", r.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, "(", r.hora, ")")))))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, ["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    onClick: () => setCategoriaAtiva(cat),
    className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${categoriaAtiva === cat ? cat === "Hadō" ? "bg-bleach-red text-white shadow-lg" : cat === "Bakudō" ? "bg-bleach-blue text-black shadow-lg" : cat === "Kaidō" ? "bg-bleach-green text-black shadow-lg" : "bg-bleach-orange text-black shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, cat === "Hadō" ? "🔴 Hadō (Ataque)" : cat === "Bakudō" ? "🔵 Bakudō (Suporte)" : cat === "Kaidō" ? "🟢 Kaidō (Cura)" : "✨ Todos"))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Buscar Kid\u014D...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "bg-bleach-panel border border-bleach-border rounded-xl px-4 py-2 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-orange w-full sm:w-64"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, kidosFiltrados.map(k => /*#__PURE__*/React.createElement("div", {
    key: k.id,
    className: "bg-bleach-panel border border-bleach-border hover:border-bleach-border/80 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${k.cat === "Hadō" ? "text-red-400 border-red-500/40 bg-red-950/40" : k.cat === "Bakudō" ? "text-blue-400 border-blue-500/40 bg-blue-950/40" : "text-green-400 border-green-500/40 bg-green-950/40"}`
  }, k.cat, " #", k.numero, " \u2022 ", k.nivel), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-cream mt-1"
  }, k.nome)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-bleach-orange font-bold"
  }, "Custo: ", k.custoReiatsu, " Reiatsu")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, k.desc), k.incant !== "—" && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-[11px] text-bleach-muted italic"
  }, "\uD83D\uDDE3\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Encantamento:"), " \"", k.incant, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-bleach-borderSoft flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted"
  }, "Pot\xEAncia: Escala com sua Press\xE3o Espiritual"), /*#__PURE__*/React.createElement("button", {
    onClick: () => conjurarKido(k),
    className: "px-3.5 py-1.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 active:scale-95 transition"
  }, "\u26A1 Conjurar na Cena"))))));
}

// TAB: ARENA PVP VIEW
function ArenaView({
  db,
  saveDb,
  session,
  myChar
}) {
  const [desafianteId, setDesafianteId] = useState(db.personagens[0]?.id || "");
  const [desafiadoId, setDesafiadoId] = useState(db.personagens[1]?.id || "");
  const [showNovoDuelo, setShowNovoDuelo] = useState(false);
  const combateAtivo = db.combatesArena?.[0] || null;
  const p1 = db.personagens.find(p => p.id === combateAtivo?.p1Id);
  const p2 = db.personagens.find(p => p.id === combateAtivo?.p2Id);
  const [juizTexto, setJuizTexto] = useState(combateAtivo?.juizLog || "");
  const [turnoAtual, setTurnoAtual] = useState(combateAtivo?.turno || "Turno 1");
  function criarDuelo() {
    if (!desafianteId || !desafiadoId || desafianteId === desafiadoId) {
      alert("Selecione dois lutadores diferentes para o duelo!");
      return;
    }
    const p1Obj = db.personagens.find(p => p.id === desafianteId);
    const p2Obj = db.personagens.find(p => p.id === desafiadoId);
    const novoCombate = {
      id: uid(),
      p1Id: desafianteId,
      p2Id: desafiadoId,
      p1Nome: p1Obj.nome,
      p2Nome: p2Obj.nome,
      p1Estado: p1Obj.estado || "Inteiro",
      p2Estado: p2Obj.estado || "Inteiro",
      turno: "Turno 1 — Início do Combate",
      juizLog: "Duelo iniciado no campo de treinamento da Sociedade das Almas.",
      status: "Em Andamento"
    };
    saveDb({
      ...db,
      combatesArena: [novoCombate, ...(db.combatesArena || [])]
    });
    setShowNovoDuelo(false);
  }
  function atualizarEstadoLutador(qual, novoEstado) {
    if (!combateAtivo) return;
    const combates = db.combatesArena.map((c, i) => {
      if (i === 0) {
        return {
          ...c,
          [qual === "p1" ? "p1Estado" : "p2Estado"]: novoEstado,
          juizLog: juizTexto,
          turno: turnoAtual
        };
      }
      return c;
    });
    saveDb({
      ...db,
      combatesArena: combates
    });
  }
  function salvarLogJuiz() {
    if (!combateAtivo) return;
    const combates = db.combatesArena.map((c, i) => {
      if (i === 0) {
        return {
          ...c,
          juizLog: juizTexto,
          turno: turnoAtual
        };
      }
      return c;
    });
    saveDb({
      ...db,
      combatesArena: combates
    });
    alert("Estado do combate e relatório do juiz atualizados com sucesso!");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Duelos em ON & Julgamento de Batalha"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "ARENA DE COMBATE"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "\xC1rea de duelos oficiais da Sociedade das Almas! Os jogadores se enfrentam com suas fichas e o estado de combate \xE9 atualizado ao vivo pelos administradores e ju\xEDzes de luta."))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl tracking-wider uppercase text-bleach-cream"
  }, "Duelo em Destaque"), session?.role === "admin" && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowNovoDuelo(!showNovoDuelo),
    className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "+ Criar Novo Duelo")), showNovoDuelo && /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-orange p-5 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "Configurar Novo Duelo"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Lutador 1 (Desafiante)"), /*#__PURE__*/React.createElement("select", {
    value: desafianteId,
    onChange: e => setDesafianteId(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Lutador 2 (Desafiado)"), /*#__PURE__*/React.createElement("select", {
    value: desafiadoId,
    onChange: e => setDesafiadoId(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome))))), /*#__PURE__*/React.createElement("button", {
    onClick: criarDuelo,
    className: "px-5 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg hover:bg-orange-400"
  }, "Confirmar e Iniciar Duelo")), combateAtivo && p1 && p2 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-bleach-border rounded-2xl p-6 relative overflow-hidden shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-5 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-black/50 border border-bleach-borderSoft rounded-2xl p-5 flex flex-col items-center text-center relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 bleach-avatar-frame overflow-hidden mb-3 bg-black"
  }, /*#__PURE__*/React.createElement("img", {
    src: p1.foto || 'assets/ichigo-orange.png',
    alt: p1.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-orange.png';
    }
  })), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-orange"
  }, p1.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim"
  }, p1.esquadrao || p1.raca), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === combateAtivo.p1Estado)?.color || C.green
  }, "Estado: ", combateAtivo.p1Estado)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 w-full mt-4 text-[11px] text-bleach-muted bg-bleach-panel2 p-2.5 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", null, "Press\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-blue"
  }, p1.atributos.pressao)), /*#__PURE__*/React.createElement("div", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-red"
  }, p1.atributos.forca)), /*#__PURE__*/React.createElement("div", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-green"
  }, p1.atributos.velocidade)), /*#__PURE__*/React.createElement("div", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-purple"
  }, p1.atributos.resiliencia)))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 flex flex-col items-center justify-center my-4 md:my-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-title text-6xl md:text-7xl font-black text-bleach-orange vs-slash animate-pulse"
  }, "VS"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-bleach-muted uppercase mt-2 tracking-widest text-center"
  }, combateAtivo.turno)), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-black/50 border border-bleach-borderSoft rounded-2xl p-5 flex flex-col items-center text-center relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 bleach-avatar-frame overflow-hidden mb-3 bg-black"
  }, /*#__PURE__*/React.createElement("img", {
    src: p2.foto || 'assets/ichigo-moon.png',
    alt: p2.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-moon.png';
    }
  })), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-blue"
  }, p2.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim"
  }, p2.esquadrao || p2.raca), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === combateAtivo.p2Estado)?.color || C.green
  }, "Estado: ", combateAtivo.p2Estado)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 w-full mt-4 text-[11px] text-bleach-muted bg-bleach-panel2 p-2.5 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", null, "Press\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-blue"
  }, p2.atributos.pressao)), /*#__PURE__*/React.createElement("div", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-red"
  }, p2.atributos.forca)), /*#__PURE__*/React.createElement("div", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-green"
  }, p2.atributos.velocidade)), /*#__PURE__*/React.createElement("div", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-purple"
  }, p2.atributos.resiliencia))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2"
  }, "\uD83D\uDCDC Relat\xF3rio do Juiz & Estado da Batalha (Atualizado pela ADM)"), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/60 border border-bleach-borderSoft rounded-xl text-xs text-bleach-creamDim leading-relaxed"
  }, combateAtivo.juizLog)), session?.role === "admin" && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-orange/40 space-y-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "\uD83D\uDC51 Gest\xE3o do Combate (Mestre / Juiz)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Estado de ", p1.nome), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 flex-wrap"
  }, ESTADOS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.key,
    onClick: () => atualizarEstadoLutador("p1", e.key),
    className: `px-2.5 py-1 rounded text-xs font-bold border transition ${combateAtivo.p1Estado === e.key ? "bg-white/20 text-white" : "opacity-60"}`,
    style: {
      borderColor: e.color,
      color: e.color
    }
  }, e.key)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Estado de ", p2.nome), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 flex-wrap"
  }, ESTADOS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.key,
    onClick: () => atualizarEstadoLutador("p2", e.key),
    className: `px-2.5 py-1 rounded text-xs font-bold border transition ${combateAtivo.p2Estado === e.key ? "bg-white/20 text-white" : "opacity-60"}`,
    style: {
      borderColor: e.color,
      color: e.color
    }
  }, e.key))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: turnoAtual,
    onChange: e => setTurnoAtual(e.target.value),
    placeholder: "Turno do Combate (Ex: Turno 3 \u2014 Cl\xEDmax de Shikai)",
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: juizTexto,
    onChange: e => setJuizTexto(e.target.value),
    placeholder: "Descreva o relat\xF3rio do que aconteceu no turno...",
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: salvarLogJuiz,
    className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "Salvar e Publicar Decis\xE3o do Juiz"))))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 text-bleach-muted text-sm bg-bleach-panel border border-bleach-border rounded-xl"
  }, "Nenhum combate ativo no momento. Solicite \xE0 administra\xE7\xE3o o in\xEDcio de um duelo!"));
}

// TAB: FICHA DO JOGADOR (EXPANDED WITH BLEACH MOLD, RANKING BARS, GACHA BUTTONS, WHATSAPP GENERATOR, AND AI ZANPAKUTO)
function FichaView({
  db,
  saveDb,
  personagem,
  isAdmin,
  rankFisico,
  rankPressao
}) {
  const [pend, setPend] = useState({
    pressao: 0,
    forca: 0,
    velocidade: 0,
    resiliencia: 0
  });
  const [novaTecCat, setNovaTecCat] = useState("Hadō");
  const [novaTecNome, setNovaTecNome] = useState("");
  const [rec, setRec] = useState({
    tipo: "Treino em ON (30 linhas)",
    pontos: 1,
    atributo: "",
    motivo: ""
  });
  const [editFoto, setEditFoto] = useState(personagem?.foto || "assets/ichigo-orange.png");
  const [editNome, setEditNome] = useState(personagem?.nome || "");
  const [editWhats, setEditWhats] = useState(personagem?.whatsapp || "");
  const [editCodigo, setEditCodigo] = useState(personagem?.codigo || "");
  const [editFaceclaim, setEditFaceclaim] = useState(personagem?.faceclaim || "");
  const [editIdadePlayer, setEditIdadePlayer] = useState(personagem?.idadePlayer || "20");
  const [editAnivPlayer, setEditAnivPlayer] = useState(personagem?.aniversarioPlayer || "01/01");
  const [editIdadeChar, setEditIdadeChar] = useState(personagem?.idadeChar || "18");
  const [editAnivChar, setEditAnivChar] = useState(personagem?.aniversarioChar || "01/01");
  const [editEsquadrao, setEditEsquadrao] = useState(personagem?.esquadrao || "11º Esquadrão");
  const [zk, setZk] = useState(personagem?.zanpakuto || {
    nome: "",
    shikai: false,
    bankai: false,
    notas: ""
  });
  const [rewardModal, setRewardModal] = useState(null);
  const [showGachaHistory, setShowGachaHistory] = useState(false);
  const [showZanpakutoAIModal, setShowZanpakutoAIModal] = useState(false);
  const [aiZkOpcoes, setAiZkOpcoes] = useState([]);
  const [aiZkTipo, setAiZkTipo] = useState("shikai");
  const [copiadoWhats, setCopiadoWhats] = useState(false);
  if (!personagem) return /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-muted"
  }, "Ficha n\xE3o encontrada.");
  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const fadigaPct = (personagem.treinosHoje || 0) >= 3 ? 15 : (personagem.treinosHoje || 0) >= 2 ? 5 : 0;
  const totalStats = Object.values(personagem.atributos).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);

  // Ranking positions
  const posFisicoIdx = rankFisico.findIndex(r => r.id === personagem.id);
  const posFisico = posFisicoIdx !== -1 ? posFisicoIdx + 1 : 1;
  const scoreFisico = ((Number(personagem.atributos.forca) + Number(personagem.atributos.velocidade) + Number(personagem.atributos.resiliencia)) / 3).toFixed(1);
  const topFisicoScore = rankFisico[0]?.score || scoreFisico;
  const pctBarFisico = Math.min(100, Math.round(scoreFisico / Math.max(1, topFisicoScore) * 100));
  const posPressaoIdx = rankPressao.findIndex(r => r.id === personagem.id);
  const posPressao = posPressaoIdx !== -1 ? posPressaoIdx + 1 : 1;
  const scorePressao = Number(personagem.atributos.pressao);
  const topPressaoScore = rankPressao[0]?.score || scorePressao;
  const pctBarPressao = Math.min(100, Math.round(scorePressao / Math.max(1, topPressaoScore) * 100));
  function updateChar(patch, historicoTexto) {
    const personagens = db.personagens.map(p => p.id === personagem.id ? {
      ...p,
      ...patch,
      historico: historicoTexto ? [{
        id: uid(),
        data: nowStr(),
        texto: historicoTexto
      }, ...(p.historico || [])] : p.historico || []
    } : p);
    saveDb({
      ...db,
      personagens
    });
  }
  function confirmarDistribuicao() {
    if (pendSum <= 0 || pendSum > personagem.pontosDisponiveis) return;
    const novosAtributos = {
      ...personagem.atributos
    };
    ATTRS.forEach(a => novosAtributos[a.key] += pend[a.key]);
    const partes = ATTRS.filter(a => pend[a.key] > 0).map(a => `+${pend[a.key]} ${a.label}`).join(", ");
    updateChar({
      atributos: novosAtributos,
      pontosDisponiveis: personagem.pontosDisponiveis - pendSum
    }, `Pontos distribuídos pelo jogador: ${partes}`);
    setPend({
      pressao: 0,
      forca: 0,
      velocidade: 0,
      resiliencia: 0
    });
  }
  function addTecnica() {
    if (!novaTecNome.trim()) return;
    updateChar({
      tecnicas: [...(personagem.tecnicas || []), {
        id: uid(),
        nome: novaTecNome.trim(),
        categoria: novaTecCat
      }]
    }, `Nova técnica adicionada: ${novaTecNome.trim()} (${novaTecCat})`);
    setNovaTecNome("");
  }
  function removeTecnica(id) {
    updateChar({
      tecnicas: personagem.tecnicas.filter(t => t.id !== id)
    });
  }
  function aplicarRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0) return;
    let patch = {};
    let texto = "";
    if (rec.atributo) {
      const label = ATTRS.find(a => a.key === rec.atributo)?.label;
      patch.atributos = {
        ...personagem.atributos,
        [rec.atributo]: personagem.atributos[rec.atributo] + pontos
      };
      texto = `${rec.tipo}: +${pontos} ${label} (aplicado direto em atributo)`;
    } else {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + pontos;
      texto = `${rec.tipo}: +${pontos} pontos disponíveis concedidos`;
    }
    if (rec.tipo.includes("Treino")) patch.treinosHoje = (personagem.treinosHoje || 0) + 1;
    if (rec.tipo.includes("Missão Principal") || rec.tipo.includes("Cena de Arco")) {
      patch.sorteiosComunsRestantes = (personagem.sorteiosComunsRestantes || 0) + 4;
      patch.sorteiosEspeciaisRestantes = (personagem.sorteiosEspeciaisRestantes || 0) + 1;
      texto += ` (+4 Giros Comuns e +1 Especial liberados)`;
    }
    if (rec.motivo.trim()) texto += ` — ${rec.motivo.trim()}`;
    updateChar(patch, texto);
    setRec({
      tipo: "Treino em ON (30 linhas)",
      pontos: 1,
      atributo: "",
      motivo: ""
    });
  }

  // Player Gacha Rolls
  function girarGachaComum() {
    if ((personagem.sorteiosComunsRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Comum disponíveis no momento. Conclua Treinos, Missões ou Cenas de Arco para ser liberado pela ADM!");
      return;
    }
    const total = RARIDADES_COMUNS.reduce((a, r) => a + r.peso, 0);
    let roll = Math.random() * total;
    let escolhida = RARIDADES_COMUNS[0];
    for (const r of RARIDADES_COMUNS) {
      if (roll < r.peso) {
        escolhida = r;
        break;
      }
      roll -= r.peso;
    }
    const pontos = Math.floor(Math.random() * (escolhida.max - escolhida.min + 1)) + escolhida.min;
    const drop = {
      id: uid(),
      data: nowStr(),
      nome: `Sorteio Comum (${escolhida.nome}): +${pontos} Pontos Disponíveis`,
      cor: escolhida.cor
    };
    updateChar({
      pontosDisponiveis: (personagem.pontosDisponiveis || 0) + pontos,
      sorteiosComunsRestantes: personagem.sorteiosComunsRestantes - 1,
      sorteiosDrops: [drop, ...(personagem.sorteiosDrops || [])]
    }, `🎲 Sorteio Comum (${escolhida.nome}): +${pontos} pontos disponíveis concedidos automaticamente`);
    setRewardModal({
      titulo: "SORTEIO GACHA COMUM!",
      raridade: escolhida.nome,
      cor: escolhida.cor,
      pontos,
      desc: escolhida.desc
    });
    playReiatsuSound('win');
  }
  function girarSorteioEspecial() {
    if ((personagem.sorteiosEspeciaisRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Especial disponíveis. Sorteios especiais são garantidos em Cenas de Arco (90 linhas) e Missões Principais!");
      return;
    }
    const escolhida = RECOMPENSAS_ESPECIAIS[Math.floor(Math.random() * RECOMPENSAS_ESPECIAIS.length)];
    let patch = {
      sorteiosEspeciaisRestantes: personagem.sorteiosEspeciaisRestantes - 1
    };
    if (escolhida.valor > 0) {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + escolhida.valor;
    }
    const drop = {
      id: uid(),
      data: nowStr(),
      nome: `🌟 Sorteio Especial: ${escolhida.nome}`,
      cor: escolhida.cor
    };
    patch.sorteiosDrops = [drop, ...(personagem.sorteiosDrops || [])];
    updateChar(patch, `🌟 Sorteio Especial: Conquistou [${escolhida.nome}]!`);
    setRewardModal({
      titulo: "RECOMPENSA ESPECIAL ÉPICA!",
      raridade: escolhida.raridade,
      cor: escolhida.cor,
      pontos: escolhida.valor,
      desc: escolhida.desc,
      nomeItem: escolhida.nome
    });
    playReiatsuSound('win');
  }
  function handleFotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      setEditFoto(evt.target.result);
      updateChar({
        foto: evt.target.result
      }, "Foto de perfil do personagem atualizada");
    };
    reader.readAsDataURL(file);
  }
  function salvarFotoUrl() {
    if (!editFoto.trim()) return;
    updateChar({
      foto: editFoto.trim()
    }, "Foto de perfil atualizada");
    alert("Foto atualizada com sucesso!");
  }
  function salvarDadosCompletos() {
    updateChar({
      nome: editNome.trim() || personagem.nome,
      whatsapp: editWhats.trim(),
      codigo: editCodigo.trim(),
      faceclaim: editFaceclaim.trim(),
      idadePlayer: editIdadePlayer.trim(),
      aniversarioPlayer: editAnivPlayer.trim(),
      idadeChar: editIdadeChar.trim(),
      aniversarioChar: editAnivChar.trim(),
      esquadrao: editEsquadrao.trim()
    }, "Dados cadastrais e narrativos atualizados");
    alert("Dados salvos com sucesso!");
  }
  function salvarZanpakuto() {
    updateChar({
      zanpakuto: zk
    }, "Zanpakutō atualizada");
  }
  function abrirGeradorZanpakutoAI(tipo) {
    setAiZkTipo(tipo);
    const ops = gerarOpcoesZanpakutoAI(personagem.nome, zk.notas, tipo);
    setAiZkOpcoes(ops);
    setShowZanpakutoAIModal(true);
  }
  function escolherOpcaoAI(opcao) {
    const novoZk = {
      ...zk,
      nome: zk.nome || opcao.nome,
      [aiZkTipo]: true,
      notas: (zk.notas ? zk.notas + "\n\n" : "") + `[${aiZkTipo.toUpperCase()} ESCOLHIDA]: ${opcao.comando}\nElemento: ${opcao.elemento}\nEfeito: ${opcao.habilidade}`
    };
    setZk(novoZk);
    updateChar({
      zanpakuto: novoZk
    }, `Evolução de Zanpakutō (${aiZkTipo.toUpperCase()}) selecionada via IA`);
    setShowZanpakutoAIModal(false);
    alert(`Parabéns! Sua ${aiZkTipo.toUpperCase()} foi registrada na sua ficha com sucesso!`);
  }

  // Generate WhatsApp Sheet
  function gerarFichaWhatsApp() {
    const totalKidos = (personagem.kidosConhecidos || []).length || (personagem.tecnicas || []).filter(t => ["Hadō", "Bakudō", "Kaidō"].includes(t.categoria)).length || 3;
    return `࣭    ㅤ
                    ⚯͛
                         ᩠      ⊹                ᩠          . 
                             ࣪       ✶  ͏t𝖍e
                  ﹙  𝐒𝐎𝐂𝐈𝐄𝐃𝐀𝐃𝐄 𝐃𝐀𝐒 𝐀𝐋𝐌𝐀𝐒  ﹚⊹
                 ɑ proteçɑ̃o 𝘀𝗲𝗺𝗽𝗿𝗲 seɾɑ́ 𝑑͟𝑎͟𝑑͟𝑎 
             no       𝗦𝗘𝗜𝗥𝗘𝗜𝗧𝗘𝗜    ɑqueles 
                  .  que   ɑ     𝒎𝒆𝒓𝒆𝒄𝒆𝒎  .ᐟ
                          ︶ ͝     ︶꒷꒦︶                        
         
                  ⊹    /   𝙫ocê é um shinigɑmi
                toɾne-se   𝓛𝐞𝐧𝐝𝐚́𝐫𝐢𝐨  ・・・
                                         ﹀                                   
            ͛  𝒇𝒊𝒄𝒉𝒂 𝒅𝒆   :   𝕻𝗘𝗥𝗦𝗢𝗡𝗔𝗚𝗘𝗠  „                        
      ɑpɾesentɑmos ɑ fichɑ que dɑɾɑ́ vidɑ 
      ɑo seu shinigɑmi(ɑ)! ⊹ ɑdiɑntɑmos ɑ 
      impoɾtɑnciɑ de fɑzeɾ ɑ fichɑ com 
      cɑlmɑ, ɑliɑdɑ ɑ leituɾɑ minunciosɑ 
      dos documentos disponibilizɑdos. 
                                                                       
            ﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗘 ﹚ 
           ✶  „  nome &\` quɑtɾo digit͟os .ᐟ
           ⎯  ${personagem.nome.split(" ")[0] || "Jogador"}, ${personagem.whatsapp ? personagem.whatsapp.slice(-4) : "0000"}
           ✶  „  dɑ͟tɑ de nɑscimento &\` idɑde .ᐟ
           ⎯  ${personagem.aniversarioPlayer || "15/07"} • ${personagem.idadePlayer || "20"} anos
           ✶  „  ɑçɑ̃o de suɑ ɑu͟t͟oɾiɑ .ᐟ
           ⎯ fɑvoɾ enviɑɾ sepɑɾɑdɑmente no privado.

            ﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗚𝗘𝗠 ﹚ 
           ✶  „  no͟me do peɾsonɑgem  .ᐟ
           ⎯     ${personagem.nome}
           ✶  „  idɑde &\` ɑn͟ive͟ɾsɑ́ɾio .ᐟ
           ⎯ ${personagem.idadeChar || "18"} anos - ${personagem.aniversarioChar || "15/07"}. 
           ✶  „  ɾeivindicɑçɑ̃o fɑ͟ciɑl  .ᐟ
           ⎯  ${personagem.faceclaim || personagem.nome}
           ✶  „  esquɑdɾɑ̃o de suɑ escolhɑ  .ᐟ
           ⎯   ${personagem.esquadrao || "11º Esquadrão"} 
           ✶  „  oɾigem e rɑçɑ .ᐟ
           ⎯  ${personagem.raca || "Shinigami"}
           ✶  „  zɑnpɑkutō .ᐟ
           ⎯ nome: ${personagem.zanpakuto?.nome || "Em despertar"}
           ⎯ stɑtus: ${personagem.zanpakuto?.bankai ? "Bankai Desperta" : personagem.zanpakuto?.shikai ? "Shikai Desperta" : "Lâmina Selada"}
           ✶  „  quɑntidɑde de kidōs .ᐟ
           ⎯   ${totalKidos}

            ﹙ 𝗔𝗧𝗥𝗜𝗕𝗨𝗧𝗢𝗦 𝗚𝗘𝗥𝗔𝗜𝗦 ﹚              
           ✶  „ distɾibuiçɑ̃o ɑtuɑl .ᐟ
           ⎯  pɾessɑ̃o espiɾituɑl: ${personagem.atributos.pressao}
           ⎯  foɾçɑ:  ${personagem.atributos.forca}           
           ⎯  velocidɑde: ${personagem.atributos.velocidade}
           ⎯  ɾesiliênciɑ: ${personagem.atributos.resiliencia}

            ﹙ 𝗧𝗘𝗥𝗠𝗢 𝗗𝗘 𝗖𝗢𝗡𝗦𝗘𝗡𝗧𝗜𝗠𝗘𝗡𝗧𝗢 ﹚     
      ₍  X  ₎ estou ciente de que dentɾo do 
      role plɑying gɑme encontɾɑɾei temɑs           
      e cenɑs que podem seɾ gɑtilhos, e 
      tɑmbém ɑssumo ɾesponsɑbilidɑde 
      de ɑceitɑçɑ̃o cɑso o peɾsonɑgem 
      sofɾɑ quɑlqueɾ dɑno nɑɾɾɑtivo.

                                   ✶
                           𝐩𝐬𝐲𝐜𝐡𝐞 ın 
                          ınspırαtıon`;
  }
  function copiarFichaWhatsApp() {
    const texto = gerarFichaWhatsApp();
    navigator.clipboard.writeText(texto);
    setCopiadoWhats(true);
    setTimeout(() => setCopiadoWhats(false), 3000);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center md:items-start gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-36 h-36 bleach-avatar-frame overflow-hidden bg-black relative group"
  }, /*#__PURE__*/React.createElement("img", {
    src: editFoto,
    alt: personagem.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-orange.png';
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition text-[11px] text-bleach-orange font-bold text-center p-2"
  }, "\uD83D\uDCF7 Alterar Foto", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleFotoUpload,
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "mt-2.5 px-3 py-1 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-[11px] text-bleach-creamDim rounded-lg cursor-pointer transition"
  }, "Subir Imagem", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleFotoUpload,
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-center md:text-left space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center md:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl sm:text-4xl tracking-widest text-bleach-orange"
  }, personagem.nome), /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === personagem.estado)?.color || C.green
  }, personagem.estado), /*#__PURE__*/React.createElement(Badge, {
    color: powerTier.color
  }, powerTier.title)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1"
  }, /*#__PURE__*/React.createElement("span", null, "Esquadr\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.esquadrao || "11º Esquadrão")), /*#__PURE__*/React.createElement("span", null, "Ra\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.raca)), /*#__PURE__*/React.createElement("span", null, "WhatsApp: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, maskWhats(personagem.whatsapp))), /*#__PURE__*/React.createElement("span", null, "Faceclaim: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.faceclaim || "Não definido"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-borderSoft p-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs mb-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-orange flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), " Pos. #", posFisico, " no Rank F\xEDsico"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-bleach-creamDim text-[11px]"
  }, "M\xE9dia: ", /*#__PURE__*/React.createElement("strong", null, scoreFisico))), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-bleach-panel2 h-2.5 rounded-full overflow-hidden border border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-bleach-orange to-amber-500 rounded-full transition-all duration-700 shadow-[0_0_10px_#FF6A13]",
    style: {
      width: `${pctBarFisico}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-borderSoft p-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs mb-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-blue flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF00"), " Pos. #", posPressao, " no Rank Reiatsu"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-bleach-creamDim text-[11px]"
  }, "Reiatsu: ", /*#__PURE__*/React.createElement("strong", null, scorePressao))), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-bleach-panel2 h-2.5 rounded-full overflow-hidden border border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-bleach-blue to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#4FB3E8]",
    style: {
      width: `${pctBarPressao}%`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2 w-full md:w-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: copiarFichaWhatsApp,
    className: "px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-2 transition active:scale-95"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1"), /*#__PURE__*/React.createElement("span", null, copiadoWhats ? "✓ Copiado com Sucesso!" : "Copiar Ficha WhatsApp"))))), /*#__PURE__*/React.createElement(Section, {
    title: "\uD83C\uDFB2 Sorteios de Recompensa & Giros de Gacha",
    subtitle: "Giros liberados pela administra\xE7\xE3o ap\xF3s Treinos em ON, Miss\xF5es Principais e Cenas de Arco"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl tracking-wider text-bleach-orange flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFB2"), " Sorteio Gacha Comum"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full bg-black text-bleach-orange font-mono font-bold text-xs border border-bleach-border"
  }, personagem.sorteiosComunsRestantes || 0, " giros dispon\xEDveis")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-4"
  }, "Sorteia pontos de atributo adicionais (de Comum a Lend\xE1rio) diretamente na sua ficha.")), /*#__PURE__*/React.createElement("button", {
    onClick: girarGachaComum,
    disabled: (personagem.sorteiosComunsRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosComunsRestantes || 0) > 0 ? "✨ Realizar Sorteio Comum" : "Sem Giros Comuns (Aguarde ADM)")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border-2 border-purple-500/40 purple-reiatsu-glow rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl tracking-wider text-purple-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF1F"), " Sorteio de Classe Especial"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full bg-black text-purple-300 font-mono font-bold text-xs border border-purple-500/40"
  }, personagem.sorteiosEspeciaisRestantes || 0, " especiais")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-4"
  }, "Recompensas supremas: Super B\xF4nus de Pontos, Kid\u014D Secreto Proibido ou a ", /*#__PURE__*/React.createElement("strong", null, "Miss\xE3o Narrativa Individual de Despertar de Poder"), "!")), /*#__PURE__*/React.createElement("button", {
    onClick: girarSorteioEspecial,
    disabled: (personagem.sorteiosEspeciaisRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosEspeciaisRestantes || 0) > 0 ? "⚡ Girar Sorteio Especial" : "Sem Giros Especiais"))), (personagem.sorteiosDrops || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowGachaHistory(!showGachaHistory),
    className: "text-xs text-bleach-orange font-bold uppercase hover:underline"
  }, showGachaHistory ? "▼ Ocultar Histórico de Drops" : "▶ Ver Histórico de Drops Anteriores"), showGachaHistory && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mt-3"
  }, personagem.sorteiosDrops.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: d.cor || C.cream
    },
    className: "font-semibold"
  }, d.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, d.data)))))), (personagem.pontosDisponiveis || 0) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-orange-950/60 via-bleach-panel to-orange-950/40 border-2 border-bleach-orange/60 rounded-xl p-5 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-orange flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728"), " PONTOS DISPON\xCDVEIS PARA DISTRIBUIR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, "Voc\xEA possui ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, personagem.pontosDisponiveis), " pontos concedidos pelo mestre/sorteios. Escolha onde investir.")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim"
  }, "Restam: "), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-lg text-bleach-orange font-mono"
  }, restante))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
  }, ATTRS.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.key,
    className: "bg-black/40 border border-bleach-border rounded-lg p-3 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold uppercase tracking-wider block",
    style: {
      color: a.color
    }
  }, a.label), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-muted"
  }, "Atual: ", personagem.atributos[a.key])), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPend(p => ({
      ...p,
      [a.key]: Math.max(0, p[a.key] - 1)
    })),
    disabled: pend[a.key] === 0,
    className: "w-8 h-8 rounded bg-bleach-panel border border-bleach-border text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-bleach-orange transition"
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    className: "w-8 text-center font-mono font-bold text-bleach-orange text-lg"
  }, "+", pend[a.key]), /*#__PURE__*/React.createElement("button", {
    onClick: () => restante > 0 && setPend(p => ({
      ...p,
      [a.key]: p[a.key] + 1
    })),
    disabled: restante <= 0,
    className: "w-8 h-8 rounded bg-bleach-panel border border-bleach-border text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-bleach-orange transition"
  }, "+"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: confirmarDistribuicao,
    disabled: pendSum === 0,
    className: "px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
  }, "Confirmar Distribui\xE7\xE3o (", pendSum, " pts)"))), /*#__PURE__*/React.createElement(Section, {
    title: "Atributos Espirituais",
    subtitle: "O valor puro do seu poder (sem conversores ou taxas ocultas)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, ATTRS.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.key,
    className: "bg-bleach-panel2 border border-bleach-borderSoft rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider",
    style: {
      color: a.color
    }
  }, a.label), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, a.desc)), /*#__PURE__*/React.createElement("span", {
    className: "text-3xl font-extrabold font-mono",
    style: {
      color: a.color
    }
  }, personagem.atributos[a.key])), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500",
    style: {
      width: `${Math.min(100, personagem.atributos[a.key] / 200 * 100)}%`,
      backgroundColor: a.color
    }
  })))))), /*#__PURE__*/React.createElement(Section, {
    title: "Zanpakut\u014D & Despertar Espiritual (IA)",
    subtitle: "Evolu\xE7\xE3o estritamente narrativa baseada na personalidade, cenas e treinos",
    right: /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => abrirGeradorZanpakutoAI("shikai"),
      className: "px-3 py-1.5 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-lg hover:bg-bleach-orange hover:text-black transition"
    }, "\uD83E\uDD16 Gerar 4 Op\xE7\xF5es Shikai (IA)"), /*#__PURE__*/React.createElement("button", {
      onClick: () => abrirGeradorZanpakutoAI("bankai"),
      className: "px-3 py-1.5 bg-purple-950 border border-purple-500 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-600 hover:text-white transition"
    }, "\u26A1 Gerar 4 Op\xE7\xF5es Bankai (IA)"))
  }, isAdmin ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Nome da Zanpakut\u014D"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: zk.nome || "",
    onChange: e => setZk({
      ...zk,
      nome: e.target.value
    }),
    placeholder: "Ex: Zangetsu",
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-xs text-bleach-cream flex-1 bg-bleach-panel2 p-3 border border-bleach-borderSoft rounded-lg cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!zk.shikai,
    onChange: e => setZk({
      ...zk,
      shikai: e.target.checked
    }),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("span", null, "Shikai Desbloqueado")), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-xs text-bleach-cream flex-1 bg-bleach-panel2 p-3 border border-bleach-borderSoft rounded-lg cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!zk.bankai,
    onChange: e => setZk({
      ...zk,
      bankai: e.target.checked
    }),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("span", null, "Bankai Desbloqueado"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Notas Narrativas / Propriedades"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: zk.notas || "",
    onChange: e => setZk({
      ...zk,
      notas: e.target.value
    }),
    placeholder: "Descreva o elemento, comando de libera\xE7\xE3o ou conquistas narrativas...",
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: salvarZanpakuto,
    className: "px-4 py-2 bg-bleach-orange text-black font-bold text-xs uppercase rounded-lg hover:bg-orange-400"
  }, "Salvar Zanpakut\u014D")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between bg-bleach-panel2 border border-bleach-borderSoft p-3.5 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted uppercase"
  }, "Nome Revelado"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-bold text-bleach-cream font-cinzel"
  }, personagem.zanpakuto?.nome || "??? (Ainda não revelado)")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Badge, {
    color: personagem.zanpakuto?.shikai ? C.green : C.muted
  }, "Shikai: ", personagem.zanpakuto?.shikai ? "Desbloqueado" : "Bloqueado"), /*#__PURE__*/React.createElement(Badge, {
    color: personagem.zanpakuto?.bankai ? C.purple : C.muted
  }, "Bankai: ", personagem.zanpakuto?.bankai ? "Desbloqueado" : "Bloqueado"))), personagem.zanpakuto?.notas && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/40 border border-bleach-borderSoft rounded-lg text-xs text-bleach-creamDim leading-relaxed whitespace-pre-line"
  }, "\uD83D\uDCDC ", personagem.zanpakuto.notas))), /*#__PURE__*/React.createElement(Section, {
    title: "Kid\u014D e T\xE9cnicas Aprendidas",
    subtitle: "Feiti\xE7os dominados pelo Shinigami"
  }, (personagem.tecnicas || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhuma t\xE9cnica registrada at\xE9 o momento.") : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2.5 mb-4"
  }, personagem.tecnicas.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "bg-bleach-panel2 border border-bleach-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded bg-black text-[10px] font-bold text-bleach-orange uppercase"
  }, t.categoria), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-bleach-cream"
  }, t.nome), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => removeTecnica(t.id),
    className: "text-red-400 hover:text-red-300 font-bold ml-1",
    title: "Remover t\xE9cnica"
  }, "\xD7")))), isAdmin && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t border-bleach-borderSoft flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: novaTecCat,
    onChange: e => setNovaTecCat(e.target.value),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, CATEGORIAS_TECNICA.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nome da t\xE9cnica (Ex: Had\u014D #31 \u2014 Shakkah\u014D)",
    value: novaTecNome,
    onChange: e => setNovaTecNome(e.target.value),
    className: "flex-1 min-w-[180px] bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addTecnica,
    className: "px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream hover:border-bleach-orange rounded-lg text-xs font-bold uppercase"
  }, "+ Adicionar"))), isAdmin && /*#__PURE__*/React.createElement(Section, {
    title: "\uD83D\uDC51 Painel de Controle da Administra\xE7\xE3o (Mestre)",
    className: "border-bleach-orange/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-4 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "\uD83C\uDF81 Conceder Recompensa / Aprova\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Tipo de Atividade"), /*#__PURE__*/React.createElement("select", {
    value: rec.tipo,
    onChange: e => setRec({
      ...rec,
      tipo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }, TIPOS_RECOMPENSA.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Pontos a Conceder"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: rec.pontos,
    onChange: e => setRec({
      ...rec,
      pontos: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Destino dos Pontos"), /*#__PURE__*/React.createElement("select", {
    value: rec.atributo,
    onChange: e => setRec({
      ...rec,
      atributo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Para Pontos Dispon\xEDveis (Jogador escolhe)"), ATTRS.map(a => /*#__PURE__*/React.createElement("option", {
    key: a.key,
    value: a.key
  }, "Aplicar direto em ", a.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Motivo / Descri\xE7\xE3o"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Treino em ON de 30 linhas aprovado no Sereitei",
    value: rec.motivo,
    onChange: e => setRec({
      ...rec,
      motivo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: aplicarRecompensa,
    className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "Aprovar Recompensa"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosComunsRestantes: (personagem.sorteiosComunsRestantes || 0) + 1
    }, "+1 Giro Comum liberado pela ADM"),
    className: "px-3 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream text-xs font-bold rounded-lg hover:border-bleach-orange"
  }, "+1 Giro Comum"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosEspeciaisRestantes: (personagem.sorteiosEspeciaisRestantes || 0) + 1
    }, "+1 Giro Especial liberado pela ADM"),
    className: "px-3 py-2 bg-purple-950 border border-purple-500 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-600"
  }, "+1 Giro Especial"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      treinosHoje: 0
    }, "Fadiga zerada pela ADM"),
    className: "px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream text-xs font-bold rounded-lg hover:border-bleach-orange ml-auto"
  }, "\uD83D\uDD04 Resetar Fadiga"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-4 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim"
  }, "Dados Cadastrais & Perfil do Personagem"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editNome,
    onChange: e => setEditNome(e.target.value),
    placeholder: "Nome do Personagem",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editWhats,
    onChange: e => setEditWhats(e.target.value),
    placeholder: "WhatsApp (ex: 11999998888)",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editCodigo,
    onChange: e => setEditCodigo(e.target.value),
    placeholder: "C\xF3digo de Acesso",
    className: "bg-black border border-bleach-border rounded p-2 text-xs font-mono text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editFaceclaim,
    onChange: e => setEditFaceclaim(e.target.value),
    placeholder: "Faceclaim / Reivindica\xE7\xE3o Facial",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editEsquadrao,
    onChange: e => setEditEsquadrao(e.target.value),
    placeholder: "Esquadr\xE3o",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editIdadePlayer,
    onChange: e => setEditIdadePlayer(e.target.value),
    placeholder: "Idade do Player",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editAnivPlayer,
    onChange: e => setEditAnivPlayer(e.target.value),
    placeholder: "Anivers\xE1rio Player (dd/mm)",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editIdadeChar,
    onChange: e => setEditIdadeChar(e.target.value),
    placeholder: "Idade do Personagem",
    className: "bg-black border border-bleach-border rounded p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: salvarDadosCompletos,
    className: "w-full py-2 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream hover:border-bleach-orange rounded font-bold uppercase"
  }, "Salvar Dados Cadastrais")))), /*#__PURE__*/React.createElement(Section, {
    title: "Hist\xF3rico de Registros",
    subtitle: "Linha do tempo de treinos, miss\xF5es e recompensas"
  }, (personagem.historico || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum registro ainda.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, personagem.historico.slice(0, 20).map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    className: "border-l-2 border-bleach-orange pl-3 py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, h.data), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim mt-0.5"
  }, h.texto))))), rewardModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-bleach-orange rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl reiatsu-glow relative animate-bounce-short"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl mb-2"
  }, "\uD83C\uDF81"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl tracking-widest text-bleach-orange mb-1"
  }, rewardModal.titulo), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-bold uppercase my-3 inline-block px-4 py-1 rounded-full border",
    style: {
      color: rewardModal.cor,
      borderColor: rewardModal.cor
    }
  }, rewardModal.raridade), rewardModal.nomeItem && /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-white mb-2"
  }, rewardModal.nomeItem), rewardModal.pontos > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-base text-bleach-orange font-mono font-bold mb-2"
  }, "+", rewardModal.pontos, " Pontos Livres Concedidos!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-6 leading-relaxed"
  }, rewardModal.desc), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRewardModal(null),
    className: "px-6 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "Resgatar Recompensa"))), showZanpakutoAIModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-bleach-orange rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowZanpakutoAIModal(false),
    className: "absolute top-4 right-4 text-bleach-muted hover:text-white text-lg font-bold"
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase"
  }, "Intelig\xEAncia Artificial da Sociedade das Almas"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl text-bleach-orange tracking-widest mt-2"
  }, "ESCOLHA SUA ", aiZkTipo.toUpperCase()), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "A IA analisou sua ficha e gerou ", /*#__PURE__*/React.createElement("strong", null, "4 op\xE7\xF5es exclusivas"), " adaptadas ao seu perfil. Escolha a sua favorita:")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, aiZkOpcoes.map((op, idx) => /*#__PURE__*/React.createElement("div", {
    key: op.id,
    className: "bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange p-4 rounded-xl transition"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase text-bleach-orange"
  }, "Op\xE7\xE3o #", idx + 1, " \u2022 ", op.elemento), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl text-white tracking-wider"
  }, op.nome)), /*#__PURE__*/React.createElement("button", {
    onClick: () => escolherOpcaoAI(op),
    className: "px-4 py-1.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg hover:bg-orange-400 shadow transition"
  }, "\u2713 Escolher Esta ", aiZkTipo.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-cream font-mono italic mb-1.5 text-bleach-orange"
  }, "Comando: \"", op.comando, "\""), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, op.habilidade)))))));
}

// TAB: ADMIN CONTROL PANEL (HIERARCHY, TASKS, AI ARBITER, DICE ROLLER WITH TENSION)
function AdminPanel({
  db,
  saveDb,
  onAbrirFicha
}) {
  const [abaAdmin, setAbaAdmin] = useState("fichas");
  const [busca, setBusca] = useState("");

  // New Character Form
  const [novo, setNovo] = useState({
    nome: "",
    whatsapp: "",
    codigo: "",
    raca: "Shinigami",
    esquadrao: "11º Esquadrão",
    faceclaim: "",
    idadePlayer: "20",
    aniversarioPlayer: "01/01",
    idadeChar: "18",
    aniversarioChar: "01/01"
  });

  // Admin Password
  const [novaSenha, setNovaSenha] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [msgPass, setMsgPass] = useState("");

  // Max Admin - Sub Admins Management
  const [novoSubAdm, setNovoSubAdm] = useState({
    nome: "",
    cargo: "Avaliador de Cenas & Fichas",
    charId: db.personagens[0]?.id || ""
  });

  // Admin Tasks Logger
  const [tarefaSelecionada, setTarefaSelecionada] = useState("cenas");
  const [admExecutor, setAdmExecutor] = useState(db.administradores[0]?.nome || "ADM");
  const [charAlvoAdm, setCharAlvoAdm] = useState(db.personagens[0]?.id || "");
  const [fichasAvaliadasContador, setFichasAvaliadasContador] = useState(0);

  // AI Text Combat Arbiter
  const [iaLutador1, setIaLutador1] = useState(db.personagens[0]?.nome || "Lutador 1");
  const [iaLutador2, setIaLutador2] = useState(db.personagens[1]?.nome || "Lutador 2");
  const [iaCenaTexto, setIaCenaTexto] = useState("");
  const [iaResultado, setIaResultado] = useState(null);
  const [iaProcessando, setIaProcessando] = useState(false);

  // Dice Roller with Tension
  const [dadoTipo, setDadoTipo] = useState(20);
  const [dadoChar, setDadoChar] = useState(db.personagens[0]?.nome || "Geral");
  const [dadoRolando, setDadoRolando] = useState(false);
  const [dadoResultado, setDadoResultado] = useState(null);
  const [dadoAnimVal, setDadoAnimVal] = useState(1);
  function criarPersonagem(e) {
    e.preventDefault();
    if (!novo.nome.trim() || !novo.whatsapp.trim() || !novo.codigo.trim()) return;
    const p = {
      id: uid(),
      nome: novo.nome.trim(),
      foto: "assets/ichigo-orange.png",
      whatsapp: novo.whatsapp.trim(),
      codigo: novo.codigo.trim(),
      raca: novo.raca,
      esquadrao: novo.esquadrao,
      faceclaim: novo.faceclaim.trim() || novo.nome.trim(),
      idadePlayer: novo.idadePlayer.trim(),
      aniversarioPlayer: novo.aniversarioPlayer.trim(),
      idadeChar: novo.idadeChar.trim(),
      aniversarioChar: novo.aniversarioChar.trim(),
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      atributos: {
        pressao: 10,
        forca: 10,
        velocidade: 10,
        resiliencia: 10
      },
      kidosConhecidos: [{
        id: "h4",
        numero: 4,
        nome: "Byakurai",
        cat: "Hadō",
        custoReiatsu: 3
      }, {
        id: "b1",
        numero: 1,
        nome: "Sai",
        cat: "Bakudō",
        custoReiatsu: 2
      }],
      tecnicas: [{
        id: uid(),
        nome: "Hadō #4 — Byakurai",
        categoria: "Hadō"
      }, {
        id: uid(),
        nome: "Bakudō #1 — Sai",
        categoria: "Bakudō"
      }],
      zanpakuto: {
        nome: "",
        shikai: false,
        bankai: false,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{
        id: uid(),
        data: nowStr(),
        texto: "Ficha criada na Sociedade das Almas (+20 pts livres + 2 Giros Comuns)"
      }]
    };
    saveDb({
      ...db,
      personagens: [...db.personagens, p]
    });
    setNovo({
      nome: "",
      whatsapp: "",
      codigo: "",
      raca: "Shinigami",
      esquadrao: "11º Esquadrão",
      faceclaim: "",
      idadePlayer: "20",
      aniversarioPlayer: "01/01",
      idadeChar: "18",
      aniversarioChar: "01/01"
    });
    alert("Ficha criada com sucesso!");
  }
  function adicionarSubAdm() {
    if (!novoSubAdm.nome.trim()) return;
    const sub = {
      id: uid(),
      nome: novoSubAdm.nome.trim(),
      cargo: novoSubAdm.cargo,
      nivel: "menor",
      charId: novoSubAdm.charId
    };
    saveDb({
      ...db,
      administradores: [...(db.administradores || []), sub]
    });
    setNovoSubAdm({
      nome: "",
      cargo: "Avaliador de Cenas & Fichas",
      charId: db.personagens[0]?.id || ""
    });
  }
  function removerSubAdm(id) {
    saveDb({
      ...db,
      administradores: db.administradores.filter(a => a.id !== id)
    });
  }

  // Record Admin Activity & Award Points to Admin's Character
  function registrarAtividadeAdm() {
    let pontosGanhos = 0;
    let descTarefa = "";
    if (tarefaSelecionada === "cenas") {
      pontosGanhos = 8;
      descTarefa = "Avaliação de Cenas de Arco (+8 pontos)";
    } else if (tarefaSelecionada === "fichas") {
      if (fichasAvaliadasContador < 7) {
        alert("A regra de avaliação de fichas exige no mínimo 7 fichas para liberar os 3 pontos!");
        return;
      }
      pontosGanhos = 3;
      descTarefa = `Avaliação e Aprovação de ${fichasAvaliadasContador} Fichas (+3 pontos)`;
      setFichasAvaliadasContador(0);
    } else if (tarefaSelecionada === "missao") {
      pontosGanhos = 15;
      descTarefa = "Narração de Missão Principal (+15 pontos e giros concedidos)";
    } else if (tarefaSelecionada === "juiz") {
      pontosGanhos = 4;
      descTarefa = "Arbitragem de Luta em ON (+4 pontos)";
    }
    const registro = {
      id: uid(),
      admNome: admExecutor,
      tarefa: descTarefa,
      pontosGanhos,
      data: nowStr()
    };

    // Award points to the target character
    const personagens = db.personagens.map(p => {
      if (p.id === charAlvoAdm) {
        return {
          ...p,
          pontosDisponiveis: (p.pontosDisponiveis || 0) + pontosGanhos,
          sorteiosComunsRestantes: tarefaSelecionada === "missao" ? (p.sorteiosComunsRestantes || 0) + 4 : p.sorteiosComunsRestantes || 0,
          sorteiosEspeciaisRestantes: tarefaSelecionada === "missao" ? (p.sorteiosEspeciaisRestantes || 0) + 1 : p.sorteiosEspeciaisRestantes || 0,
          historico: [{
            id: uid(),
            data: nowStr(),
            texto: `Recompensa de ADM (${descTarefa}) concedida na ficha (+${pontosGanhos} pts)`
          }, ...(p.historico || [])]
        };
      }
      return p;
    });
    saveDb({
      ...db,
      registrosTarefasAdm: [registro, ...(db.registrosTarefasAdm || [])],
      personagens
    });
    alert(`Atividade registrada com sucesso! +${pontosGanhos} pontos foram depositados na ficha de destino.`);
  }

  // AI Text Combat Judge Simulation
  function julgarCombateComIA() {
    if (!iaCenaTexto.trim()) {
      alert("Por favor, cole o texto narrativo da cena dos combatentes!");
      return;
    }
    setIaProcessando(true);
    playReiatsuSound('kido');
    setTimeout(() => {
      const p1Obj = db.personagens.find(p => p.nome.toLowerCase().includes(iaLutador1.toLowerCase())) || db.personagens[0];
      const p2Obj = db.personagens.find(p => p.nome.toLowerCase().includes(iaLutador2.toLowerCase())) || db.personagens[1];
      const diffVel = (p1Obj?.atributos?.velocidade || 10) - (p2Obj?.atributos?.velocidade || 10);
      const diffPressao = (p1Obj?.atributos?.pressao || 10) - (p2Obj?.atributos?.pressao || 10);
      const diffForca = (p1Obj?.atributos?.forca || 10) - (p2Obj?.atributos?.forca || 10);
      let conclusao = "";
      if (Math.abs(diffVel) >= 15) {
        conclusao = `${diffVel > 0 ? p1Obj.nome : p2Obj.nome} possui superioridade nítida de velocidade (+${Math.abs(diffVel)} em Hohō), esquivando da primeira investida e conseguindo ângulo crítico de contra-ataque.`;
      } else if (Math.abs(diffPressao) >= 15) {
        conclusao = `A pressão espiritual avassaladora de ${diffPressao > 0 ? p1Obj.nome : p2Obj.nome} (+${Math.abs(diffPressao)} de Reiatsu) impõe peso gravitacional anulando feitiços fracos do adversário.`;
      } else {
        conclusao = `Combate extremamente equilibrado! Ambos sofrem desgaste equivalente e o desfecho depende de um teste de dado ou ação de apoio narrativo.`;
      }
      const resultadoFinal = {
        id: uid(),
        data: nowStr(),
        lutador1: `${p1Obj.nome} (Vel: ${p1Obj.atributos.velocidade}, Pressão: ${p1Obj.atributos.pressao}, Força: ${p1Obj.atributos.forca})`,
        lutador2: `${p2Obj.nome} (Vel: ${p2Obj.atributos.velocidade}, Pressão: ${p2Obj.atributos.pressao}, Força: ${p2Obj.atributos.forca})`,
        cenaDesc: iaCenaTexto.slice(0, 150) + "...",
        veredito: `⚖️ Veredito Oficial da IA:\n\n1. ANÁLISE DE ATRIBUTOS: ${conclusao}\n\n2. DECISÃO NARRATIVA: Levando em conta o texto da cena e a lógica do sistema de Bleach, ${p1Obj.nome} e ${p2Obj.nome} devem atualizar seus estados conforme o impacto de impacto e custo de Reiatsu gasto na ação.`
      };
      saveDb({
        ...db,
        iaJulgamentos: [resultadoFinal, ...(db.iaJulgamentos || [])]
      });
      setIaResultado(resultadoFinal);
      setIaProcessando(false);
      playReiatsuSound('win');
    }, 1200);
  }

  // Tension Dice Roller
  function rolarDadoComTensao() {
    setDadoRolando(true);
    setDadoResultado(null);
    playReiatsuSound('roll');
    let ticks = 0;
    const maxTicks = 18; // longer duration for suspense
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * dadoTipo) + 1;
      setDadoAnimVal(rand);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * dadoTipo) + 1;
        setDadoAnimVal(finalVal);
        let categoria = "";
        let cor = C.muted;
        const pct = finalVal / dadoTipo;
        if (pct <= 0.1 || finalVal === 1) {
          categoria = "☠️ Extremo Negativo (Reze / Catástrofe Espiritual)";
          cor = C.red;
        } else if (pct <= 0.35) {
          categoria = "🔴 Negativo (Falha / Dano Sofrido)";
          cor = C.red;
        } else if (pct <= 0.65) {
          categoria = "🟡 Neutro (Sucesso Parcial com Custo)";
          cor = C.yellow;
        } else if (pct <= 0.9) {
          categoria = "🟢 Positivo (Sucesso Limpo)";
          cor = C.green;
        } else {
          categoria = "⚡ Extremo (Sucesso Crítico / Despertar Espiritual)";
          cor = C.yellow;
        }
        const registroDado = {
          id: uid(),
          autor: "Administração",
          personagem: dadoChar,
          dado: `d${dadoTipo}`,
          resultado: finalVal,
          categoria,
          data: nowStr()
        };
        saveDb({
          ...db,
          rolagensDadosPublicas: [registroDado, ...(db.rolagensDadosPublicas || []).slice(0, 19)]
        });
        setDadoResultado({
          val: finalVal,
          cat: categoria,
          cor
        });
        setDadoRolando(false);
        playReiatsuSound(pct >= 0.7 ? 'win' : 'roll');
      }
    }, 80);
  }
  function alterarSenhaAdmin() {
    if (!novaSenha.trim()) return;
    saveDb({
      ...db,
      adminSenha: novaSenha.trim()
    });
    setMsgPass("Senha alterada com sucesso!");
    setNovaSenha("");
    setTimeout(() => setMsgPass(""), 3000);
  }
  const filtrados = db.personagens.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.whatsapp.includes(busca));
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Painel de Controle da Administra\xE7\xE3o & Comandante Supremo",
    subtitle: "Gest\xE3o completa de jogadores, hierarquia de ADMs, afazeres e arbitragem com IA",
    right: /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowChangePassword(!showChangePassword),
      className: "px-3 py-1.5 bg-bleach-panel2 border border-bleach-border text-bleach-orange rounded text-xs font-semibold"
    }, "\uD83D\uDD11 Alterar Senha ADM"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 border-b border-bleach-borderSoft pb-3 mb-4"
  }, [{
    id: "fichas",
    label: "👥 Fichas dos Players"
  }, {
    id: "adms",
    label: "👑 Gestão de ADMs"
  }, {
    id: "tarefas",
    label: "📋 Afazeres & Ganhos de ADM"
  }, {
    id: "ia-arbitro",
    label: "🤖 IA Juíza de Combates"
  }, {
    id: "dados-adm",
    label: "🎲 Mesa de Dados da ADM"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setAbaAdmin(t.id),
    className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${abaAdmin === t.id ? "bg-bleach-orange text-black font-extrabold shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, t.label))), showChangePassword && /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-orange/40 rounded-lg p-4 mb-4 space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-bleach-orange uppercase"
  }, "Alterar Senha do Administrador"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nova senha do ADM",
    value: novaSenha,
    onChange: e => setNovaSenha(e.target.value),
    className: "flex-1 bg-black border border-bleach-border rounded px-3 py-1.5 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: alterarSenhaAdmin,
    className: "px-4 py-1.5 bg-bleach-orange text-black font-bold text-xs uppercase rounded"
  }, "Salvar Senha")), msgPass && /*#__PURE__*/React.createElement("div", {
    className: "text-green-400 text-xs"
  }, msgPass))), abaAdmin === "fichas" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Criar Novo Personagem no Site",
    subtitle: "Cadastre a ficha oficial com login para o jogador"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: criarPersonagem,
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nome do Personagem",
    value: novo.nome,
    onChange: e => setNovo({
      ...novo,
      nome: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "WhatsApp (Ex: 11999998888)",
    value: novo.whatsapp,
    onChange: e => setNovo({
      ...novo,
      whatsapp: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "C\xF3digo de Acesso (Ex: REN-123)",
    value: novo.codigo,
    onChange: e => setNovo({
      ...novo,
      codigo: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs font-mono text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Faceclaim (Ex: Freya Mavor)",
    value: novo.faceclaim,
    onChange: e => setNovo({
      ...novo,
      faceclaim: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Idade do Personagem",
    value: novo.idadeChar,
    onChange: e => setNovo({
      ...novo,
      idadeChar: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Anivers\xE1rio Personagem (dd/mm)",
    value: novo.aniversarioChar,
    onChange: e => setNovo({
      ...novo,
      aniversarioChar: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("select", {
    value: novo.raca,
    onChange: e => setNovo({
      ...novo,
      raca: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Shinigami"
  }, "Shinigami"), /*#__PURE__*/React.createElement("option", {
    value: "Shinigami Ex-Humano"
  }, "Shinigami Ex-Humano")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg py-2 hover:brightness-110"
  }, "+ Criar Ficha com Login"))), /*#__PURE__*/React.createElement(Section, {
    title: `Fichas Registradas (${db.personagens.length})`,
    subtitle: "Selecione um jogador para gerenciar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Buscar por nome do personagem ou WhatsApp...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-orange"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-3"
  }, filtrados.map(p => {
    const total = Object.values(p.atributos).reduce((a, b) => a + b, 0);
    const tier = getPowerTier(total);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "bg-bleach-panel2 border border-bleach-borderSoft hover:border-bleach-orange/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.foto || 'assets/ichigo-orange.png',
      alt: p.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-orange.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, p.nome), /*#__PURE__*/React.createElement(Badge, {
      color: ESTADOS.find(e => e.key === p.estado)?.color || C.green
    }, p.estado), /*#__PURE__*/React.createElement(Badge, {
      color: tier.color
    }, tier.title)), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-creamDim flex flex-wrap gap-x-4 gap-y-1 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "WhatsApp: ", /*#__PURE__*/React.createElement("strong", null, maskWhats(p.whatsapp))), /*#__PURE__*/React.createElement("span", null, "C\xF3digo: ", /*#__PURE__*/React.createElement("strong", {
      className: "font-mono text-bleach-orange"
    }, p.codigo)), /*#__PURE__*/React.createElement("span", null, "Giros: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-bleach-orange"
    }, p.sorteiosComunsRestantes || 0, " comuns"), " \u2022 ", /*#__PURE__*/React.createElement("strong", {
      className: "text-purple-400"
    }, p.sorteiosEspeciaisRestantes || 0, " esp"))))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted uppercase"
    }, "Pontos Livres"), /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-bleach-orange font-mono"
    }, p.pontosDisponiveis || 0)), /*#__PURE__*/React.createElement("button", {
      onClick: () => onAbrirFicha(p.id),
      className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:bg-orange-400 transition"
    }, "Gerenciar Ficha \u2192")));
  })))), abaAdmin === "adms" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Gest\xE3o de Administradores (ADM M\xE1ximo)",
    subtitle: "Controle quem possui acesso \xE0 administra\xE7\xE3o e seus cargos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
  }, db.administradores.map(adm => /*#__PURE__*/React.createElement("div", {
    key: adm.id,
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${adm.nivel === "maximo" ? "text-yellow-400 border-yellow-500 bg-yellow-950/40" : "text-bleach-orange border-bleach-orange bg-black"}`
  }, adm.nivel === "maximo" ? "👑 ADM Máximo" : "🛡️ ADM"), adm.nivel !== "maximo" && /*#__PURE__*/React.createElement("button", {
    onClick: () => removerSubAdm(adm.id),
    className: "text-red-400 text-xs hover:underline"
  }, "Remover")), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-bleach-cream text-base"
  }, adm.nome), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted mt-1"
  }, adm.cargo))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/50 border border-bleach-borderSoft p-4 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "+ Nomear Novo Administrador"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nome do ADM",
    value: novoSubAdm.nome,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      nome: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Cargo (ex: Juiz de Lutas & Cenas)",
    value: novoSubAdm.cargo,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      cargo: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("select", {
    value: novoSubAdm.charId,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      charId: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, "Ficha: ", p.nome)))), /*#__PURE__*/React.createElement("button", {
    onClick: adicionarSubAdm,
    className: "px-4 py-2 bg-bleach-orange text-black font-bold text-xs uppercase rounded-lg hover:bg-orange-400"
  }, "Adicionar Administrador")))), abaAdmin === "tarefas" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Afazeres do ADM & Distribui\xE7\xE3o de Ganhos",
    subtitle: "Registre suas atividades conclu\xEDdas e deposite os pontos direto na sua ficha de personagem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-5 rounded-xl space-y-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "Registrar Atividade de ADM Conclu\xEDda"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Tipo de Tarefa Realizada"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "cenas",
    onChange: () => setTarefaSelecionada("cenas"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Avaliar Cenas de Arco (90 linhas)"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +8 Pontos para a ficha do ADM"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "fichas",
    onChange: () => setTarefaSelecionada("fichas"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Avaliar e Aprovar Fichas (A cada 7 fichas)"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +3 Pontos a cada 7 fichas aprovadas"), tarefaSelecionada === "fichas" && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-creamDim"
  }, "Contador:"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFichasAvaliadasContador(Math.max(0, fichasAvaliadasContador - 1)),
    className: "w-6 h-6 rounded bg-bleach-panel border text-white font-bold"
  }, "-"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold font-mono text-bleach-orange text-sm"
  }, fichasAvaliadasContador, " / 7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFichasAvaliadasContador(fichasAvaliadasContador + 1),
    className: "w-6 h-6 rounded bg-bleach-panel border text-white font-bold"
  }, "+")))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "missao",
    onChange: () => setTarefaSelecionada("missao"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Narrar Miss\xE3o Principal"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: Mesma recompensa dos players (+15 pts + 4 Giros + 1 Esp)"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "juiz",
    onChange: () => setTarefaSelecionada("juiz"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Ser Juiz de Combate em ON"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +4 Pontos de participa\xE7\xE3o"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Nome do ADM"), /*#__PURE__*/React.createElement("select", {
    value: admExecutor,
    onChange: e => setAdmExecutor(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }, db.administradores.map(a => /*#__PURE__*/React.createElement("option", {
    key: a.id,
    value: a.nome
  }, a.nome)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Ficha de Destino dos Pontos"), /*#__PURE__*/React.createElement("select", {
    value: charAlvoAdm,
    onChange: e => setCharAlvoAdm(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome))))), /*#__PURE__*/React.createElement("button", {
    onClick: registrarAtividadeAdm,
    className: "w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110"
  }, "Confirmar e Depositar Ganhos na Ficha")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-5 rounded-xl flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim mb-3"
  }, "Hist\xF3rico de Afazeres Registrados"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 max-h-80 overflow-y-auto pr-1"
  }, (db.registrosTarefasAdm || []).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "p-3 bg-black/60 border border-bleach-borderSoft rounded-lg text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, r.admNome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, r.data)), /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-creamDim"
  }, r.tarefa))))))))), abaAdmin === "ia-arbitro" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83E\uDD16 IA Ju\xEDza de Combate (\xC1rbitro Neutro de Luta)",
    subtitle: "Utilize quando houver d\xFAvida entre as a\xE7\xF5es dos players para uma an\xE1lise justa por atributos e l\xF3gica de cena"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Combatente 1"), /*#__PURE__*/React.createElement("select", {
    value: iaLutador1,
    onChange: e => setIaLutador1(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Combatente 2"), /*#__PURE__*/React.createElement("select", {
    value: iaLutador2,
    onChange: e => setIaLutador2(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Cole aqui as a\xE7\xF5es e texto da cena de ambos os lutadores"), /*#__PURE__*/React.createElement("textarea", {
    rows: 5,
    value: iaCenaTexto,
    onChange: e => setIaCenaTexto(e.target.value),
    placeholder: "Ex: Jogador 1 declarou que usou Shunpo direto pelas costas para desferir um corte, enquanto o Jogador 2 declarou que estava de costas mas j\xE1 canalizava um Bakud\u014D #61 para prender quem se aproximasse...",
    className: "w-full bg-black border border-bleach-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-bleach-orange"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: julgarCombateComIA,
    disabled: iaProcessando,
    className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 disabled:opacity-50"
  }, iaProcessando ? "Analisando cena e calculando velocidades..." : "⚖️ Processar Veredito da IA"), iaResultado && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-5 bg-black/80 border-2 border-bleach-blue rounded-xl space-y-3 blue-reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-title text-xl text-bleach-blue tracking-wider"
  }, "RESULTADO DO JULGAMENTO"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, iaResultado.data)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-cream leading-relaxed whitespace-pre-line bg-bleach-panel p-4 rounded-lg border border-bleach-borderSoft"
  }, iaResultado.veredito))))), abaAdmin === "dados-adm" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83C\uDFB2 Mesa de Dados da ADM com Tens\xE3o & Drama",
    subtitle: "Rolagens com delay e suspens\xE3o dram\xE1tica vis\xEDveis no mural para todos os jogadores"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Escolha o Tipo de Dado"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, [2, 4, 6, 8, 10, 12, 20, 100].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDadoTipo(d),
    className: `px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${dadoTipo === d ? "bg-bleach-orange text-black border-bleach-orange" : "bg-black text-bleach-creamDim border-bleach-border"}`
  }, "d", d)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Personagem Alvo da Rolagem"), /*#__PURE__*/React.createElement("select", {
    value: dadoChar,
    onChange: e => setDadoChar(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, db.personagens.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome)))), /*#__PURE__*/React.createElement("button", {
    onClick: rolarDadoComTensao,
    disabled: dadoRolando,
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 disabled:opacity-50 transition"
  }, dadoRolando ? "Concentrando Tensão na Rolagem..." : `🎲 Rolar d${dadoTipo} para ${dadoChar}`)), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border rounded-2xl p-6 flex flex-col items-center justify-center text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-28 h-28 rounded-2xl bg-gradient-to-br from-bleach-panel2 to-black border-4 border-bleach-orange flex items-center justify-center text-5xl font-black font-mono text-bleach-cream shadow-2xl transition ${dadoRolando ? "dice-suspense" : "reiatsu-glow"}`
  }, dadoAnimVal), dadoResultado && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-3 bg-bleach-panel2 border border-bleach-border rounded-xl w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-wider text-bleach-muted"
  }, "Resultado Final"), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-sm mt-0.5",
    style: {
      color: dadoResultado.cor
    }
  }, dadoResultado.cat)))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-4 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim mb-2"
  }, "Mural P\xFAblico de Rolagens"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, (db.rolagensDadosPublicas || []).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, r.personagem), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted"
  }, " (", r.dado, ") : "), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white font-mono text-sm"
  }, r.resultado), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] ml-2 text-bleach-orange font-semibold"
  }, r.categoria)), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, r.data))))))));
}

// COMPLETE RPG SYSTEMS & MANUAL VIEW (UPDATED WITH ON TRAINING 30 LINES, AI ZANPAKUTO NARRATIVE, GACHA REWARDS)
const SISTEMAS_DATA = [{
  id: "s1",
  t: "1. Conceito do Sistema",
  c: "O Bleach RPG é focado em narrativa, desenvolvimento de personagem, combate dinâmico e power scaling. O sistema evita o excesso de rolagens desnecessárias: a maior parte dos resultados vem da combinação direta entre Atributos, Técnicas, Experiência, Circunstâncias e Narrativa."
}, {
  id: "s2",
  t: "2. Regra de Treinamento em ON (Obrigatório 30 Linhas)",
  c: "⚔️ O TREINO É FEITO EM ON!\nPara validar um treinamento, o jogador deve obrigatoriamente produzir uma cena de no mínimo 30 linhas focando em um atributo específico ou dividindo o treino entre mais de um atributo.\n\n• Máximo de 3 treinos por dia (Manhã, Tarde, Noite).\n• 1 Treino: Sem fadiga.\n• 2 Treinos: -5% temporário de fadiga.\n• 3 Treinos: -15% temporário de fadiga e bloqueia Miscelâneas no dia.\nA fadiga é completamente zerada ao descansar (novo dia)."
}, {
  id: "s3",
  t: "3. Evolução Narrativa da Zanpakutō & Inteligência Artificial",
  c: "A evolução da Zanpakutō é feita de modo estritamente NARRATIVO!\nCom base na personalidade, demonstrações de cenas, treinamentos, interações sociais e história base, o perfil do personagem é enviado para a nossa IA que irá gerar 4 opções de Shikai e, posteriormente, 4 opções de Bankai personalizadas.\n\nVocê terá essas 4 opções adaptadas ao seu perfil para escolher a que melhor representa sua alma!"
}, {
  id: "s4",
  t: "4. Tipos de Atividades e Recompensas Oficiais",
  c: "• MISCELÂNEAS: Missões que surgem de repente sem fazerem tanta parte do arco principal (+0 a 3 pontos).\n\n• MISSÕES: Narrações que envolvem o arco principal e acontecimentos de grande escala no mundo espiritual.\n\n• CENA DE ARCO: Cenas com no mínimo 90 linhas realizando algo de impacto crucial para a história do personagem, podendo ser feita no presente ou no passado.\n\n🎁 RECOMPENSA GARANTIDA (Cenas de Arco e Missões):\n• +15 Pontos de Atributos para distribuir livremente.\n• 4 Sorteios Gacha Comuns.\n• 1 Sorteio Especial (Prêmios Épicos: Super Bônus de Pontos, Kidō Secreto Proibido ou a cobiçada Missão Narrativa Individual de Despertar de Poder).\n• 3 Kidōs à escolha do jogador."
}, {
  id: "s5",
  t: "5. Categorias de Kidō & Sistema de Limite Espiritual",
  c: "Existem 3 escolas primárias de Kidō:\n🔴 HADŌ (Destruição): Feitiços ofensivos (Ex: Byakurai, Shakkahō, Sōkatsui, Kurohitsugi).\n🔵 BAKUDŌ (Aprisionamento): Feitiços de restrição, selamento e barreira (Ex: Sai, Hainawa, Rikujō Kōrō, Dankū).\n🟢 KAIDŌ (Cura): Técnicas de restauração e regeneração de tecidos e Reiatsu.\n\n💧 LIMITE DE KIDŌS POR CENA:\nIniciantes conseguem usar um número reduzido de Kidōs. Conforme a Pressão Espiritual evolui, a potência e a reserva aumentam, mas há um limite máximo de conjurações por cena para manter a tensão do combate e evitar spam."
}, {
  id: "s6",
  t: "6. Atributos Fundamentais & Rankings",
  c: "Existem 4 atributos primários:\n🔵 PRESSÃO ESPIRITUAL: Potência de Reiatsu e controle mágico.\n🔴 FORÇA: Potência física, Zanjutsu e Hakuda.\n🟢 VELOCIDADE: Deslocamento, reflexos e Hohō/Shunpo.\n🟣 RESILIÊNCIA: Resistência a danos físicos e espirituais.\n\n🏆 RANKINGS NO SITE:\n1. Ranking Físico: Média calculada por (Força + Velocidade + Resiliência) ÷ 3.\n2. Ranking de Pressão Espiritual: Pontuação pura de Reiatsu."
}, {
  id: "s7",
  t: "7. Raças Disponíveis (Shinigami & Shinigami Ex-Humano)",
  c: "• SHINIGAMI: Nativo da Sociedade das Almas, formado na Academia Shin'ō. Começa com 4 Kidōs básicos.\n• SHINIGAMI EX-HUMANO: Viveu no Mundo dos Vivos antes de virar Ceifeiro. Atributos iguais, aprendendo Kidōs narrativamente."
}, {
  id: "s8",
  t: "8. Estados de Combate (Sem HP Numérico)",
  c: "Não há pontos de vida (HP). O lutador transita por 4 estados:\n🟢 INTEIRO: Condição física e espiritual plena.\n🟡 FERIDO: Recebeu golpes, desempenho começa a oscilar.\n🟠 DEBILITADO: Danos graves, grande limitação física e espiritual.\n🔴 DERROTADO: Incapacitado de continuar na batalha."
}];
function SistemasView() {
  const [aberto, setAberto] = useState(0);
  const [busca, setBusca] = useState("");
  const filtrados = SISTEMAS_DATA.filter(s => s.t.toLowerCase().includes(busca.toLowerCase()) || s.c.toLowerCase().includes(busca.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Manual Oficial Atualizado"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "SISTEMAS DA SOCIEDADE DAS ALMAS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Consulte as regras oficiais de combate, treinos em ON (30 linhas), Zanpakut\u014D com IA (4 op\xE7\xF5es de Shikai e Bankai), recompensas de Cenas de Arco e Miss\xF5es, Kid\u014Ds e Rankings."))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Pesquisar regras, Treinos em ON, Kid\u014D, Zanpakut\u014D...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "w-full bg-bleach-panel border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm text-white placeholder-bleach-muted outline-none shadow-lg transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filtrados.map((s, idx) => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "bg-bleach-panel border border-bleach-border hover:border-bleach-border/80 rounded-xl overflow-hidden shadow-lg transition"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAberto(aberto === idx ? -1 : idx),
    className: "w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-title text-lg tracking-wider uppercase text-bleach-cream hover:text-bleach-orange transition"
  }, /*#__PURE__*/React.createElement("span", null, s.t), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-orange text-xl font-bold font-mono"
  }, aberto === idx ? "−" : "+")), aberto === idx && /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-5 pt-2 text-xs sm:text-sm text-bleach-creamDim leading-relaxed border-t border-bleach-borderSoft/60 whitespace-pre-line bg-black/20"
  }, s.c)))));
}

// RENDER APPLICATION
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render( /*#__PURE__*/React.createElement(App, null));