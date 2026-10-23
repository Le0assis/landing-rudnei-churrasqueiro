import { ASSISTANT_LABEL, ASSISTANT_NAME, OWNER_FULL_NAME, OWNER_NAME, WHATSAPP_DISPLAY } from "@/lib/contact";

export const slogans = {
  union: "Churrasco é mais que comida, é união!",
  care: "Sabor, qualidade e todo o cuidado para o seu evento",
  available: "Estou à disposição!",
  motto: "A vida é um churrasco e o mundo nossa churrasqueira",
} as const;

export const hero = {
  title: "Churrasco para festas de família e amigos, em Marília e região",
  lead: `Sou o ${OWNER_FULL_NAME}. Faço churrasco em festas há 5 anos, com a ajuda do meu filho, o ${ASSISTANT_NAME}. Atendo todo tipo de evento, mas o que mais gosto de fazer é a festa da família e dos amigos: carne boa, atendimento cuidadoso e você livre para aproveitar.`,
} as const;

export const trustItems = [
  { value: "5 anos", label: "fazendo churrasco em Marília e região" },
  { value: "Pai e filho", label: `o ${OWNER_NAME} na churrasqueira, o Léo ajudando` },
  { value: "2023 e 2024", label: "escolhido pelo público" },
  { value: "Só mão de obra", label: "os insumos são comprados à parte" },
] as const;

export const story = {
  eyebrow: "Sobre mim",
  title: "Um pouco da minha história",
  paragraphs: [
    "Comecei trabalhando na Marinhos Beef, uma casa de carnes nobres que existia no bairro Esmeralda, aqui em Marília. Foi lá, no meio dos cortes e da brasa, que eu me encontrei no churrasco.",
    "Depois trabalhei para alguns buffets da cidade. Aprendi a atender festa de verdade: chegar com tempo, organizar a churrasqueira e servir cada carne no ponto, sem atropelo.",
    `Há cinco anos tenho o meu próprio serviço, em Marília e na região, com o meu filho, o ${ASSISTANT_NAME}, me ajudando. Em 2023 e em 2024 fui escolhido pelo público, e agradeço de coração a cada cliente que lembrou de mim.`,
  ],
} as const;

export const steps = [
  {
    number: "01",
    title: "Você escolhe",
    text: "Você me diz qual opção prefere, o Completo ou o Assador, quantas pessoas vêm, a data e a cidade.",
  },
  {
    number: "02",
    title: "Eu faço a lista",
    text: "Pelo número de pessoas, eu monto a lista de compras: carne, carvão e o que mais a opção pedir.",
  },
  {
    number: "03",
    title: "Eu faço as compras",
    text: "Você me adianta um valor aproximado por Pix e eu mesmo compro os insumos no mercado e no açougue. Não cobro nada a mais por isso.",
  },
  {
    number: "04",
    title: "No dia do evento",
    text: "A diferença entre o Pix e o que foi gasto a gente acerta junto com a mão de obra. Aí é comigo: churrasqueira, acompanhamentos da opção e atendimento.",
  },
] as const;

export const events = [
  {
    title: "Família",
    text: "Almoço de domingo, batizado, encontro da família. É o tipo de festa que eu mais gosto de fazer.",
  },
  {
    title: "Amigos",
    text: "Reunião de amigos em casa, na chácara ou no salão. Eu cuido da brasa para você ficar com quem veio.",
  },
  {
    title: "Aniversário",
    text: "Festa em casa ou no salão. Eu me ajeito no espaço que tiver, com discrição.",
  },
  {
    title: "Casamento",
    text: "Almoço ou jantar depois da cerimônia, bodas. A gente combina o horário para a carne sair na hora certa.",
  },
  {
    title: "Empresa",
    text: "Confraternização e encontro de equipe. Me diga quantas pessoas vêm e se vai precisar de garçom.",
  },
  {
    title: "Formatura",
    text: "Festa da turma, com a família junto. Eu fico na churrasqueira até o fim.",
  },
] as const;

export const choripan = {
  eyebrow: "O carro-chefe",
  title: "Choripán",
  lead: "Se tem uma coisa que os clientes sempre lembram, é o choripán.",
  paragraphs: [
    "É o item mais elogiado das minhas festas e o mais comentado pelos clientes.",
    "Ele vai nas duas opções, no Completo e no Assador.",
  ],
  photoNote: "Foto do choripán em breve.",
} as const;

export const optionsCopy = {
  laborNote:
    "Os valores abaixo são só a mão de obra. A carne, o carvão e os outros alimentos não entram nesse valor.",
  peopleRule:
    "Os valores valem para eventos de até 50 pessoas. Acima disso, entra uma taxa por pessoa, que a gente combina conforme a quantidade.",
  waiter: "Se quiser alguém servindo, cada garçom sai R$ 150,00. Não é obrigatório.",
} as const;

export const hamburguer = {
  eyebrow: "Outra opção",
  title: "Hamburgada",
  text: "Para quem prefere fugir do churrasco tradicional, também faço hamburgada. É uma alternativa ao churrasco, não um complemento: o evento fica com um ou com outro. Não tem valor fixo; a gente conversa pelo WhatsApp e combina conforme a festa.",
  price: "Valor a combinar",
  button: "Perguntar sobre a hamburgada",
  message: "Olá, Rudnei! Gostaria de saber mais sobre a hamburgada para o meu evento.",
  imageAlt: "Hambúrguer artesanal sendo montado por mãos com luvas pretas, preparado pelo Rudnei Sciole.",
} as const;

export const instagram = {
  eyebrow: "No Instagram",
  title: "Acompanhe as festas por lá",
  text: "Lá eu mostro a brasa, as carnes e um pouco de cada evento.",
  button: "Seguir no Instagram",
} as const;

// Depoimentos iniciais. Entram no manifesto só quando ele ainda não tem o campo
// `testimonials`. Depois disso, quem manda é a aba Depoimentos do admin.
export const seedTestimonials = [
  {
    id: "ilustrativo-1",
    name: "Nome do cliente",
    text: "Espaço reservado para um depoimento real. Este texto é só o modelo do cartão, não é a fala de um cliente.",
    event: "Tipo de evento · cidade",
    illustrative: true,
  },
  {
    id: "ilustrativo-2",
    name: "Nome do cliente",
    text: `Quando um cliente autorizar, o ${ASSISTANT_LABEL} troca este texto pela fala verdadeira. Até lá, ele fica marcado como ilustrativo.`,
    event: "Tipo de evento · cidade",
    illustrative: true,
  },
  {
    id: "ilustrativo-3",
    name: "Nome do cliente",
    text: "Se você já fez um evento comigo e quiser deixar um comentário, me mande pelo WhatsApp. Só publico com a sua autorização.",
    event: "Tipo de evento · cidade",
    illustrative: true,
  },
] as const;

export const faqs = [
  {
    question: "O valor inclui a carne?",
    answer:
      "Não. Os R$ 1.500 e os R$ 700 são só a mão de obra. A carne, o carvão e os outros alimentos entram numa lista à parte, comprada com o dinheiro do evento.",
  },
  {
    question: "Como funcionam a lista e o Pix?",
    answer:
      "Eu monto a lista pelo número de pessoas. Você me adianta por Pix um valor aproximado das compras, e eu mesmo compro os insumos, sem cobrar taxa. No dia, a diferença é acertada junto com a mão de obra.",
  },
  {
    question: "O número de pessoas muda o preço da mão de obra?",
    answer:
      "Até 50 pessoas, não: o Completo é R$ 1.500 e o Assador é R$ 700. Acima de 50, entra uma taxa por pessoa, que a gente combina. O número de pessoas também serve para a lista de compras ficar no tamanho certo. Garçom, se você quiser, entra à parte: R$ 150 cada.",
  },
  {
    question: "Preciso levar garçom?",
    answer:
      "Não. É opcional. Se o evento for grande ou você quiser alguém servindo enquanto eu fico na brasa, cada garçom sai R$ 150.",
  },
  {
    question: "Vocês atendem fora de Marília?",
    answer:
      "A base é Marília-SP e a região. Eu não deixo uma lista fechada de cidades aqui de propósito: me fala a cidade no orçamento que eu confirmo se consigo chegar bem.",
  },
  {
    question: "Com quanto tempo eu preciso chamar?",
    answer:
      "Não tenho uma regra fechada publicada. Me manda a data que eu te digo se a agenda está livre. Quanto antes você falar, mais fácil eu reservo o dia.",
  },
  {
    question: "O que significa escolhido pelo público?",
    answer:
      "Em 2023 e em 2024 fui escolhido pelo público. Foi a escolha de quem conhece o meu trabalho, e eu agradeço muito por isso.",
  },
  {
    question: "Até quantas pessoas valem os preços?",
    answer:
      "Os valores de mão de obra valem para até 50 pessoas. Acima disso, entra uma taxa por pessoa, combinada conforme a quantidade de convidados.",
  },
] as const;

export const area = {
  title: "Marília e a região",
  paragraphs: [
    "Moro em Marília, no interior de São Paulo, e também atendo as cidades da região. Confirmo cada cidade na conversa, para ter certeza de que consigo chegar no horário.",
    "No orçamento tem um campo para a cidade. Se eu não puder ir, te aviso pelo WhatsApp.",
  ],
} as const;

export const privacy = {
  title: "Privacidade, em linguagem clara",
  paragraphs: [
    "Este site não usa anúncio nem cookie de rastreamento. O orçamento não fica guardado aqui: o botão só abre o WhatsApp com a mensagem pronta, no seu celular.",
    `A área de fotos, usada só pelo ${ASSISTANT_LABEL}, guarda um cookie de sessão para manter o login. Esse cookie não identifica você como visitante.`,
    `A conversa segue no WhatsApp, que tem a política da própria plataforma. Quem responde pelo atendimento é o ${OWNER_NAME}, no ${WHATSAPP_DISPLAY}.`,
  ],
} as const;
