/**
 * Constants and Preset Data for ZapBooth - Premium Photobooth Automation Client
 */

export interface PresetImage {
  id: string;
  name: string;
  url: string;
  size: string;
  category: string;
  badge: string;
  overlayColor: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatarSeed: string;
}

export interface MonitoredFolder {
  id: string;
  name: string;
  path: string;
  type: 'virtual' | 'real';
}

// Beautiful images from Unsplash representing typical photobooth layouts, strips, and happy event memories
export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'strip_casamento',
    name: 'Tirinha_Casamento_Guilherme_e_Julia_Strip_051.jpg',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80',
    size: '1.8 MB',
    category: 'Casamento Rústico',
    badge: '❤️ AMOR NO AR',
    overlayColor: 'from-[#ec4899] to-[#be185d]'
  },
  {
    id: 'strip_vintage',
    name: 'Tirinha_Retro_Anos_90_BlackWhite_22.png',
    url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=700&q=80',
    size: '1.2 MB',
    category: 'Vintage Preto & Branco',
    badge: '🎞️ RETRO STYLE',
    overlayColor: 'from-gray-700 to-gray-900'
  },
  {
    id: 'strip_debutante',
    name: 'Strip_Festa_15_Anos_Beatriz_Neon_94.jpg',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80',
    size: '2.5 MB',
    category: 'Festa 15 Anos (Neon)',
    badge: '✨ GLAMOUR PARTY',
    overlayColor: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'strip_formatura',
    name: 'Formatura_Engenharia_UFRJ_Strip_Final.jpg',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80',
    size: '2.9 MB',
    category: 'Formatura Tradicional',
    badge: '🎓 CONQUISTA',
    overlayColor: 'from-blue-600 to-teal-700'
  },
  {
    id: 'strip_aniversario',
    name: 'Niver_Maju_4_Anos_Aventura_Kids_12.jpg',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80',
    size: '1.5 MB',
    category: 'Aniversário Infantil',
    badge: '🎈 DIVERSÃO',
    overlayColor: 'from-amber-400 to-rose-500'
  },
  {
    id: 'strip_corporate',
    name: 'Festa_Fim_de_Ano_Resultados_XP_Digital.jpg',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
    size: '3.1 MB',
    category: 'Corporativo Final de Ano',
    badge: '💼 HUB CARREIRA',
    overlayColor: 'from-emerald-500 to-cyan-600'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Mariana Noiva (Casamento)', phone: '+5511999998888', role: 'Noivos', avatarSeed: 'mariana' },
  { id: '2', name: 'Carol Debutante (15 Anos)', phone: '+5521988887777', role: 'Org. Evento', avatarSeed: 'carol' },
  { id: '3', name: 'Tio Beto (Plaquinhas Engraçadas)', phone: '+5531977776666', role: 'Convidado', avatarSeed: 'beto' },
  { id: '4', name: 'Cerimonialista Amanda Ramos', phone: '+5511966665555', role: 'Staff', avatarSeed: 'amanda' },
  { id: '5', name: 'Dr. Hilton (Dono Cabine)', phone: '+5585955554444', role: 'Admin', avatarSeed: 'hilton' }
];

export const SAMPLE_FOLDERS: MonitoredFolder[] = [
  { id: 'f1', name: 'Cabine Central (CameraDSLR)', path: 'C:\\ZapBooth\\DSLR_HotFolder', type: 'virtual' },
  { id: 'f2', name: 'Cabine Mini (Filtros Totem)', path: 'C:\\ZapBooth\\Totem_Filters_Export', type: 'virtual' },
  { id: 'f3', name: 'Celular Monitor (WhatsApp Backup)', path: '/Users/hilton/ZapBooth/AirDrop_Folder', type: 'virtual' }
];

export const TEMPLATES = [
  { label: '👰 Casamento', text: 'Diga Xiiiiiis! 📸 Olha que linda ficou a nossa foto cabine no casamento de Guilherme e Julia! Guarde essa lembrança com muito carinho... 💕✨ Espalhe esse amor!' },
  { label: '🦄 Festa 15 Anos', text: 'Sua tirinha mágica da festa de 15 anos da Carol está pronta! 🌟 Segue em anexo a nossa diversão congelada. Poste no Insta com a tag #Carol15 e arrase! 👑🥂' },
  { label: '🎓 Formatura', text: 'Parabéns, Formando! 🎓🎉 Sua foto comemorativa na cabine da formatura de Engenharia está liberada! Sucesso absoluto na sua nova jornada! 🚀💼' },
  { label: '🎈 Aniversário', text: 'Eba! 🎈 Olha o nosso registro super divertido na festa da Maju de 4 aninhos! Adoramos a sua presença e o seu melhor sorriso! 🍦🧸' },
  { label: '⚡ Plaquinha Zueira', text: 'Socorrooo! 😂 Alguém confisque esse bando de malucos da cabine! Segue a sua recordação icônica do evento mais insano do ano!' }
];

export const COMIC_TAGS: string[] = [
  '⚡ Reaquecendo o flash de quartzo de Xenon...',
  '🎞️ Revelando os sais de prata na câmara escura virtual...',
  '🌬️ Soprando o papel fotográfico térmico para secar a tinta digital...',
  '🕶️ Alinhando plaquinhas de "Não vou lembrar amanhã" e óculos neon de estrela...',
  '🤖 Subornando o fotógrafo robô com fotos de cachorrinhos felizes...',
  '🎨 Aplicando filtros de beleza vintage inspirados em novelas dos anos 90...',
  '🧹 Caçando pixels fugitivos escondidos sob a clássica cortina vermelha de veludo...',
  '👁️ Pedindo mentalmente para o cunhado não piscar na segunda pose...',
  '🎀 Envelopando sua tirinha impressa com um laço de cetim digital perfumado...',
  '🦜 Ensinando sotaques engraçados para o tucano mensageiro do WhatsApp...',
  '🛰️ Posicionando satélites geoestacionários para espalhar sua foto em alta definição...',
  '🎩 Tirando coelhos cartola digital para acelerar o motor de envio...',
  '🍕 Alimentando o hamster gerador com sobras da mesa de frios do buffet...',
  '🍿 Desentupindo a saída de papel térmico com raspas invisíveis de pipoca doce...'
];
