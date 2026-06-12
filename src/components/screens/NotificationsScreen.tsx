import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, CheckCircle, Calendar, Award } from 'lucide-react';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  unread?: boolean;
  tone: 'primary' | 'amber' | 'emerald' | 'blue';
};

export const PROFILE_NOTIFICATION_COUNT = 3;

const PROFILE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Novo treinamento disponível',
    description: 'ChatGPT para Produtividade no Trabalho foi adicionado à sua vitrine.',
    time: 'Agora',
    icon: Play,
    unread: true,
    tone: 'primary',
  },
  {
    id: 'n2',
    title: 'Certificado validado',
    description: 'Seu certificado de Rotinas Suporte Lector já pode ser consultado.',
    time: '12 min',
    icon: CheckCircle,
    unread: true,
    tone: 'emerald',
  },
  {
    id: 'n3',
    title: 'Lembrete de calendário',
    description: 'Você tem um treinamento agendado para amanhã às 14h.',
    time: '1 h',
    icon: Calendar,
    unread: true,
    tone: 'blue',
  },
  {
    id: 'n4',
    title: 'Nova conquista',
    description: 'Você ganhou pontos por concluir uma trilha de aprendizagem.',
    time: 'Ontem',
    icon: Award,
    tone: 'amber',
  },
];

const notificationToneClasses = (tone: NotificationItem['tone']) => {
  switch (tone) {
    case 'amber':
      return 'bg-amber-50 text-amber-500';
    case 'emerald':
      return 'bg-emerald-50 text-emerald-600';
    case 'blue':
      return 'bg-blue-50 text-blue-600';
    default:
      return 'bg-brand-primary/10 text-brand-primary';
  }
};

export const NotificationsScreen = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const swipeStartX = useRef(0);

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
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientX - swipeStartX.current > 60) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="notifications-screen"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed top-14 inset-x-0 bottom-0 z-[95] lg:hidden flex flex-col overflow-hidden"
          style={{ backgroundColor: '#F2F2F7' }}
        >
          <div className="flex-shrink-0 relative flex items-center justify-center h-11 bg-white border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute left-2 flex items-center gap-0.5 px-2 h-full text-brand-primary"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[17px]">Voltar</span>
            </button>
            <span className="text-[17px] font-semibold text-gray-900">Notificações</span>
          </div>

          <div className="flex-1 overflow-y-auto pt-6 pb-8">
            {[
              { grupo: 'Hoje',       itens: PROFILE_NOTIFICATIONS.filter(n => n.unread)  },
              { grupo: 'Anteriores', itens: PROFILE_NOTIFICATIONS.filter(n => !n.unread) },
            ].filter(({ itens }) => itens.length > 0).map(({ grupo, itens }) => (
              <div key={grupo} className="mb-6">
                <p className="text-[13px] text-gray-500 font-normal px-4 mb-1 uppercase tracking-wide">{grupo}</p>
                <div className="bg-white rounded-2xl overflow-hidden mx-4">
                  {itens.map(({ id, title, description, time, icon: Icon, unread, tone }, i, arr) => (
                    <React.Fragment key={id}>
                      <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left active:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notificationToneClasses(tone)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p className={`text-[15px] leading-snug flex-1 text-gray-900 ${unread ? 'font-semibold' : 'font-medium'}`}>{title}</p>
                            <span className="text-[12px] text-gray-400 whitespace-nowrap pt-0.5">{time}</span>
                          </div>
                          <p className="text-[13px] text-gray-500 leading-snug mt-0.5">{description}</p>
                        </div>
                        <div className="pt-1.5 flex flex-col items-end gap-2 flex-shrink-0">
                          {unread
                            ? <span className="w-2 h-2 rounded-full bg-brand-primary" />
                            : <span className="w-2 h-2" />}
                          <ChevronRight className="h-4 w-4" style={{ color: '#C7C7CC' }} />
                        </div>
                      </button>
                      {i < arr.length - 1 && <div className="h-px bg-gray-100 ml-[68px]" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
