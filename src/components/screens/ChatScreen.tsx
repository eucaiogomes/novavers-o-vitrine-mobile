import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Users, MessageSquare, ChevronLeft, MoreHorizontal,
  Paperclip, Send, CheckCheck,
} from 'lucide-react';

type ChatMsg = {
  id: string;
  autor?: string;
  texto: string;
  hora: string;
  propria?: boolean;
  anexo?: string;
};

export const SUPPORT_CHAT_ID = 'suporte-lector';

const CHAT_CONVERSAS = [
  { id: SUPPORT_CHAT_ID, nome: 'Suporte Lector', sub: 'Atendimento Lector', avatar: 'https://picsum.photos/seed/supportLector/100/100', online: true,  grupo: false },
  { id: 'chat1', nome: 'Caio Thiago',   sub: 'Suporte',           avatar: 'https://picsum.photos/seed/chatA/100/100', online: true,  grupo: false },
  { id: 'chat2', nome: 'Time QA',       sub: 'Guilherme, Luiz Fellipe, Mikaelle, Thiago', avatar: '', online: false, grupo: true  },
  { id: 'chat3', nome: 'Luiz Fellipe',  sub: 'Desenvolvimento',   avatar: 'https://picsum.photos/seed/chatB/100/100', online: true,  grupo: false },
  { id: 'chat4', nome: 'Mikaelle Souza', sub: 'Gestão de Pessoas', avatar: 'https://picsum.photos/seed/chatC/100/100', online: false, grupo: false },
  { id: 'chat5', nome: 'Thiago Almeida', sub: 'Comercial',         avatar: 'https://picsum.photos/seed/chatD/100/100', online: false, grupo: false },
];

const CHAT_USUARIOS = [
  { id: 'chat1', nome: 'Caio Thiago',     cargo: 'Suporte',           avatar: 'https://picsum.photos/seed/chatA/100/100', online: true  },
  { id: 'chat3', nome: 'Luiz Fellipe',    cargo: 'Desenvolvimento',   avatar: 'https://picsum.photos/seed/chatB/100/100', online: true  },
  { id: 'chat4', nome: 'Mikaelle Souza',  cargo: 'Gestão de Pessoas', avatar: 'https://picsum.photos/seed/chatC/100/100', online: false },
  { id: 'chat5', nome: 'Thiago Almeida',  cargo: 'Comercial',         avatar: 'https://picsum.photos/seed/chatD/100/100', online: false },
  { id: 'chat6', nome: 'Guilherme Rocha', cargo: 'Qualidade',         avatar: 'https://picsum.photos/seed/chatE/100/100', online: false },
];

const CHAT_MENSAGENS_INICIAIS: Record<string, ChatMsg[]> = {
  [SUPPORT_CHAT_ID]: [
    { id: 's1', texto: 'Olá! Você está falando com o suporte da Lector. Como podemos ajudar?', hora: 'Agora' },
  ],
  chat1: [
    { id: 'm1', texto: 'Bom dia! Conseguiu validar o certificado da turma?', hora: '10:38' },
    { id: 'm2', texto: 'Bom dia! Sim, validei agora pela manhã', hora: '10:40', propria: true },
    { id: 'm3', texto: 'Perfeito, vou anexar o documento da turma então', hora: '10:41' },
    { id: 'm4', texto: 'Rotinas_Suporte.pdf', hora: '10:41', anexo: '2,4 MB · PDF' },
    { id: 'm5', texto: 'Recebido, obrigado!', hora: '10:42', propria: true },
  ],
  chat2: [
    { id: 'g1', autor: 'Guilherme',    texto: 'Pessoal, terminei os testes do fluxo de compra', hora: '08:52' },
    { id: 'g2', autor: 'Mikaelle',     texto: 'Algum bug crítico?', hora: '08:58' },
    { id: 'g3', autor: 'Guilherme',    texto: 'Nenhum, validei o fluxo completo', hora: '09:02' },
    { id: 'g4', autor: 'Luiz Fellipe', texto: 'Subi a correção do menu também', hora: '09:10' },
    { id: 'g5', texto: 'Ótimo trabalho, time! Vou atualizar o board', hora: '09:15', propria: true },
  ],
  chat3: [
    { id: 'l1', texto: 'Fala Caio! Subi os ajustes do menu de perfil', hora: '13:58' },
    { id: 'l2', texto: 'Show, vou testar aqui', hora: '14:00', propria: true },
    { id: 'l3', texto: 'Consegue revisar o PR hoje?', hora: '14:02' },
  ],
  chat4: [
    { id: 'k1', texto: 'Oi Caio, podemos alinhar o treinamento de quinta?', hora: '11:20' },
    { id: 'k2', texto: 'Claro! Pode ser às 14h?', hora: '11:32', propria: true },
    { id: 'k3', texto: 'Reunião confirmada para às 14h', hora: '11:40' },
  ],
  chat5: [
    { id: 't1', texto: 'Thiago, o cliente aprovou o orçamento?', hora: 'seg', propria: true },
    { id: 't2', texto: 'Aprovou! Te mando a proposta amanhã', hora: 'seg' },
  ],
};

const CHAT_AUTOR_CORES: Record<string, string> = {
  'Guilherme':    'text-blue-600',
  'Mikaelle':     'text-pink-600',
  'Luiz Fellipe': 'text-purple-600',
  'Thiago':       'text-teal-600',
};

export const ChatScreen = ({
  isOpen,
  onClose,
  initialConversationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string | null;
}) => {
  const [aba, setAba] = useState<'conversas' | 'usuarios'>('conversas');
  const [busca, setBusca] = useState('');
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Record<string, ChatMsg[]>>(CHAT_MENSAGENS_INICIAIS);
  const [naoLidas, setNaoLidas] = useState<Record<string, number>>({ chat1: 2, chat2: 1 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setConversaAtiva(null);
      setBusca('');
      setMensagem('');
      setAba('conversas');
      return;
    }

    if (initialConversationId) {
      setAba('conversas');
      setBusca('');
      setMensagem('');
      setNaoLidas(prev => ({ ...prev, [initialConversationId]: 0 }));
      setConversaAtiva(initialConversationId);
    }
  }, [isOpen, initialConversationId]);

  // Sempre rolar para a última mensagem
  useEffect(() => {
    if (conversaAtiva && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversaAtiva, mensagens]);

  const abrirConversa = (id: string) => {
    setNaoLidas(prev => ({ ...prev, [id]: 0 }));
    setConversaAtiva(id);
  };

  const enviar = () => {
    const txt = mensagem.trim();
    if (!txt || !conversaAtiva) return;
    const nova: ChatMsg = {
      id: `n${Date.now()}`,
      texto: txt,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      propria: true,
    };
    setMensagens(prev => ({ ...prev, [conversaAtiva]: [...(prev[conversaAtiva] ?? []), nova] }));
    setMensagem('');
  };

  const termo = busca.trim().toLowerCase();
  const conversasFiltradas = CHAT_CONVERSAS.filter(c =>
    !termo || c.nome.toLowerCase().includes(termo) || c.sub.toLowerCase().includes(termo)
  );
  const usuariosFiltrados = CHAT_USUARIOS.filter(u =>
    !termo || u.nome.toLowerCase().includes(termo) || u.cargo.toLowerCase().includes(termo)
  );

  const conv = CHAT_CONVERSAS.find(c => c.id === conversaAtiva);
  const usuario = CHAT_USUARIOS.find(u => u.id === conversaAtiva);
  const tituloConversa = conv?.nome ?? usuario?.nome ?? '';
  const conversaOnline = conv?.online ?? usuario?.online ?? false;
  const subtituloConversa = conv?.grupo
    ? conv.sub
    : conversaOnline ? 'Online agora' : (conv?.sub ?? usuario?.cargo ?? '');
  const avatarConversa = conv?.avatar || usuario?.avatar || '';
  const msgsAtivas = conversaAtiva ? (mensagens[conversaAtiva] ?? []) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-screen"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed top-14 inset-x-0 bottom-0 z-[95] lg:hidden flex flex-col overflow-hidden"
          style={{ backgroundColor: '#F2F2F7' }}
        >
          <div className="flex-1 relative min-h-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {conversaAtiva === null ? (
                /* ───────── LISTA ───────── */
                <motion.div
                  key="chat-lista"
                  initial={{ x: '-30%', opacity: 0.6 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '-30%', opacity: 0.6 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="absolute inset-0 flex flex-col"
                  style={{ backgroundColor: '#F2F2F7' }}
                >
                  {/* Título grande iOS */}
                  <div className="flex-shrink-0 relative flex items-center justify-center h-11 bg-white border-b border-gray-200">
                    <button
                      onClick={onClose}
                      className="absolute left-2 flex items-center gap-0.5 px-2 h-full text-brand-primary"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="text-[17px]">Voltar</span>
                    </button>
                    <span className="text-[17px] font-semibold text-gray-900">Chat</span>
                    <button
                      onClick={() => setAba('usuarios')}
                      className="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-5 w-5 text-brand-primary" />
                    </button>
                  </div>

                  {/* Segmented control */}
                  <div className="flex-shrink-0 mx-4 mt-4 mb-3 bg-gray-200/70 rounded-lg p-0.5 flex">
                    {([['conversas', 'Conversas'], ['usuarios', 'Usuários']] as const).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setAba(id)}
                        className={`flex-1 h-8 rounded-[7px] text-[13px] font-semibold transition-all ${
                          aba === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Busca */}
                  <div className="flex-shrink-0 mx-4 mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={busca}
                      onChange={e => setBusca(e.target.value)}
                      placeholder={aba === 'conversas' ? 'Buscar conversa' : 'Buscar usuário'}
                      className="w-full bg-white rounded-xl pl-9 pr-4 h-10 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none"
                    />
                  </div>

                  {/* Lista */}
                  <div className="flex-1 overflow-y-auto pb-8">
                    {aba === 'conversas' ? (
                      conversasFiltradas.length > 0 ? (
                        <div className="bg-white rounded-2xl overflow-hidden mx-4">
                          {conversasFiltradas.map((c, i, arr) => {
                            const msgs = mensagens[c.id] ?? [];
                            const ultima = msgs[msgs.length - 1];
                            const preview = ultima
                              ? `${ultima.propria ? 'Você: ' : ''}${ultima.anexo ? `Anexo · ${ultima.texto}` : ultima.texto}`
                              : 'Iniciar conversa';
                            const unread = naoLidas[c.id] ?? 0;
                            return (
                              <React.Fragment key={c.id}>
                                <button
                                  onClick={() => abrirConversa(c.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="relative flex-shrink-0">
                                    {c.grupo ? (
                                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-brand-primary" />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img src={c.avatar} alt={c.nome} className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                    {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-[15px] text-gray-900 truncate ${unread > 0 ? 'font-semibold' : 'font-medium'}`}>{c.nome}</p>
                                    <p className={`text-[13px] truncate ${unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{preview}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className={`text-[12px] ${unread > 0 ? 'text-brand-primary font-semibold' : 'text-gray-400'}`}>{ultima?.hora ?? ''}</span>
                                    {unread > 0 ? (
                                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-primary text-white text-[11px] font-semibold flex items-center justify-center">{unread}</span>
                                    ) : (
                                      <span className="h-[18px]" />
                                    )}
                                  </div>
                                </button>
                                {i < arr.length - 1 && <div className="h-px bg-gray-100 ml-[76px]" />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-[13px] text-gray-400 py-10">Nenhuma conversa encontrada</p>
                      )
                    ) : (
                      <>
                        <p className="text-[13px] text-gray-500 font-normal px-4 mb-1 uppercase tracking-wide">Disponíveis</p>
                        {usuariosFiltrados.length > 0 ? (
                          <div className="bg-white rounded-2xl overflow-hidden mx-4">
                            {usuariosFiltrados.map((u, i, arr) => (
                              <React.Fragment key={u.id}>
                                <button
                                  onClick={() => abrirConversa(u.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                      <img src={u.avatar} alt={u.nome} className="w-full h-full object-cover" />
                                    </div>
                                    {u.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-medium text-gray-900 truncate">{u.nome}</p>
                                    <p className="text-[13px] text-gray-500 truncate">{u.cargo}</p>
                                  </div>
                                  <MessageSquare className="h-[18px] w-[18px] text-gray-300 flex-shrink-0" />
                                </button>
                                {i < arr.length - 1 && <div className="h-px bg-gray-100 ml-[76px]" />}
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-[13px] text-gray-400 py-10">Nenhum usuário encontrado</p>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ───────── CONVERSA ───────── */
                <motion.div
                  key={`chat-conversa-${conversaAtiva}`}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="absolute inset-0 flex flex-col"
                  style={{ backgroundColor: '#F2F2F7' }}
                >
                  {/* Cabeçalho da conversa */}
                  <div className="flex-shrink-0 flex items-center gap-1.5 h-[52px] bg-white border-b border-gray-200 pl-1 pr-2">
                    <button onClick={() => setConversaAtiva(null)} className="p-2 text-brand-primary flex-shrink-0">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    {conv?.grupo ? (
                      <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-brand-primary" />
                      </div>
                    ) : (
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden">
                          <img src={avatarConversa} alt={tituloConversa} className="w-full h-full object-cover" />
                        </div>
                        {conversaOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 ml-1.5">
                      <p className="text-[15px] font-semibold text-gray-900 truncate leading-tight">{tituloConversa}</p>
                      <p className={`text-[11px] truncate leading-tight ${!conv?.grupo && conversaOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {subtituloConversa}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 flex-shrink-0">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mensagens */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-3">
                    <div className="flex justify-center my-3">
                      <span className="text-[11px] text-gray-500 bg-gray-200/70 px-2.5 py-0.5 rounded-full">Hoje</span>
                    </div>
                    {msgsAtivas.map((m, i) => {
                      const anterior = msgsAtivas[i - 1];
                      const mesmoLado = anterior && !!anterior.propria === !!m.propria;
                      const mostraAutor = !m.propria && conv?.grupo && m.autor && anterior?.autor !== m.autor;
                      return (
                        <div key={m.id} className={`flex ${m.propria ? 'justify-end' : 'justify-start'} ${mesmoLado ? 'mt-1' : 'mt-2.5'}`}>
                          <div className={`max-w-[78%] px-3.5 py-2 ${
                            m.propria
                              ? 'bg-brand-primary text-white rounded-2xl rounded-br-md'
                              : 'bg-white text-gray-900 rounded-2xl rounded-bl-md'
                          }`}>
                            {mostraAutor && (
                              <p className={`text-[11px] font-semibold mb-0.5 ${CHAT_AUTOR_CORES[m.autor!] ?? 'text-gray-500'}`}>{m.autor}</p>
                            )}
                            {m.anexo ? (
                              <div className="flex items-center gap-2.5 py-0.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.propria ? 'bg-white/20' : 'bg-brand-primary/10'}`}>
                                  <Paperclip className={`h-4 w-4 ${m.propria ? 'text-white' : 'text-brand-primary'}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[14px] font-medium leading-tight truncate">{m.texto}</p>
                                  <p className={`text-[11px] ${m.propria ? 'text-white/70' : 'text-gray-400'}`}>{m.anexo}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[15px] leading-snug">{m.texto}</p>
                            )}
                            <p className={`text-[10px] mt-0.5 flex items-center gap-0.5 justify-end ${m.propria ? 'text-white/70' : 'text-gray-400'}`}>
                              {m.hora}
                              {m.propria && <CheckCheck className="h-3 w-3" />}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra de mensagem */}
                  <div className="flex-shrink-0 bg-white border-t border-gray-200 px-3 py-2.5 flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 active:bg-gray-100 transition-colors flex-shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={mensagem}
                      onChange={e => setMensagem(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') enviar(); }}
                      placeholder="Mensagem"
                      className="flex-1 bg-gray-100 rounded-full px-4 h-9 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none min-w-0"
                    />
                    <motion.button
                      onClick={enviar}
                      disabled={!mensagem.trim()}
                      whileTap={mensagem.trim() ? { scale: 0.9 } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                    >
                      <Send className="h-4 w-4 text-white -ml-0.5 mt-0.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
