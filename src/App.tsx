import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderPlus, 
  FolderSync, 
  Trash2, 
  Monitor, 
  Send, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  MessageSquare, 
  Play, 
  Square, 
  User, 
  Sparkles, 
  Plus, 
  Search, 
  FileText, 
  Laptop, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PRESET_IMAGES, 
  INITIAL_CONTACTS, 
  SAMPLE_FOLDERS, 
  TEMPLATES, 
  COMIC_TAGS,
  PresetImage,
  Contact,
  MonitoredFolder
} from './constants';
import { 
  playTick, 
  playAlert, 
  playSuccess, 
  playCancel 
} from './components/SoundEffects';

export default function App() {
  // General App Settings
  const [folders, setFolders] = useState<MonitoredFolder[]>(SAMPLE_FOLDERS);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');
  const [activeFolderId, setActiveFolderId] = useState<string>('f1');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Custom Contacts list
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Monitor Trigger States
  const [detectedImage, setDetectedImage] = useState<PresetImage | null>(null);
  const [customImageFile, setCustomImageFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [isPriorityPopupOpen, setIsPriorityPopupOpen] = useState(false);
  
  // Form input states on detection overlay
  const [targetPhone, setTargetPhone] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [caption, setCaption] = useState(TEMPLATES[0].text);
  const [customPhoneInput, setCustomPhoneInput] = useState('');

  // Sending progress states
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [currentComicTag, setCurrentComicTag] = useState(COMIC_TAGS[0]);
  const [sendingLogs, setSendingLogs] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Sent history list for UX logs
  const [historyLogs, setHistoryLogs] = useState<Array<{
    id: string;
    imageName: string;
    imageUrl: string;
    phone: string;
    caption: string;
    timestamp: string;
    status: 'success' | 'canceled';
  }>>([
    {
      id: 'h1',
      imageName: 'Foto_Estudio_Corporativa_Karla_Teixeira.jpg',
      imageUrl: PRESET_IMAGES[3].url,
      phone: '+5511999998888',
      caption: 'Pré-visualização do ensaio corporativo aprovado.',
      timestamp: 'Hoje ás 14:22',
      status: 'success'
    },
    {
      id: 'h2',
      imageName: 'Comprovante_Transacao_PIX_Ref_410.png',
      imageUrl: PRESET_IMAGES[2].url,
      phone: '+5511966665555',
      caption: 'Comprovante PIX enviado com sucesso.',
      timestamp: 'Hoje ás 11:05',
      status: 'success'
    }
  ]);

  // Simulated WhatsApp Desktop client list representing chat history inside the emulator
  const [whatsappChats, setWhatsappChats] = useState<Array<{
    phone: string;
    messages: Array<{
      id: string;
      image: string;
      text: string;
      sender: 'me' | 'them';
      time: string;
    }>;
  }>>([
    {
      phone: '+5511999998888',
      messages: [
        {
          id: 'm1',
          image: PRESET_IMAGES[3].url,
          text: 'Pré-visualização do ensaio corporativo aprovado.',
          sender: 'me',
          time: '14:22'
        }
      ]
    }
  ]);

  // Interval trigger for mock automated photo arrivals (optional background simulator)
  useEffect(() => {
    let timer: any;
    if (isScanningActive && !isPriorityPopupOpen && !isSending) {
      timer = setInterval(() => {
        // 10% chance every 10 seconds of random image arrival in background
        if (Math.random() < 0.25) {
          triggerRandomDetection();
        }
      }, 12000);
    }
    return () => clearInterval(timer);
  }, [isScanningActive, isPriorityPopupOpen, isSending]);

  // Rotate comic tags during loading
  useEffect(() => {
    let comicTimer: any;
    if (isSending) {
      comicTimer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * COMIC_TAGS.length);
        setCurrentComicTag(COMIC_TAGS[randomIndex]);
      }, 2500);
    }
    return () => clearInterval(comicTimer);
  }, [isSending]);

  // Action methods
  const triggerSound = (type: 'tick' | 'alert' | 'success' | 'cancel') => {
    if (!soundEnabled) return;
    if (type === 'tick') playTick();
    if (type === 'alert') playAlert();
    if (type === 'success') playSuccess();
    if (type === 'cancel') playCancel();
  };

  const triggerRandomDetection = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_IMAGES.length);
    const selected = PRESET_IMAGES[randomIndex];
    triggerSpecificDetection(selected);
  };

  const triggerSpecificDetection = (image: PresetImage) => {
    triggerSound('alert');
    setDetectedImage(image);
    setCustomImageFile(null);
    setIsPriorityPopupOpen(true);
    
    // Auto-select a random contact or type
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
    setSelectedContact(randomContact);
    setTargetPhone(randomContact.phone);
    setCustomPhoneInput(randomContact.phone);
    
    // Choose template message corresponding to image type
    if (image.category === 'Design') {
      setCaption(TEMPLATES[1].text);
    } else if (image.category === 'Documentos') {
      setCaption(TEMPLATES[2].text);
    } else if (image.category === 'Saúde') {
      setCaption('⚠️ Segue radiografia digital atualizada para análise clínica.');
    } else {
      setCaption(TEMPLATES[0].text);
    }
  };

  // Drag and Drop simulation/real custom image uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const name = file.name;
      const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      triggerSound('alert');
      setCustomImageFile({ name, url, size });
      setDetectedImage(null);
      setIsPriorityPopupOpen(true);

      // Auto assign standard support contact
      const defaultContact = contacts[0];
      setSelectedContact(defaultContact);
      setTargetPhone(defaultContact.phone);
      setCustomPhoneInput(defaultContact.phone);
      setCaption(TEMPLATES[0].text);
    }
  };

  // Contact management
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName,
      phone: newContactPhone,
      role: 'Manual'
    };
    setContacts(prev => [newContact, ...prev]);
    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
    triggerSound('tick');
  };

  // Add virtual folder to monitor
  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || !newFolderPath) return;
    const newFolder: MonitoredFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      path: newFolderPath,
      type: 'virtual'
    };
    setFolders(prev => [...prev, newFolder]);
    setActiveFolderId(newFolder.id);
    setNewFolderName('');
    setNewFolderPath('');
    triggerSound('tick');
  };

  const handleRemoveFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolders(prev => prev.filter(f => f.id !== id));
    triggerSound('tick');
  };

  // Main simulated sending machine
  const startSendingFlow = () => {
    if (!targetPhone) {
      alert('Por favor, defina um número de telefone!');
      return;
    }
    
    setIsPriorityPopupOpen(false); // Close detection popup modal
    setIsSending(true);
    setSendProgress(0);
    setSendingLogs([]);

    const totalDuration = 7000; // Simulated premium animation process
    const intervalMs = 200;
    let elapsed = 0;

    const logMilestones = [
      { text: '📡 Estabelecendo túnel de automação de janela com WhatsApp Desktop...', time: 200 },
      { text: '👀 Sobrepondo tela nativa para ocultar o processo automatizado...', time: 1000 },
      { text: '🔍 Escaneando seletor do input de conversa para enviar para ' + targetPhone, time: 2000 },
      { text: '✏️ Digitando legenda anexada de maneira humanizada...', time: 3500 },
      { text: '🖼️ Compactando e otimizando imagem para alta retenção...', time: 4800 },
      { text: '🚀 Bits enviados com êxito! Confirmando selo de entrega...', time: 6200 },
    ];

    const flowTimer = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setSendProgress(pct);

      logMilestones.forEach(milestone => {
        if (elapsed >= milestone.time && !sendingLogs.includes(milestone.text)) {
          setSendingLogs(prev => [...prev, milestone.text]);
        }
      });

      if (elapsed >= totalDuration) {
        clearInterval(flowTimer);
        completeSendingFlow();
      }
    }, intervalMs);

    (window as any).flowTimerRef = flowTimer;
  };

  const cancelSendingFlow = () => {
    if ((window as any).flowTimerRef) {
      clearInterval((window as any).flowTimerRef);
    }
    setIsSending(false);
    triggerSound('cancel');

    // Add cancelled log to history
    const name = detectedImage?.name || customImageFile?.name || 'imagem_upload.png';
    const url = detectedImage?.url || customImageFile?.url || '';
    
    setHistoryLogs(prev => [
      {
        id: Date.now().toString(),
        imageName: name,
        imageUrl: url,
        phone: targetPhone,
        caption: caption,
        timestamp: 'Canceled Hoje às ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'canceled'
      },
      ...prev
    ]);
  };

  const completeSendingFlow = () => {
    setIsSending(false);
    setIsSuccessModalOpen(true);
    triggerSound('success');

    const name = detectedImage?.name || customImageFile?.name || 'imagem_upload.png';
    const url = detectedImage?.url || customImageFile?.url || '';

    // 1. Add to sent records panel log
    setHistoryLogs(prev => [
      {
        id: Date.now().toString(),
        imageName: name,
        imageUrl: url,
        phone: targetPhone,
        caption: caption,
        timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'success'
      },
      ...prev
    ]);

    // 2. Insert into the simulated WhatsApp Desktop client on screen
    setWhatsappChats(prev => {
      const existingChat = prev.find(c => c.phone === targetPhone);
      const newMsg = {
        id: Date.now().toString(),
        image: url,
        text: caption,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      if (existingChat) {
        return prev.map(c => c.phone === targetPhone 
          ? { ...c, messages: [...c.messages, newMsg] } 
          : c
        );
      } else {
        return [...prev, { phone: targetPhone, messages: [newMsg] }];
      }
    });
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchContactQuery.toLowerCase()) ||
    c.phone.includes(searchContactQuery)
  );

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f5f9] font-sans overflow-x-hidden selection:bg-[#25d366]/30 selection:text-[#25d366]">
      
      {/* Header bar */}
      <header className="border-b border-gray-800/80 bg-[#0f131a] px-6 py-4 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#25d366] opacity-25 blur-md rounded-xl animate-pulse"></div>
              <div className="bg-gradient-to-tr from-[#128c7e] to-[#25d366] p-2.5 rounded-xl border border-emerald-400/30 flex items-center justify-center">
                <FolderSync className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                ZapFolder <span className="text-[10px] bg-[#25d366]/20 text-[#25d366] border border-[#25d366]/30 px-2 py-0.5 rounded font-mono font-medium tracking-normal align-middle">v3.2 PRO</span>
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Automador Inteligente de Imagens do Monitor Local pro WhatsApp</p>
            </div>
          </div>

          {/* Real-time System Badges and Switches */}
          <div className="flex flex-wrap items-center gap-3 bg-[#161c26] p-1.5 rounded-xl border border-gray-800">
            
            {/* Live Scan State Switch */}
            <button 
              id="switch-scanning-btn"
              onClick={() => { setIsScanningActive(!isScanningActive); triggerSound('tick'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                isScanningActive 
                ? 'bg-emerald-500/15 text-[#25d366] border border-emerald-500/30 font-bold' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isScanningActive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25d366]"></span>
                  </span>
                  <span>MONITORANDO ATIVO</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                  <span>MONITOR PAUSADO</span>
                </>
              )}
            </button>

            {/* Simulated Desktop window focus lock badge / Always-on-top indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 border-l border-gray-800 pl-3 pr-2 py-1 select-none">
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px]">SISTEMA: SEMPRE NO TOPO (OS)</span>
            </div>

            {/* Sound Mute Toggle */}
            <button 
              id="toggle-sound-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              title={soundEnabled ? "Desativar sons do app" : "Ativar sons do app"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#25d366]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Interactive Workspace Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Folder Manager & Injected Simulator Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: Monitored Folders Panel */}
          <div className="bg-[#0f131a] rounded-2xl border border-gray-800/80 p-5 shadow-xl transition hover:border-[#25d366]/20">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#25d366]" />
                <h2 className="text-sm font-semibold tracking-wide font-display text-gray-100 uppercase">Pastas Monitoradas</h2>
              </div>
              <span className="text-[10px] text-gray-500 font-mono font-bold bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
                {folders.length} Ativas
              </span>
            </div>

            {/* Folders List */}
            <div className="space-y-2 mb-4 max-h-[190px] overflow-y-auto pr-1">
              {folders.map(folder => (
                <div 
                  key={folder.id} 
                  onClick={() => { setActiveFolderId(folder.id); triggerSound('tick'); }}
                  className={`p-3 rounded-xl border transition cursor-pointer text-left relative overflow-hidden group ${
                    activeFolderId === folder.id 
                    ? 'bg-emerald-500/10 border-[#25d366]/40 text-[#25d366]' 
                    : 'bg-[#141a24] border-gray-800/60 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${activeFolderId === folder.id ? 'bg-[#25d366]/20 text-[#25d366]' : 'bg-gray-800/60 text-gray-400'}`}>
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold font-display truncate leading-tight">{folder.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate mt-0.5">{folder.path}</p>
                      </div>
                    </div>
                    
                    {/* Delete folder button */}
                    <button 
                      id={`remove-folder-${folder.id}`}
                      onClick={(e) => handleRemoveFolder(folder.id, e)}
                      className="text-gray-500 hover:text-rose-400 p-1 rounded-lg transition hover:bg-rose-500/10 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeFolderId === folder.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 animate-pulse"></span>
                  )}
                </div>
              ))}
              {folders.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-[#141a24] rounded-xl border border-dashed border-gray-800">
                  Nenhuma pasta sendo monitorada.
                </div>
              )}
            </div>

            {/* Quick folder registry form */}
            <form onSubmit={handleAddFolder} className="space-y-2 pt-3 border-t border-gray-800/60">
              <p className="text-[10px] uppercase tracking-wider font-mono font-bold text-gray-400">Adicionar Nova Pasta Física de Origem</p>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  id="folder-name-input"
                  type="text" 
                  placeholder="Ex: Câmera Estúdio" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-[#141a24] border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#25d366]/50"
                  required
                />
                <input 
                  id="folder-path-input"
                  type="text" 
                  placeholder="C:\Destino\Imgs" 
                  value={newFolderPath}
                  onChange={(e) => setNewFolderPath(e.target.value)}
                  className="bg-[#141a24] border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#25d366]/50"
                  required
                />
              </div>
              <button 
                id="add-folder-submit"
                type="submit" 
                className="w-full bg-[#16212e] text-emerald-400 hover:bg-[#128c7e]/20 border border-emerald-500/20 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Pasta ao Scanner
              </button>
            </form>
          </div>

          {/* Section 2: File Injected Simulator Panel (Superb Simulation interactive control) */}
          <div className="bg-[#0f131a] rounded-2xl border border-gray-800/80 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-24 h-24 bg-gradient-to-br from-[#25d366]/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#25d366]" />
                <h2 className="text-sm font-semibold tracking-wide font-display text-gray-100 uppercase">Simular Chegada de Imagem</h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/20 px-2 py-0.5 rounded">
                SIMULADOR
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Como este aplicativo simula o monitoramento em background do seu computador, você pode <b>disparar a detecção</b> instantaneamente de duas maneiras amigáveis:
            </p>

            {/* Option A: Quick presets */}
            <div className="space-y-3">
              <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Método 1: Disparar com Fotos Modelo</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_IMAGES.slice(0, 4).map((img) => (
                  <button
                    id={`trigger-preset-${img.id}`}
                    key={img.id}
                    onClick={() => triggerSpecificDetection(img)}
                    className="flex flex-col items-start p-2 rounded-xl bg-[#141a24] border border-gray-800/80 hover:border-emerald-500/40 text-left transition relative overflow-hidden group"
                  >
                    <div className="w-full h-11 rounded-lg overflow-hidden relative mb-1.5 bg-slate-900 border border-gray-800">
                      <img 
                        src={img.url} 
                        alt={img.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 right-1 bg-black/60 text-[8px] font-mono px-1 py-0.5 rounded text-gray-300">
                        {img.size}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-200 truncate w-full block">{img.category}</span>
                    <span className="text-[8px] text-gray-500 font-mono truncate w-full block">{img.name}</span>
                  </button>
                ))}
              </div>

              {/* Option B: Literal Upload (Simulated arrival) */}
              <div className="pt-2">
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">Método 2: Arraste / Envie sua própria foto</p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 hover:border-emerald-500/40 bg-[#121721] rounded-xl py-4 px-2 cursor-pointer transition">
                  <div className="rounded-full bg-[#25d366]/10 p-2 text-[#25d366] mb-1.5">
                    <FolderSync className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <span className="text-[10px] text-gray-300 text-center font-medium">Selecione de seu computador real</span>
                  <span className="text-[8px] font-mono text-gray-500 mt-0.5">Captura instantânea no ZapFolder</span>
                  <input 
                    id="simulated-file-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Trigger random helper button */}
              <button
                id="trigger-random-button"
                onClick={triggerRandomDetection}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-[#25d366] border border-emerald-500/30 hover:border-emerald-400 py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2"
              >
                💥 DISPARAR ALERTA ALEATÓRIO
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Shared Viewport for Simulated Devices + Sent Logs History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Simulated WhatsApp Background + System Overlay Visual Setup */}
          <div className="bg-[#0b0e14] rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl min-h-[500px] flex flex-col">
            
            {/* System Window Header Mockup mimicking a Desktop screen */}
            <div className="bg-[#141a24] border-b border-gray-800 px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-mono text-gray-400 ml-2 tracking-wide font-medium flex items-center gap-1">
                  🖥️ AREA_TRABALHO_AUTOMACAO_ACTIVE.EXE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-[#25d366] border border-emerald-500/20">
                  DOCK CONECTADA
                </span>
              </div>
            </div>

            {/* Simulated Desktop Wallpaper containing the WhatsApp Client blur model */}
            <div className="flex-1 p-6 relative flex flex-col md:flex-row gap-6 bg-gradient-to-tr from-[#050609] via-[#09111c] to-[#040609]">
              
              {/* Overlay note on what the user is seeing */}
              <div className="absolute top-1 text-center left-0 right-0 z-10">
                <span className="text-[9px] font-mono text-gray-500 tracking-widest bg-gray-950/80 px-3 py-1 rounded-full border border-gray-800/60 shadow">
                  A SEGUIR: EMULADOR DA JANELA ATIVA DO WHATSAPP DESKTOP DO SEU PC
                </span>
              </div>

              {/* Simulated PC Background showing a blurred static WhatsApp Desktop client instance */}
              {/* This mimics the exact behavior described in the prompt ("O Whatsapp desktop não poderá aparecer em tela, estará ''sobreposto'' pela tela de envio do sistema") */}
              <div className="w-full flex flex-col bg-[#111b21] rounded-xl border border-gray-800 shadow-xl overflow-hidden relative mt-4">
                
                {/* Simulated WhatsApp Green Header */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#4f5d64] flex items-center justify-center font-bold text-white text-sm">
                      Z
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-100 flex items-center gap-2">
                        WhatsApp Desktop
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      </h4>
                      <p className="text-[9px] text-[#25d366] font-mono">Automado via ZapFolder background link</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  </div>
                </div>

                {/* Simulated Chat Feed */}
                <div className="flex-1 p-4 space-y-4 min-h-[280px] bg-[#0b141a] relative overflow-y-auto max-h-[340px]">
                  
                  {/* Explanation watermark on the background */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none select-none text-center p-8">
                    <Send className="w-16 h-16 text-[#25d366] mb-3" />
                    <h5 className="font-display font-black text-xl text-[#25d366]">ZAP DESKTOP</h5>
                    <p className="text-xs">Espelho do Cliente WhatsApp do Computador</p>
                  </div>

                  {whatsappChats.map((chat) => (
                    <div key={chat.phone} className="space-y-3">
                      <div className="text-center">
                        <span className="bg-[#182229] border border-gray-800 text-[#25d366] text-[8px] font-mono px-2 py-0.5 rounded-full">
                          Conversa ativa: {chat.phone}
                        </span>
                      </div>

                      {chat.messages.map((msg) => (
                        <div key={msg.id} className="flex justify-end">
                          <div className="bg-[#005c4b] text-gray-100 p-2.5 rounded-xl max-w-[80%] border border-[#00a884]/20 shadow-md">
                            {msg.image && (
                              <div className="rounded-lg overflow-hidden border border-[#017560] mb-1.5 bg-black/40">
                                <img src={msg.image} alt="WhatsApp attachment" className="max-h-[160px] object-cover w-full" referrerPolicy="no-referrer" />
                              </div>
                            )}
                            <p className="text-xs leading-relaxed break-words">{msg.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-emerald-300/80 font-mono">
                              <span>{msg.time}</span>
                              <span className="text-sky-400 font-bold font-sans">✓✓</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {whatsappChats.length === 0 && (
                    <div className="text-center py-16 text-gray-500 text-xs font-mono">
                      Nenhuma conversa disparada ainda por este dispositivo.
                    </div>
                  )}

                </div>

                {/* Simulated input area of Whatsapp (Blocked/Automated state) */}
                <div className="bg-[#202c33] p-3 flex items-center gap-2">
                  <div className="flex-1 bg-[#2a3942] rounded-lg px-3 py-2 text-xs text-gray-500 font-mono select-none flex items-center justify-between">
                    <span>🔒 Entrada controlada pelo ZapFolder automação...</span>
                    <span className="text-[9px] bg-emerald-500/10 text-[#25d366] border border-emerald-500/20 px-1.5 py-0.2 rounded font-sans font-semibold">ATIVADO</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Sent logs history footer */}
            <div className="border-t border-gray-800 bg-[#10151f] p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-gray-300 uppercase">Últimos Envios no Computador</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
                {historyLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0a0d14] border border-gray-800/80">
                    <img 
                      src={log.imageUrl} 
                      alt={log.imageName} 
                      className="w-10 h-10 rounded-lg object-cover bg-black border border-gray-800 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-gray-300 truncate font-mono">{log.phone}</span>
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded shrink-0 ${
                          log.status === 'success' ? 'bg-emerald-500/10 text-[#25d366]' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {log.status === 'success' ? 'ENVIADO' : 'CORTADO'}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-500 truncate mt-0.5">{log.imageName}</p>
                      <p className="text-[8px] text-gray-600 font-mono mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ==================== SCREEN POPUP CONTROLLER 1: DIRECT TARGET DIALOG ==================== */}
      <AnimatePresence>
        {isPriorityPopupOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            
            {/* Visual background indicator warning always on top priority over current screen */}
            <div className="absolute inset-0 border-[6px] border-emerald-500/10 animate-pulse pointer-events-none"></div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#0f131a] rounded-2xl border-2 border-[#25d366] max-w-2xl w-full p-6 shadow-[0_0_50px_rgba(37,211,102,0.25)] relative overflow-hidden"
            >
              
              {/* Neon corner border tags */}
              <div className="absolute top-0 left-0 bg-[#25d366] text-black text-[9px] font-black font-mono tracking-widest px-3 py-1 rounded-br-lg uppercase">
                🚨 DETECÇÃO DE PRIORIDADE MÁXIMA
              </div>

              {/* Close Button top-right */}
              <button 
                id="close-priority-popup"
                onClick={() => { setIsPriorityPopupOpen(false); triggerSound('cancel'); }}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mt-4 mb-6 flex flex-col md:flex-row gap-6">
                
                {/* Image Preview Left */}
                <div className="w-full md:w-1/2">
                  <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    ARQUIVO IDENTIFICADO NO DISCO
                  </p>
                  
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-gray-800 p-2.5 flex flex-col justify-center items-center">
                    <img 
                      src={detectedImage ? detectedImage.url : customImageFile?.url} 
                      alt="Captured screenshot preview" 
                      className="max-h-[220px] rounded-lg object-contain bg-black/60 w-full"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="w-full mt-3 bg-[#131924] p-2 rounded-lg border border-gray-800">
                      <p className="text-[10px] font-mono text-gray-300 font-bold truncate">
                        📄 {detectedImage ? detectedImage.name : customImageFile?.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] font-mono text-gray-500">Tamanho: {detectedImage ? detectedImage.size : customImageFile?.size}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          Pasta: {activeFolderId ? folders.find(f => f.id === activeFolderId)?.name : 'Trigger'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form & Destination Fields on Right */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-gray-100 tracking-tight leading-snug">
                      Nova Imagem Encontrada!
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-normal mb-4">
                      O monitor inteligente capturou uma atualização em tempo real. Deseja realizar a automação imediata para o WhatsApp Desktop?
                    </p>

                    {/* Choose Preset Contacts Directory */}
                    <div className="space-y-2 mb-3">
                      <label className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider block">1. Escolher contato frequente</label>
                      
                      <div className="flex gap-1.5 bg-[#141a24] p-1.5 rounded-lg border border-gray-800">
                        <Search className="w-4 h-4 text-gray-500 self-center ml-1" />
                        <input 
                          id="contact-search-input"
                          type="text" 
                          placeholder="Pesquisar contatos instalados..."
                          value={searchContactQuery}
                          onChange={(e) => setSearchContactQuery(e.target.value)}
                          className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-gray-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 max-h-[85px] overflow-y-auto pr-1 bg-slate-950 p-1.5 rounded-lg border border-gray-900">
                        {filteredContacts.map(contact => (
                          <button
                            id={`select-contact-${contact.id}`}
                            key={contact.id}
                            type="button"
                            onClick={() => {
                              setSelectedContact(contact);
                              setTargetPhone(contact.phone);
                              setCustomPhoneInput(contact.phone);
                              triggerSound('tick');
                            }}
                            className={`p-1.5 rounded text-left transition text-[10px] flex items-center justify-between ${
                              selectedContact?.id === contact.id
                              ? 'bg-[#128c7e]/20 text-[#25d366] border border-[#25d366]/40 font-bold'
                              : 'bg-[#121620] hover:bg-gray-800 text-gray-300 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">{contact.name}</p>
                              <p className="font-mono text-[8px] text-gray-500 truncate">{contact.phone}</p>
                            </div>
                            <span className="text-[8px] bg-slate-900 text-slate-400 px-1 rounded ml-1 shrink-0">{contact.role}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone Input Box */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider">2. Número de Celular de Destino</label>
                        <span className="text-[9px] text-emerald-400 font-mono">DDI+DDD+NÚMERO</span>
                      </div>
                      <input 
                        id="target-phone-input"
                        type="text" 
                        placeholder="Ex: +5511999998888"
                        value={customPhoneInput}
                        onChange={(e) => { 
                          setCustomPhoneInput(e.target.value); 
                          setTargetPhone(e.target.value); 
                        }}
                        className="w-full bg-[#141a24] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Message Templates / Input caption */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider">3. Legenda Textual do Envio</label>
                        <span className="text-[9px] text-[#25d366] font-semibold">Legenda</span>
                      </div>
                      
                      {/* Message preset pills */}
                      <div className="flex flex-wrap gap-1 mb-1.5 max-h-[50px] overflow-y-auto">
                        {TEMPLATES.map((tmpl, idx) => (
                          <button
                            id={`caption-template-${idx}`}
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCaption(tmpl.text);
                              triggerSound('tick');
                            }}
                            className={`text-[8.5px] px-2 py-0.5 rounded-full transition ${
                              caption === tmpl.text
                              ? 'bg-emerald-500 text-black font-bold'
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {tmpl.label}
                          </button>
                        ))}
                      </div>

                      <textarea 
                        id="caption-text-area"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={2.5}
                        placeholder="Escreva uma mensagem personalizada que receberá uma cópia da imagem..."
                        className="w-full bg-[#141a24] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                  </div>

                  {/* Submission Controls inside the alert window */}
                  <div className="flex gap-2.5 pt-3 border-t border-gray-800/80">
                    <button
                      id="abort-priority-btn"
                      type="button"
                      onClick={() => { setIsPriorityPopupOpen(false); triggerSound('cancel'); }}
                      className="w-1/3 bg-[#1d1b24] hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 text-rose-400 py-3 rounded-xl text-xs font-mono font-bold transition uppercase"
                    >
                      PULAR ENVIO
                    </button>
                    <button
                      id="confirm-priority-send-btn"
                      type="button"
                      onClick={startSendingFlow}
                      className="w-2/3 bg-gradient-to-r from-emerald-600 to-[#128c7e] hover:from-emerald-500 hover:to-[#25d366] text-white py-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 uppercase"
                    >
                      <Send className="w-3.5 h-3.5" /> Enviar Agora p/ Whatsapp
                    </button>
                  </div>

                </div>

              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN POPUP CONTROLLER 2: SENDING LOADER FULL-SCREEN OVERLAY ==================== */}
      <AnimatePresence>
        {isSending && (
          <div className="fixed inset-0 bg-[#07090e]/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 text-center">
            
            {/* Pulsing automation ring */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent animate-pulse pointer-events-none"></div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="max-w-xl w-full p-8"
            >
              
              {/* Spinner animation */}
              <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-900"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#25d366] border-t-transparent animate-spin"></div>
                
                {/* Embedded dynamic percent */}
                <div className="font-display font-bold text-xl text-white font-mono">
                  {Math.round(sendProgress)}%
                </div>
              </div>

              {/* Automation Title */}
              <h2 className="text-2xl font-display font-black text-gray-100 uppercase tracking-tight flex items-center justify-center gap-3">
                <FolderSync className="w-7 h-7 text-[#25d366] animate-pulse" />
                Estamos enviando a sua foto
              </h2>
              
              <p className="text-sm text-gray-400 mt-2">
                O ZapFolder está acoplado ao WhatsApp Desktop em background, enviando sua foto silenciosamente.
              </p>

              {/* Comic loading tags panel */}
              <div className="mt-8 bg-[#111926]/90 border border-emerald-500/20 px-6 py-4 rounded-2xl relative shadow-inner">
                <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#25d366] text-black text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded font-mono">
                  PROCESSO ENVISADO
                </div>
                
                <p className="text-sm font-semibold text-[#25d366] tracking-wide animate-pulse">
                  {currentComicTag}
                </p>
              </div>

              {/* Terminal Logs for simulated high-fidelity automation steps */}
              <div className="mt-6 bg-[#080d16] font-mono p-4 rounded-xl text-left text-xs space-y-1.5 border border-gray-800 text-gray-400 max-h-[160px] overflow-y-auto">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1 border-b border-gray-800 pb-1">CONSOLE DE DISPAROS DO WHATSAPP_API</p>
                {sendingLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-[#25d366] font-bold">✓</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 animate-pulse pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
                  <span>Construindo comandos em lote...</span>
                </div>
              </div>

              {/* INTERRUPT CANCEL ACTION GIVING EXCELLENT USER FREEDOM CONTROL */}
              <div className="mt-8">
                <button
                  id="cancel-automation-btn"
                  onClick={cancelSendingFlow}
                  className="px-6 py-3 bg-[#1e141a] hover:bg-[#34111d] text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/50 rounded-xl text-xs font-mono font-bold tracking-wider transition uppercase shadow-lg shadow-rose-950/30"
                >
                  Interromper Fluxo (Sair / Abortar)
                </button>
                <p className="text-[10px] text-gray-500 mt-2 font-mono">
                  Pressione a qualquer momento para cancelar com segurança sem alterar o WhatsApp do Desktop.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN POPUP CONTROLLER 3: SUCCESS BLOCK MODAL ==================== */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f131a] rounded-2xl border-2 border-emerald-500/30 max-w-md w-full p-8 shadow-[0_0_60px_rgba(37,211,102,0.15)] relative overflow-hidden"
            >
              
              {/* Confetti decoration circles */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500"></div>

              {/* Radial backdrop green light glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full"></div>

              {/* Checkmark animation container */}
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#25d366]/10 animate-ping opacity-60"></div>
                <div className="relative bg-[#25d366]/20 text-[#25d366] border border-emerald-500/30 rounded-full p-4 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#25d366]" />
                </div>
              </div>

              {/* Status Header */}
              <h2 className="text-xl font-display font-bold text-white tracking-tight">
                Foto enviada com sucesso!
              </h2>
              
              <p className="text-xs text-gray-400 mt-2 mb-6 leading-relaxed">
                A imagem monitorada foi processada, anexada na fila, e entregue com legenda. O WhatsApp Desktop completou a transmissão!
              </p>

              {/* Small details overview container */}
              <div className="bg-[#141a24] p-3.5 rounded-xl border border-gray-800 text-left space-y-1.5 mb-6 text-xs text-gray-400">
                <div className="flex justify-between items-center text-[11px] border-b border-gray-800 pb-1.5 mb-1.5">
                  <span className="font-mono text-gray-500 uppercase">Detalhamento Técnico</span>
                  <span className="font-mono text-emerald-400 font-bold">ZAP_SUCCESS</span>
                </div>
                <p className="font-mono"><span className="text-gray-500">Destinatário:</span> <span className="text-gray-200 font-bold">{targetPhone}</span></p>
                <p className="font-mono truncate"><span className="text-gray-500">Arquivo:</span> <span className="text-gray-200">{detectedImage ? detectedImage.name : customImageFile?.name}</span></p>
                <p className="font-mono truncate"><span className="text-gray-500">Status final:</span> <span className="text-emerald-400">Entrega do byte verificada</span></p>
              </div>

              {/* Re-enter back action button */}
              <button 
                id="close-success-flow"
                onClick={() => { setIsSuccessModalOpen(false); triggerSound('tick'); }}
                className="w-full bg-[#25d366] text-[#090b10] hover:bg-[#128c7e] hover:text-white py-3 rounded-xl text-xs font-mono font-black tracking-wider transition uppercase"
              >
                Retornar ao Monitoramento
              </button>
              
              <p className="text-[10px] text-gray-500 mt-3 font-mono">
                ZapFolder foi recolocado em segundo plano e aguarda nova imagem.
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer copyright info */}
      <footer className="border-t border-gray-800/80 bg-[#07090e] py-6 px-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono">Desenvolvido com carinho para Joseph Hilton &copy; 2026 ZapFolder. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition">Termos de Uso</a>
            <a href="#" className="hover:text-emerald-400 transition">API de Automação</a>
            <a href="#" className="hover:text-emerald-400 transition">Atalhos de Sistema</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
