import { BusinessModel, Niche } from '../types';

export interface NichePlaybook {
  niche: Niche;
  businessModel: BusinessModel;
  visitorIntent: string;
  primaryConversion: 'WHATSAPP' | 'APPOINTMENT' | 'PHONE' | 'LOCATION' | 'LOCAL_VISIT';
  secondaryConversion: string;
  commonServices: string[];
  creativeConcepts: string[];
  photoSubjects: string[];
  headlineTemplates: { kicker: string; main: string; sub: string }[];
  accentColors: { bg: string; surface: string; primary: string; accent: string; text: string }[];
  aboutStatement: string;
}

export const NICHE_PLAYBOOKS: Record<Niche, NichePlaybook> = {
  Barbearia: {
    niche: 'Barbearia',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Agendamento rápido, conferir estilo do espaço e profissionais',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver endereço e horários',
    commonServices: ['Corte Clássico', 'Barba Terapia com Toalha Quente', 'Acabamento & Alinhamento', 'Camuflagem de Fios', 'Tratamento Capilar'],
    creativeConcepts: ['Urban Precision', 'Modern Heritage', 'Street Editorial', 'Obsidian Minimal', 'Raw Industrial'],
    photoSubjects: ['barber-chair', 'fade-cut', 'hot-towel', 'straight-razor', 'vintage-interior', 'styling-pomade'],
    headlineTemplates: [
      { kicker: 'BARBA & CABELO COM PRECISÃO', main: 'Tradição no corte. Maestria no detalhe.', sub: 'Atendimento pontual em ambiente exclusivo criado para quem valoriza estilo e acabamento cirúrgico.' },
      { kicker: 'ESTILO MASCULINO CONTEMPORÂNEO', main: 'O ritual do cuidado masculino levado a sério.', sub: 'Cortes sob medida, navalha afiada e toalha quente. Reserve seu horário sem filas.' },
      { kicker: 'STUDIO DE CORTE & VISAGISMO', main: 'Design para o seu rosto. Precisão em cada linha.', sub: 'Técnicas modernas de tesoura e navalha para valorizar seu estilo pessoal com discrição.' }
    ],
    accentColors: [
      { bg: '#0D0E11', surface: '#16181D', primary: '#D4AF37', accent: '#E8C56A', text: '#F4F4F5' },
      { bg: '#121212', surface: '#1C1C1E', primary: '#E5E7EB', accent: '#9CA3AF', text: '#FAFAFA' },
      { bg: '#0A0B0D', surface: '#131519', primary: '#C86D51', accent: '#DF8569', text: '#F9FAFB' }
    ],
    aboutStatement: 'Espaço planejado para aliar técnica clássica de barbearia a um padrão contemporâneo de conforto, pontualidade e hospitalidade.'
  },
  'Salão de Beleza': {
    niche: 'Salão de Beleza',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Consultar procedimentos, mechas, tratamentos e agendar horário',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver portfólio de tons e cortes',
    commonServices: ['Mechas & Iluminação', 'Corte Esculpido', 'Cronograma Capilar', 'Escova Modelada', 'Design de Cor'],
    creativeConcepts: ['Soft Sophistication', 'High Fashion Minimalism', 'Organic Fashion', 'Quiet Luxury'],
    photoSubjects: ['hair-styling', 'hair-salon-interior', 'shampoo-basin', 'blowdry', 'hair-texture', 'salon-mirror'],
    headlineTemplates: [
      { kicker: 'HAIR DESIGN & COLORIMETRIA', main: 'A essência da sua beleza em harmonia.', sub: 'Especialistas em mechas personalizadas e recuperação da saúde da fibra capilar com produtos premium.' },
      { kicker: 'CUIDADO INTEGRAL & ESTILO', main: 'Transformações sutis que revelam sua identidade.', sub: 'Ambiente tranquilo, diagnóstico minucioso e técnicas atualizadas de corte e cor.' }
    ],
    accentColors: [
      { bg: '#FAF8F5', surface: '#FFFFFF', primary: '#18181B', accent: '#C8A27A', text: '#18181B' },
      { bg: '#181412', surface: '#221D1A', primary: '#D8B4A6', accent: '#ECD5CC', text: '#FDFBF7' }
    ],
    aboutStatement: 'Nosso espaço foi desenhado para acolher com calma, avaliando a saúde de cada fio antes de qualquer procedimento.'
  },
  Restaurante: {
    niche: 'Restaurante',
    businessModel: 'LOCAL_VISIT',
    visitorIntent: 'Conferir cardápio, clima da casa, endereço e reservar mesa',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver endereço e horários',
    commonServices: ['Almoço Executivo', 'Jantar à la Carte', 'Carta de Vinhos', 'Sobremesas Autorais', 'Eventos Reservados'],
    creativeConcepts: ['Cinematic Hospitality', 'Warm Editorial', 'Contemporary Dining', 'Artisan Heritage'],
    photoSubjects: ['restaurant-interior', 'plated-food', 'chef-finishing', 'wine-glass', 'cozy-dining', 'open-kitchen'],
    headlineTemplates: [
      { kicker: 'COZINHA AUTORAL & INGREDIENTES LOCAIS', main: 'Sabores marcantes em um refúgio acolhedor.', sub: 'Receitas criadas a partir de ingredientes frescos e selecionados, em um espaço pensado para compartilhar bons momentos.' },
      { kicker: 'EXPERIÊNCIA GASTRONÔMICA', main: 'O prazer da boa mesa, do primeiro ao último prato.', sub: 'Ambiente acolhedor, serviço atencioso e carta de vinhos curada para harmonizar com cada pedido.' }
    ],
    accentColors: [
      { bg: '#0F110E', surface: '#171A15', primary: '#E29D62', accent: '#C47C41', text: '#F4F5F0' },
      { bg: '#F8F6F0', surface: '#FFFFFF', primary: '#262A22', accent: '#8F5436', text: '#1E211A' }
    ],
    aboutStatement: 'Cozinha fundamentada no respeito ao tempo de preparo, ingredientes frescos e uma hospitalidade calorosa.'
  },
  Pizzaria: {
    niche: 'Pizzaria',
    businessModel: 'LOCAL_VISIT',
    visitorIntent: 'Ver sabores, pedir delivery ou visitar o salão',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver cardápio completo',
    commonServices: ['Pizzas Tradicionais', 'Pizzas Especiais Artesanais', 'Massas de Fermentação Lenta', 'Calzones', 'Bebidas Selecionadas'],
    creativeConcepts: ['Warm Artisan', 'Urban Casual', 'Bold Food', 'Modern Italian'],
    photoSubjects: ['pizza-oven', 'woodfire-pizza', 'kneading-dough', 'melted-cheese', 'rustic-table', 'pizzeria-atmosphere'],
    headlineTemplates: [
      { kicker: 'FERMENTAÇÃO NATURAL & FORNO A LENHA', main: 'Massa leve, crocante e ingredientes de verdade.', sub: '48 horas de maturação lenta para criar bordas aeradas e digestão suave. Experimente no salão ou peça em casa.' }
    ],
    accentColors: [
      { bg: '#141210', surface: '#1E1A17', primary: '#E06D44', accent: '#E89C5D', text: '#FAF7F2' }
    ],
    aboutStatement: 'A tradição da pizza napolitana combinada com ingredientes frescos e amor pelo ofício artesanal.'
  },
  Cafeteria: {
    niche: 'Cafeteria',
    businessModel: 'LOCAL_VISIT',
    visitorIntent: 'Descobrir cafés especiais, espaço para trabalhar ou conversar',
    primaryConversion: 'LOCAL_VISIT',
    secondaryConversion: 'Conversar pelo WhatsApp',
    commonServices: ['Espressos & Filtrados Especiais', 'Brunch & Toasts', 'Pães de Fermentação Natural', 'Doces Artesanais', 'Grãos Torrados para Levar'],
    creativeConcepts: ['Warm Minimal', 'Editorial Café', 'Modern Artisan', 'Nordic Coffee'],
    photoSubjects: ['latte-art', 'espresso-machine', 'coffee-beans', 'pour-over', 'sunlit-cafe', 'pastry-counter'],
    headlineTemplates: [
      { kicker: 'CAFÉS ESPECIAIS & GASTRONOMIA LEVE', main: 'Grãos selecionados, torra precisa e uma pausa merecida.', sub: 'Um ponto de encontro para desacelerar com cafés de pequenos produtores brasileiros e receitas autorais.' }
    ],
    accentColors: [
      { bg: '#F9F6F0', surface: '#FFFFFF', primary: '#3C2A21', accent: '#A06D50', text: '#211815' }
    ],
    aboutStatement: 'Selecionamos lotes especiais de produtores nacionais para valorizar as notas sensoriais de cada xícara.'
  },
  Confeitaria: {
    niche: 'Confeitaria',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Encomendar bolos para datas especiais e ver criações doces',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver opções do cardápio',
    commonServices: ['Bolos Festivos Personalizados', 'Doces Finos para Eventos', 'Sobremesas Individuais', 'Tortas Artesanais', 'Lembranças Doces'],
    creativeConcepts: ['Patisserie Luxury', 'Soft Editorial', 'Playful Premium'],
    photoSubjects: ['cake-decoration', 'patisserie-display', 'piping-cream', 'macarons', 'festive-cake'],
    headlineTemplates: [
      { kicker: 'CONFEITARIA ARTESANAL & AFETIVA', main: 'Doces feitos com precisão e afeto para momentos memoráveis.', sub: 'Criações autorais com matéria-prima nobre e acabamento minucioso para celebrar cada instante especial.' }
    ],
    accentColors: [
      { bg: '#FCF9F7', surface: '#FFFFFF', primary: '#2B2421', accent: '#B47B6A', text: '#261F1C' }
    ],
    aboutStatement: 'Equilíbrio refinado de açúcar, texturas sedosas e um cuidado visual que faz os olhos brilharem antes da primeira garfada.'
  },
  Padaria: {
    niche: 'Padaria',
    businessModel: 'LOCAL_VISIT',
    visitorIntent: 'Conhecer pães artesanais do dia e café da manhã',
    primaryConversion: 'LOCAL_VISIT',
    secondaryConversion: 'WhatsApp para encomendas',
    commonServices: ['Pães de Levain', 'Croissants Franceses', 'Café da Manhã Completo', 'Focaccias', 'Confeitaria de Balcão'],
    creativeConcepts: ['Artisan Editorial', 'Warm Heritage', 'Modern Local'],
    photoSubjects: ['crusty-bread', 'baker-hands', 'croissant-layers', 'bakery-shelves', 'flour-board'],
    headlineTemplates: [
      { kicker: 'FORNADAS DIÁRIAS COM LEVAIN', main: 'O aroma do pão de verdade saindo quente do forno.', sub: 'Farinhas nobres, água e tempo. Respeitamos o ritmo natural da fermentação para garantir sabor profundo e leveza.' }
    ],
    accentColors: [
      { bg: '#FBF8F3', surface: '#FFFFFF', primary: '#2D2319', accent: '#C28448', text: '#231B13' }
    ],
    aboutStatement: 'Padaria de bairro dedicada a resgatar o sabor genuíno da panificação artesanal e de fermentação lenta.'
  },
  Clínica: {
    niche: 'Clínica',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Buscar profissionais confiáveis, especialidades e agendar consulta',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ligar para a recepção',
    commonServices: ['Consultas Preventivas', 'Avaliação Integrada', 'Exames no Local', 'Acompanhamento Contínuo', 'Check-up Especializado'],
    creativeConcepts: ['Clinical Editorial', 'Calm Modern', 'Humanist Minimal'],
    photoSubjects: ['clean-clinic-interior', 'reception-desk', 'doctor-office', 'medical-equipment', 'welcoming-lobby'],
    headlineTemplates: [
      { kicker: 'SAÚDE INTEGRADA & ATENDIMENTO HUMANO', main: 'Cuidado atencioso, diagnósticos precisos e escuta ativa.', sub: 'Equipe dedicada ao seu bem-estar em um espaço sereno projetado para acolher com conforto e pontualidade.' }
    ],
    accentColors: [
      { bg: '#F8FAFC', surface: '#FFFFFF', primary: '#0F172A', accent: '#0284C7', text: '#0F172A' }
    ],
    aboutStatement: 'Acreditamos em uma medicina preventiva e humanizada, onde a escuta do paciente e a clareza técnica caminham juntas.'
  },
  Dentista: {
    niche: 'Dentista',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Agendar avaliação odontológica, estética ou clareamento',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Conferir localização',
    commonServices: ['Avaliação & Profilaxia', 'Clareamento Dental', 'Lentes & Facetas', 'Ortodontia Alinhadores', 'Implantodontia'],
    creativeConcepts: ['Modern Clinical', 'Clean Editorial', 'Friendly Professional'],
    photoSubjects: ['dental-chair', 'dental-office', 'clean-instruments', 'bright-smile', 'consultation-room'],
    headlineTemplates: [
      { kicker: 'ODONTOLOGIA ESTÉTICA & FUNCIONAL', main: 'A confiança de um sorriso saudável e harmônico.', sub: 'Tecnologia diagnóstica, biossegurança rigorosa e tratamentos planejados para o seu bem-estar sem ansiedade.' }
    ],
    accentColors: [
      { bg: '#F9FAFB', surface: '#FFFFFF', primary: '#111827', accent: '#0EA5E9', text: '#111827' }
    ],
    aboutStatement: 'Consultório equipado para proporcionar tratamentos precisos com total conforto, clareza e empatia.'
  },
  Academia: {
    niche: 'Academia',
    businessModel: 'LOCAL_VISIT',
    visitorIntent: 'Conhecer espaço, estrutura, modalidades e agendar aula experimental',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Agendar aula experimental',
    commonServices: ['Musculação Monitorada', 'Treinamento Funcional', 'Aulas Coletivas', 'Avaliação Física', 'Acompanhamento de Metas'],
    creativeConcepts: ['Performance Editorial', 'Technical Sport', 'Bold Modern'],
    photoSubjects: ['gym-weights', 'dumbbells-rack', 'running-track', 'athletic-training', 'modern-gym-floor'],
    headlineTemplates: [
      { kicker: 'TREINAMENTO DE ALTA PERFORMANCE', main: 'Estrutura completa para você construir consistência e saúde.', sub: 'Equipamentos biomecânicos modernos, ambiente ventilado e profissionais presentes para orientar seu treino.' }
    ],
    accentColors: [
      { bg: '#0A0A0C', surface: '#141418', primary: '#FAFAFA', accent: '#3B82F6', text: '#FAFAFA' }
    ],
    aboutStatement: 'Espaço pensado para treino sério, com ergonomia de ponta, circulação inteligente e suporte técnico dedicado.'
  },
  'Pet Shop': {
    niche: 'Pet Shop',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Agendar banho e tosa, consultar produtos e cuidados veterinários',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver endereço e horários',
    commonServices: ['Banho e Tosa Especializada', 'Hidratação de Pelagem', 'Tosa Higiênica e na Tesoura', 'Consultas Veterinárias', 'Acessórios & Alimentação'],
    creativeConcepts: ['Friendly Modern', 'Playful Controlled', 'Warm Local'],
    photoSubjects: ['grooming-dog', 'happy-pet', 'grooming-salon', 'pet-care-shampoo', 'clean-vet-clinic'],
    headlineTemplates: [
      { kicker: 'CUIDADO & CARINHO COM SEU PET', main: 'Higiene e bem-estar para o seu melhor amigo com respeito e amor.', sub: 'Profissionais pacientes, produtos hipoalergênicos e ambiente calmo para reduzir o estresse do seu pet.' }
    ],
    accentColors: [
      { bg: '#FAF9F6', surface: '#FFFFFF', primary: '#1C1917', accent: '#D97706', text: '#1C1917' }
    ],
    aboutStatement: 'Aqui cada animal é tratado com calma e paciência, respeitando o ritmo e as particularidades de cada pelagem.'
  },
  Imobiliária: {
    niche: 'Imobiliária',
    businessModel: 'PORTFOLIO',
    visitorIntent: 'Procurar imóveis de alto padrão e falar com corretor',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Consultar portfólio',
    commonServices: ['Curadoria de Imóveis', 'Assessoria na Compra e Venda', 'Avaliação Mercadológica', 'Locação Corporativa', 'Consultoria Jurídica Imobiliária'],
    creativeConcepts: ['Architectural Editorial', 'Premium Property', 'Modern Grid'],
    photoSubjects: ['modern-facade', 'luxury-living-room', 'architectural-interior', 'balcony-view', 'designer-kitchen'],
    headlineTemplates: [
      { kicker: 'CURADORIA DE IMÓVEIS SELECIONADOS', main: 'Espaços que traduzem seu estilo de vida com excelência.', sub: 'Assessoria discreta e orientada a dados para encontrar a residência perfeita ou o investimento mais seguro.' }
    ],
    accentColors: [
      { bg: '#0F1115', surface: '#171A21', primary: '#F3F4F6', accent: '#C5A880', text: '#F9FAFB' }
    ],
    aboutStatement: 'Focamos na curadoria de oportunidades imobiliárias sólidas, prestando atendimento consultivo e transparente.'
  },
  Contabilidade: {
    niche: 'Contabilidade',
    businessModel: 'LEAD_GENERATION',
    visitorIntent: 'Entender serviços fiscais, abertura de empresa e pedir proposta',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Solicitar diagnóstico tributário',
    commonServices: ['Assessoria Tributária & Fiscal', 'Abertura & Regularização de Empresas', 'Gestão de Folha de Pagamento', 'BPO Financeiro', 'Planejamento Tributário'],
    creativeConcepts: ['Corporate Editorial', 'Technical Minimal', 'Quiet Confidence'],
    photoSubjects: ['modern-office-desk', 'architectural-workspace', 'meeting-room', 'financial-charts', 'laptop-paperwork'],
    headlineTemplates: [
      { kicker: 'INTELIGÊNCIA FISCAL & GESTÃO CONTÁBIL', main: 'Segurança tributária para sua empresa crescer com previsibilidade.', sub: 'Atendimento consultivo ágil e tecnologia para simplificar as rotinas contábeis do seu negócio.' }
    ],
    accentColors: [
      { bg: '#0A0F1D', surface: '#111827', primary: '#F9FAFB', accent: '#38BDF8', text: '#F3F4F6' }
    ],
    aboutStatement: 'Traduzimos a complexidade da legislação tributária em estratégia prática e economia lícita para o empresário.'
  },
  Marcenaria: {
    niche: 'Marcenaria',
    businessModel: 'PORTFOLIO',
    visitorIntent: 'Ver móveis sob medida prontos e pedir orçamento de projeto',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Agendar visita técnica',
    commonServices: ['Móveis Planejados Residenciais', 'Cozinhas & Ilhas Gourmet', 'Painéis Ripados e Revestimentos', 'Mobiliário Corporativo', 'Projetos Especiais em Madeira Nobre'],
    creativeConcepts: ['Warm Artisan', 'Architectural Craft', 'Contemporary Wood', 'Quiet Luxury'],
    photoSubjects: ['woodworking-tools', 'custom-kitchen', 'wood-texture', 'cabinetmaker-detail', 'modern-living-joinery'],
    headlineTemplates: [
      { kicker: 'MÓVEIS SOB MEDIDA & MARCENARIA FINA', main: 'O encontro do design contemporâneo com a marcenaria de raiz.', sub: 'Projetos estruturados ao milímetro para otimizar seus espaços com ferragens duráveis e acabamento impecável.' }
    ],
    accentColors: [
      { bg: '#161412', surface: '#221F1B', primary: '#EAE5DF', accent: '#C88D56', text: '#FAF8F5' }
    ],
    aboutStatement: 'Oficina dedicada a transformar chapas nobres e madeira maciça em ambientes acolhedores, funcionais e duradouros.'
  },
  'Loja de Roupas': {
    niche: 'Loja de Roupas',
    businessModel: 'CATALOG',
    visitorIntent: 'Ver coleções atuais, tecidos, estilo e comprar pelo WhatsApp',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver catálogo de peças',
    commonServices: ['Curadoria de Roupas & Alfaiataria', 'Atendimento Personalizado de Estilo', 'Novas Peças Semanais', 'Envio Expresso para Todo Brasil', 'Ajustes no Ponto'],
    creativeConcepts: ['Street Editorial', 'High Fashion Minimalism', 'Minimal Commerce', 'Bold Culture'],
    photoSubjects: ['fashion-editorial', 'fabric-texture', 'clothing-rack', 'minimalist-store', 'linen-outfit'],
    headlineTemplates: [
      { kicker: 'CURADORIA DE MODA & ESTILO ATEMPORAL', main: 'Peças com caimento impecável e tecidos que contam histórias.', sub: 'Modelagens autorais pensadas para vestir com elegância e conforto em qualquer ocasião do seu dia.' }
    ],
    accentColors: [
      { bg: '#FAF8F5', surface: '#FFFFFF', primary: '#18181B', accent: '#71717A', text: '#09090B' }
    ],
    aboutStatement: 'Roupas selecionadas pelo design atemporal, durabilidade de tecidos e corte que valoriza diferentes silhuetas.'
  },
  Fotógrafo: {
    niche: 'Fotógrafo',
    businessModel: 'PORTFOLIO',
    visitorIntent: 'Ver ensaios reais, sensibilidade visual e pedir orçamento de datas',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver portfólio completo',
    commonServices: ['Ensaios Pessoais & Retratos', 'Cobertura de Casamentos & Eventos', 'Fotografia de Arquitetura & Interiores', 'Campanhas para Marcas', 'Direção de Arte Fotográfica'],
    creativeConcepts: ['Gallery First', 'Editorial Portfolio', 'Cinematic Minimal', 'Art Book'],
    photoSubjects: ['camera-lens', 'portrait-natural-light', 'photo-studio', 'monochrome-portrait', 'artistic-shadows'],
    headlineTemplates: [
      { kicker: 'DIREÇÃO FOTOGRÁFICA & RETRATOS', main: 'Memórias sinceras captadas pela luz natural.', sub: 'Fotografia documental e ensaios com direção sensível que preservam a verdade dos seus melhores momentos.' }
    ],
    accentColors: [
      { bg: '#0C0D0E', surface: '#141517', primary: '#F4F4F5', accent: '#A1A1AA', text: '#FAFAFA' }
    ],
    aboutStatement: 'Olhar focado no instante autêntico, na textura das sombras e na poesia dos gestos cotidianos.'
  },
  Eletricista: {
    niche: 'Eletricista',
    businessModel: 'SERVICE',
    visitorIntent: 'Chamar técnico para reparo urgente ou orçamento de projeto',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ligar para emergência',
    commonServices: ['Instalações & Reformas Elétricas', 'Projetos de Iluminação LED', 'Troca & Adequação de Quadros', 'Aterramento & Proteção contra Raios', 'Manutenção Preventiva Residencial'],
    creativeConcepts: ['Technical Precision', 'Utility Modern', 'Local Professional'],
    photoSubjects: ['electrical-panel', 'wiring-tools', 'lighting-installation', 'multimeter-testing', 'clean-conduit'],
    headlineTemplates: [
      { kicker: 'ENGENHARIA & SERVIÇOS ELÉTRICOS', main: 'Segurança, norma técnica e precisão na instalação.', sub: 'Soluções elétricas executadas de acordo com as normas de segurança para sua residência ou empresa.' }
    ],
    accentColors: [
      { bg: '#0D1117', surface: '#161B22', primary: '#F0F6FC', accent: '#E3B341', text: '#F0F6FC' }
    ],
    aboutStatement: 'Compromisso com dimensionamento correto de circuitos, materiais homologados e segurança absoluta da sua família.'
  },
  'Oficina Mecânica': {
    niche: 'Oficina Mecânica',
    businessModel: 'SERVICE',
    visitorIntent: 'Agendar revisão, diagnóstico computadorizado ou conserto',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver endereço e horários',
    commonServices: ['Revisão Preventiva & Troca de Óleo', 'Diagnóstico Eletrônico Computadorizado', 'Freios, Suspensão & Direção', 'Ar Condicionado Automotivo', 'Alinhamento & Balanceamento 3D'],
    creativeConcepts: ['Industrial Modern', 'Technical Editorial', 'Performance Garage'],
    photoSubjects: ['mechanic-tools', 'engine-bay', 'car-lift', 'brake-disk', 'diagnostic-scanner'],
    headlineTemplates: [
      { kicker: 'CENTRO AUTOMOTIVO & DIAGNÓSTICO', main: 'Transparência no orçamento e rigor técnico na oficina.', sub: 'Equipamentos de diagnóstico avançados e peças de procedência para garantir a segurança da sua viagem.' }
    ],
    accentColors: [
      { bg: '#101214', surface: '#181B1E', primary: '#FAFAFA', accent: '#EF4444', text: '#F4F5F6' }
    ],
    aboutStatement: 'Trabalhamos com explicações claras, peças com nota fiscal e garantia documentada em todos os serviços executados.'
  },
  Arquitetura: {
    niche: 'Arquitetura',
    businessModel: 'PORTFOLIO',
    visitorIntent: 'Ver projetos construídos, linha estética do arquiteto e falar sobre obra',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Solicitar reunião de briefing',
    commonServices: ['Projetos Arquitetônicos Residenciais', 'Design de Interiores & Reforma', 'Acompanhamento & Gestão de Obras', 'Projetos Comerciais & Corporativos', 'Consultoria de Layout & Viabilidade'],
    creativeConcepts: ['Architectural Calm', 'Editorial Studio', 'Quiet Luxury', 'Brutalist Controlled'],
    photoSubjects: ['architect-blueprints', 'concrete-architecture', 'sunlit-living-room', 'material-board', 'facade-minimal'],
    headlineTemplates: [
      { kicker: 'STUDIO DE ARQUITETURA & INTERIORES', main: 'Arquitetura que acolhe o tempo e valoriza o espaço.', sub: 'Projetos concebidos a partir da luz natural, da pureza dos materiais e da rotina real de quem vai habitar.' }
    ],
    accentColors: [
      { bg: '#F6F5F2', surface: '#FFFFFF', primary: '#1C1B1A', accent: '#8C857B', text: '#191817' },
      { bg: '#121214', surface: '#1A1A1E', primary: '#E4E4E7', accent: '#A1A1AA', text: '#FAFAFA' }
    ],
    aboutStatement: 'Acreditamos em projetos duradouros que combinam clareza construtiva, conforto térmico e elegância silenciosa.'
  },
  Construção: {
    niche: 'Construção',
    businessModel: 'LEAD_GENERATION',
    visitorIntent: 'Contratar empreiteira confiável para construir ou reformar',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Solicitar orçamento de obra',
    commonServices: ['Construção Residencial do Zero', 'Reformas Estruturais de Alto Padrão', 'Gerenciamento Completo de Obras', 'Projetos Complementares e Laudos', 'Acabamentos Nobres'],
    creativeConcepts: ['Industrial Editorial', 'Construction Modern', 'Technical Confidence'],
    photoSubjects: ['construction-site', 'concrete-structure', 'architectural-framing', 'engineer-hardhat', 'finished-building'],
    headlineTemplates: [
      { kicker: 'ENGENHARIA CIVIL & CONSTRUÇÃO', main: 'Cronograma rigoroso, equipe qualificada e obra sem surpresas.', sub: 'Gestão completa da fundação ao acabamento com relatórios semanais de evolução e controle de custos.' }
    ],
    accentColors: [
      { bg: '#0E1116', surface: '#161C24', primary: '#F8FAFC', accent: '#F97316', text: '#F1F5F9' }
    ],
    aboutStatement: 'Prezamos pela transparência contábil da obra, segurança dos colaboradores e cumprimento dos prazos acordados.'
  },
  Estética: {
    niche: 'Estética',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Descobrir protocolos corporais/faciais e agendar avaliação',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver espaço de atendimento',
    commonServices: ['Limpeza de Pele Profunda', 'Harmonização Facial Suave', 'Drenagem Linfática & Modeladora', 'Tratamentos a Laser', 'Revitalização & Glow Cutâneo'],
    creativeConcepts: ['Soft Luxury', 'Wellness Editorial', 'Clean Modern'],
    photoSubjects: ['spa-ambiance', 'facial-treatment', 'cosmetics-serum', 'relaxing-towels', 'aesthetic-clinic-room'],
    headlineTemplates: [
      { kicker: 'ESTÉTICA AVANÇADA & PROTOCOLOS PERSONALIZADOS', main: 'Realce sua beleza natural com protocolos seguros e não invasivos.', sub: 'Tecnologias consagradas e avaliação individualizada para potencializar a saúde e a vitalidade da sua pele.' }
    ],
    accentColors: [
      { bg: '#FAF7F5', surface: '#FFFFFF', primary: '#27201D', accent: '#C4977E', text: '#1E1815' }
    ],
    aboutStatement: 'Cuidado estético fundamentado em produtos com comprovação dermatológica e respeito à individualidade biológica.'
  },
  Fisioterapia: {
    niche: 'Fisioterapia',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Tratar dores, reabilitação física ou agendar avaliação postural',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ligar para a clínica',
    commonServices: ['Reabilitação Ortopédica', 'Fisioterapia Esportiva', 'Pilates Clínico', 'Tratamento de Coluna & Dor Crônica', 'Avaliação Biomecânica da Marcha'],
    creativeConcepts: ['Humanist Clinical', 'Calm Editorial', 'Modern Wellness'],
    photoSubjects: ['physiotherapy-room', 'spine-anatomy-model', 'posture-training', 'rehab-bands', 'gentle-therapy'],
    headlineTemplates: [
      { kicker: 'FISIOTERAPIA & REABILITAÇÃO INTEGRAL', main: 'Recupere o movimento livre e viva sem a limitação da dor.', sub: 'Avaliação clínica minuciosa e planos de tratamento baseados em evidências para devolver sua autonomia diária.' }
    ],
    accentColors: [
      { bg: '#F8FAFC', surface: '#FFFFFF', primary: '#0F172A', accent: '#0D9488', text: '#0F172A' }
    ],
    aboutStatement: 'Fisioterapia centrada no movimento, com foco na causa primária da dor para prevenir recidivas futuras.'
  },
  Psicologia: {
    niche: 'Psicologia',
    businessModel: 'APPOINTMENT',
    visitorIntent: 'Encontrar profissional de confiança para psicoterapia com discrição',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver informações sobre atendimento',
    commonServices: ['Psicoterapia Individual para Adultos', 'Atendimento Online e Presencial', 'Manejo de Ansiedade e Estresse', 'Desenvolvimento Emocional', 'Orientação Psicológica'],
    creativeConcepts: ['Quiet Editorial', 'Humanist Minimal', 'Soft Contemporary'],
    photoSubjects: ['cozy-armchair', 'warm-psychology-room', 'green-plant-bookshelf', 'window-light', 'tea-cup-wood'],
    headlineTemplates: [
      { kicker: 'PSICOTERAPIA CLÍNICA & ACOLHIMENTO', main: 'Um espaço seguro e sigiloso para compreender suas emoções.', sub: 'Atendimento ético e acolhedor para apoiar seu processo de autoconhecimento e lidar com os desafios da vida cotidiana.' }
    ],
    accentColors: [
      { bg: '#F7F6F2', surface: '#FFFFFF', primary: '#242521', accent: '#7E8274', text: '#1E1F1B' }
    ],
    aboutStatement: 'Prática clínica guiada pelo sigilo absoluto, escuta sem julgamentos e respeito ao tempo interno de cada pessoa.'
  },
  Outro: {
    niche: 'Outro',
    businessModel: 'SERVICE',
    visitorIntent: 'Entender serviços prestados, diferenciais e solicitar atendimento',
    primaryConversion: 'WHATSAPP',
    secondaryConversion: 'Ver endereço e contato',
    commonServices: ['Atendimento Personalizado', 'Consultoria Dedicada', 'Execução Especializada', 'Suporte Contínuo', 'Projetos Sob Medida'],
    creativeConcepts: ['Minimal Confidence', 'Contemporary Craft', 'Refined Utility'],
    photoSubjects: ['modern-office', 'workspace-desk', 'craftsman-hands', 'clean-meeting', 'curated-tools'],
    headlineTemplates: [
      { kicker: 'SERVIÇOS ESPECIALIZADOS DE ALTO NÍVEL', main: 'Dedicação técnica e atendimento sob medida para o seu projeto.', sub: 'Soluções desenvolvidas para atender suas expectativas com pontualidade, clareza e padrão profissional.' }
    ],
    accentColors: [
      { bg: '#0F1115', surface: '#171B22', primary: '#F3F4F6', accent: '#6366F1', text: '#F9FAFB' }
    ],
    aboutStatement: 'Empresa pautada pela excelência técnica, atendimento transparente e foco no sucesso de cada cliente.'
  }
};
