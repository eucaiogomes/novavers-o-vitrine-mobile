import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Bell, Award, MessageSquare, Play, Compass,
  Calendar, ShoppingBag, Users, User, Check, Globe, Download,
  CheckCircle, BookOpen, LogOut, LayoutDashboard, LayoutGrid, Star, Accessibility,
} from 'lucide-react';
import { PROFILE_NOTIFICATION_COUNT } from './NotificationsScreen';

const ProfileRow = ({
  icon: Icon,
  label,
  value,
  onClick,
  danger,
  last,
  strong,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  last?: boolean;
  strong?: boolean;
}) => (
  <>
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 min-h-[52px] active:bg-gray-100 transition-colors ${
        danger ? 'text-red-500' : 'text-gray-900'
      }`}
    >
      <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
      <span className={`flex-1 text-left text-[15px] ${strong ? 'font-semibold' : ''}`}>{label}</span>
      {value && <span className="text-[15px] text-gray-400 mr-1">{value}</span>}
      {!danger && <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />}
    </button>
    {!last && <div className="h-px bg-gray-100 ml-[46px]" />}
  </>
);

// Grupo recolhível — mesmo padrão das categorias da sidebar de vitrines:
// header com label, pill contadora e chevron que gira 90°; conteúdo expande no lugar
const ProfileGroup = ({
  icon: Icon,
  label,
  isOpen,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl overflow-hidden mx-4 mb-3">
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 min-h-[52px] active:bg-gray-100 transition-colors"
    >
      <Icon className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
      <span className={`flex-1 text-left text-[15px] font-semibold ${isOpen ? 'text-brand-primary' : 'text-gray-900'}`}>
        {label}
      </span>
      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
        <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="overflow-hidden border-t border-gray-100"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PORTAIS = [
  { id: 'lector',  nome: 'Lector Suporte',       sigla: 'LS', cor: 'bg-orange-50 text-orange-600' },
  { id: 'esmp',    nome: 'ESMP',                 sigla: 'ES', cor: 'bg-blue-50 text-blue-600' },
  { id: 'cigam',   nome: 'CIGAM',                sigla: 'CG', cor: 'bg-purple-50 text-purple-600' },
  { id: 'unimed',  nome: 'Unimed Volta Redonda', sigla: 'UV', cor: 'bg-emerald-50 text-emerald-600' },
  { id: 'sicoob',  nome: 'Sicoob',               sigla: 'SI', cor: 'bg-teal-50 text-teal-600' },
  { id: 'digicon', nome: 'Grupo Digicon',        sigla: 'GD', cor: 'bg-slate-100 text-slate-600' },
];

export const ProfileScreen = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenCertificado,
  onOpenChat,
  onOpenNotifications,
}: {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onOpenCertificado: () => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
}) => {
  const swipeStartX = useRef(0);
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);
  const [perfilAtivo, setPerfilAtivo] = useState('aluno');
  const [isIdiomaOpen, setIsIdiomaOpen] = useState(false);
  const [idiomaAtivo, setIdiomaAtivo] = useState('pt-br');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [portalAtivo, setPortalAtivo] = useState('lector');
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Igual à sidebar: só uma seção aberta por vez; trocar de seção fecha os subníveis
  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
    setIsPerfilOpen(false);
    setIsIdiomaOpen(false);
    setIsPortalOpen(false);
  };

  const IDIOMAS = [
    { id: 'pt-br', label: 'Português', country: 'Brasil', locale: 'Português do Brasil' },
    { id: 'en',    label: 'English',   country: 'Estados Unidos', locale: 'English (US)' },
    { id: 'es',    label: 'Español',   country: 'España', locale: 'Español de España' },
  ];

  const idiomaSelecionado = IDIOMAS.find(i => i.id === idiomaAtivo) ?? IDIOMAS[0];

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const handleTouchStart = (e: React.TouchEvent) => { swipeStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientX - swipeStartX.current > 60) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="profile-screen"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[90] lg:hidden flex flex-col overflow-hidden"
          style={{ backgroundColor: '#F2F2F7' }}
        >
          {/* iOS-style header — centered title, back left */}
          <div className="flex-shrink-0 relative flex items-center justify-center h-11 bg-white border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute left-2 flex items-center gap-0.5 px-2 h-full text-brand-primary"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[17px]">Voltar</span>
            </button>
            <span className="text-[17px] font-semibold text-gray-900">Perfil</span>
            <button
              onClick={onOpenNotifications}
              aria-label={`Notificações, ${PROFILE_NOTIFICATION_COUNT} não lidas`}
              className="absolute right-2 w-11 h-11 flex items-center justify-center text-gray-500 active:bg-gray-100 transition-colors"
            >
              <span className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-primary text-white text-[11px] font-semibold flex items-center justify-center ring-2 ring-white">
                  {PROFILE_NOTIFICATION_COUNT}
                </span>
              </span>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto pt-6">

            {/* User identity — flat card, no shadow */}
            <div className="bg-white rounded-2xl mx-4 mb-6 px-4 py-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-semibold text-gray-900 leading-snug">Caio Gomes</div>
                <div className="text-[13px] text-gray-500 truncate">suporte2@lectortec.com.br</div>
                <div className="text-[13px] font-semibold text-brand-primary mt-0.5">Aluno</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 flex-shrink-0">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-[12px] font-semibold text-gray-700 whitespace-nowrap">1.324 pts</span>
              </div>
            </div>

            {/* Idioma */}
            <div className="mb-3">
              <div className="bg-white rounded-2xl overflow-hidden mx-4">
                <button
                  onClick={() => {
                    setIsIdiomaOpen(v => !v);
                    setOpenSection(null);
                    setIsPerfilOpen(false);
                    setIsPortalOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 min-h-[62px] active:bg-gray-100 transition-colors text-gray-900"
                >
                  <Globe className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                  <span className="flex-1 text-left min-w-0">
                    <span className="block text-[15px] font-semibold text-gray-900 leading-snug">Idioma</span>
                    <span className="block text-[12px] text-gray-400 leading-snug mt-0.5 truncate">
                      {idiomaSelecionado.label} · {idiomaSelecionado.country}
                    </span>
                  </span>
                  <motion.div animate={{ rotate: isIdiomaOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isIdiomaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      {IDIOMAS.map(({ id, label, country, locale }) => {
                        const active = idiomaAtivo === id;
                        return (
                          <button
                            key={id}
                            aria-pressed={active}
                            onClick={() => { setIdiomaAtivo(id); setIsIdiomaOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 min-h-[64px] active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 ${
                              active ? 'bg-brand-primary/[0.04]' : ''
                            }`}
                          >
                            <span className="w-[18px] flex-shrink-0" />
                            <div className="flex-1 text-left min-w-0">
                              <div className={`text-[15px] font-semibold leading-snug ${active ? 'text-brand-primary' : 'text-gray-900'}`}>
                                {label}
                              </div>
                              <div className="text-[12px] text-gray-400 leading-snug mt-0.5 truncate">{country} · {locale}</div>
                            </div>
                            {active && <Check className="h-4 w-4 text-brand-primary flex-shrink-0" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Acessibilidade */}
            <div className="mb-3">
              <div className="bg-white rounded-2xl overflow-hidden mx-4">
                <ProfileRow icon={Accessibility} label="Acessibilidade" strong last />
              </div>
            </div>

            {/* Portal — troca de contexto */}
            <div className="mb-3">
              <div className="bg-white rounded-2xl overflow-hidden mx-4">
                <button
                  onClick={() => {
                    setIsPortalOpen(v => !v);
                    setOpenSection(null);
                    setIsPerfilOpen(false);
                    setIsIdiomaOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 min-h-[52px] active:bg-gray-100 transition-colors"
                >
                  <LayoutGrid className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                  <span className="flex-1 text-left text-[15px] font-semibold text-gray-900">Portais</span>
                  <motion.div animate={{ rotate: isPortalOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isPortalOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      {PORTAIS.map(p => {
                        const active = portalAtivo === p.id;
                        return (
                          <button
                            key={p.id}
                            aria-pressed={active}
                            onClick={() => { setPortalAtivo(p.id); setIsPortalOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 min-h-[52px] active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 ${
                              active ? 'bg-brand-primary/[0.04]' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${p.cor}`}>
                              {p.sigla}
                            </div>
                            <span className={`flex-1 text-left text-[15px] truncate ${active ? 'font-semibold text-brand-primary' : 'font-medium text-gray-800'}`}>
                              {p.nome}
                            </span>
                            {active && <Check className="h-4 w-4 text-brand-primary flex-shrink-0" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Atalhos */}
            <div className="mb-3">
              <div className="bg-white rounded-2xl overflow-hidden mx-4">
                <ProfileRow icon={MessageSquare} label="Chat" strong last onClick={onOpenChat} />
              </div>
            </div>

            {/* Minha Área — grupo recolhível */}
            <ProfileGroup
              icon={LayoutDashboard}
              label="Minha Área"
              isOpen={openSection === 'minha-area'}
              onToggle={() => toggleSection('minha-area')}
            >
              <ProfileRow icon={Play}        label="Meus Treinamentos" />
              <ProfileRow icon={Compass}     label="Minhas Trilhas"    />
              <ProfileRow icon={Star}        label="Minhas Habilidades"/>
              <ProfileRow icon={Award}       label="Meus Certificados" />
              <ProfileRow icon={Calendar}    label="Meu Calendário"    />
              <ProfileRow icon={ShoppingBag} label="Minhas Compras" last onClick={() => { setActiveTab('Minhas Compras'); onClose(); }} />
            </ProfileGroup>

            {/* Conta */}
            <div className="bg-white rounded-2xl overflow-hidden mx-4 mb-3">
              <>
                <button
                  onClick={() => {
                    setIsPerfilOpen(v => !v);
                    setOpenSection(null);
                    setIsIdiomaOpen(false);
                    setIsPortalOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 min-h-[52px] active:bg-gray-100 transition-colors text-gray-900"
                >
                  <Users className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                  <span className="flex-1 text-left text-[15px] font-semibold">Selecionar perfil</span>
                  <motion.div animate={{ rotate: isPerfilOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isPerfilOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      {[
                        { id: 'aluno',         label: 'Aluno',          sub: 'Lector' },
                        { id: 'administrador', label: 'Administrador',  sub: 'Lector' },
                      ].map(({ id, label, sub }) => {
                        const active = perfilAtivo === id;
                        return (
                          <button
                            key={id}
                            onClick={() => { setPerfilAtivo(id); setIsPerfilOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 min-h-[50px] active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              active ? 'bg-brand-primary/10' : 'bg-gray-100'
                            }`}>
                              <User className={`h-4 w-4 ${active ? 'text-brand-primary' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className={`text-[15px] font-medium ${active ? 'text-brand-primary' : 'text-gray-800'}`}>
                                {label}
                              </div>
                              <div className="text-[12px] text-gray-400">{sub}</div>
                            </div>
                            {active && <Check className="h-4 w-4 text-brand-primary flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-px bg-gray-100 ml-[46px]" />
              </>
              <ProfileRow icon={Download}    label="Instalar app"   strong last />
            </div>

            {/* Suporte */}
            <div className="bg-white rounded-2xl overflow-hidden mx-4 mb-3">
              <ProfileRow icon={CheckCircle} label="Validar certificado" strong onClick={onOpenCertificado} />
              <ProfileRow icon={BookOpen}    label="Ver glossário"        strong last />
            </div>

            {/* Sair */}
            <div className="bg-white rounded-2xl overflow-hidden mx-4 mt-3 mb-6">
              <ProfileRow icon={LogOut} label="Sair" danger strong last />
            </div>

            <div className="h-8" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
