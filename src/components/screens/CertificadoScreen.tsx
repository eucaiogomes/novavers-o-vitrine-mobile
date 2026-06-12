import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ChevronRight, Check, AlertCircle, Download, Printer, Globe } from 'lucide-react';

const DEMO_CERTIFICADO = {
  nome: 'Caio Gomes',
  treinamento: 'Curso - Rotinas Suporte Lector',
  turma: 'Turma manhã - n°2',
  conclusao: '21/01/2026 10:24:30',
  detalhes: [
    { data: '21/01/2026 10:24:17', conteudo: 'Conteúdo programático', valor: '' },
    { data: '', conteudo: 'Aproveitamento', valor: 'Curso - Rotinas Suporte Lector  100,00%' },
  ],
};

export const CertificadoScreen = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [codigo, setCodigo] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('valid');

  useEffect(() => {
    if (!isOpen) { setCodigo(''); setStatus('valid'); }
  }, [isOpen]);

  const handleValidar = () => {
    if (!codigo.trim()) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus(codigo.trim().length >= 8 ? 'valid' : 'invalid');
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="certificado-screen"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed top-14 inset-x-0 bottom-0 z-[95] lg:hidden flex flex-col overflow-hidden"
          style={{ backgroundColor: '#F2F2F7' }}
        >
          <div className="relative flex h-11 flex-shrink-0 items-center justify-center border-b border-gray-200/70 bg-white/95 backdrop-blur">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-2 flex min-h-11 items-center gap-0.5 rounded-full px-2 text-[16px] font-medium text-brand-primary active:bg-brand-primary/10"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
              Voltar
            </button>
            <h2 className="text-[16px] font-semibold text-gray-950">Certificado</h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="pt-6 pb-2">
              <div className="mx-4 mb-5 rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Shield className="h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-[20px] font-semibold leading-tight text-gray-950">Validar certificado</h1>
                        <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                          Consulte a autenticidade pelo código e veja os dados principais do certificado.
                        </p>
                      </div>
                      {(status === 'valid' || status === 'idle') && (
                        <span className="mt-0.5 inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                          <Check className="h-3 w-3" strokeWidth={3} />
                          Válido
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: campo de código */}
              <div className="mb-5">
                <p className="text-[12px] font-semibold text-gray-500 px-4 mb-2 uppercase tracking-[0.08em]">Código do certificado</p>
                <div className="bg-white rounded-[24px] overflow-hidden mx-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                  <div className="flex items-center gap-3 px-4 min-h-[58px]">
                    <input
                      type="text"
                      value={codigo}
                      onChange={e => { setCodigo(e.target.value.toUpperCase()); setStatus('idle'); }}
                      placeholder="Ex: A1B2-C3D4-E5F6..."
                      maxLength={32}
                      className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder:text-gray-400 outline-none py-3"
                    />
                    {codigo ? (
                      <button
                        onPointerDown={e => e.preventDefault()}
                        onClick={() => { setCodigo(''); setStatus('valid'); }}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full active:bg-gray-100"
                        aria-label="Limpar código"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300">
                          <X className="h-3 w-3 text-white" />
                        </span>
                      </button>
                    ) : null}
                  </div>
                  <div className="h-px bg-gray-100 ml-4" />
                  <button
                    onClick={handleValidar}
                    disabled={!codigo.trim() || status === 'loading'}
                    className={`mx-3 mb-3 mt-1 flex min-h-[48px] w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-2xl px-4 text-white transition-colors active:bg-brand-primary/90 ${status === 'loading' ? 'bg-brand-primary shadow-[0_10px_22px_rgba(255,107,0,0.24)]' : 'bg-brand-primary shadow-[0_10px_22px_rgba(255,107,0,0.24)] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none'}`}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }} className="h-[18px] w-[18px] flex-shrink-0 rounded-full border-2 border-white/45 border-t-white" />
                        <span className="text-[15px] font-semibold">Verificando...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-[18px] w-[18px] flex-shrink-0" />
                        <span className="text-[15px] font-semibold">Verificar autenticidade</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[12px] text-gray-400 px-4 mt-1.5">{codigo.length}/32 caracteres</p>
              </div>

              {/* Resultado — sempre visível em demo */}
              <AnimatePresence>
                {(status === 'valid' || status === 'idle') && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                    className="mb-5"
                  >
                    {/* Cabeçalho da seção com badge válido */}
                    <div className="flex items-center justify-between px-4 mb-2">
                      <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-[0.08em]">Informações do certificado</p>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-100">
                        <Check className="h-3 w-3" strokeWidth={3} /> Válido
                      </span>
                    </div>

                    {/* Card principal */}
                    <div className="bg-white rounded-[24px] overflow-hidden mx-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                      {[
                        { label: 'Usuário',            value: DEMO_CERTIFICADO.nome        },
                        { label: 'Treinamento',        value: DEMO_CERTIFICADO.treinamento },
                        { label: 'Turma',              value: DEMO_CERTIFICADO.turma       },
                        { label: 'Data de conclusão',  value: DEMO_CERTIFICADO.conclusao   },
                      ].map(({ label, value }, i, arr) => (
                        <div key={label} className={`flex items-start gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <span className="text-[13px] text-gray-400 w-32 flex-shrink-0 pt-px">{label}</span>
                          <span className="text-[13px] font-medium text-gray-800 flex-1 text-right">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Detalhes */}
                    <p className="text-[12px] font-semibold text-gray-500 px-4 mt-5 mb-2 uppercase tracking-[0.08em]">Detalhes</p>
                    <div className="bg-white rounded-[24px] overflow-hidden mx-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                      <div className="px-4 py-3.5 border-b border-gray-100">
                        <div className="flex gap-3 items-start">
                          <span className="text-[13px] text-gray-400 w-32 flex-shrink-0">Data</span>
                          <span className="text-[13px] font-medium text-gray-800 flex-1 text-right">21/01/2026 10:24:17</span>
                        </div>
                        <div className="flex gap-3 items-start mt-2">
                          <span className="text-[13px] text-gray-400 w-32 flex-shrink-0">Conteúdo</span>
                          <span className="text-[13px] font-medium text-gray-800 flex-1 text-right">Conteúdo programático</span>
                        </div>
                      </div>
                      <div className="px-4 py-3.5">
                        <div className="flex gap-3 items-start">
                          <span className="text-[13px] text-gray-400 w-32 flex-shrink-0">Aproveitamento</span>
                          <span className="text-[13px] font-semibold text-emerald-600 flex-1 text-right">100,00%</span>
                        </div>
                        <div className="flex gap-3 items-start mt-1">
                          <span className="text-[13px] text-gray-400 w-32 flex-shrink-0"></span>
                          <span className="text-[12px] text-gray-400 flex-1 text-right">{DEMO_CERTIFICADO.treinamento}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações: Salvar / Imprimir */}
                    <div className="bg-white rounded-[24px] overflow-hidden mx-4 mt-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                      <button className="w-full flex items-center gap-3 px-4 min-h-[56px] active:bg-gray-50 transition-colors border-b border-gray-100">
                        <Download className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                        <span className="flex-1 text-left text-[15px] text-gray-900">Salvar certificado</span>
                        <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 min-h-[56px] active:bg-gray-50 transition-colors">
                        <Printer className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                        <span className="flex-1 text-left text-[15px] text-gray-900">Imprimir certificado</span>
                        <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7C7CC' }} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {status === 'invalid' && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                    className="mb-5"
                  >
                    <p className="text-[12px] font-semibold text-gray-500 px-4 mb-2 uppercase tracking-[0.08em]">Resultado</p>
                    <div className="bg-white rounded-[24px] overflow-hidden mx-4 shadow-[0_12px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.03]">
                      <div className="flex items-center gap-3 px-4 min-h-[64px]">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-red-500" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-red-500">Código não encontrado</p>
                          <p className="text-[12px] text-gray-400">Verifique o código e tente novamente</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rodapé azul — igual à vitrine */}
            <footer className="text-white px-6 py-8 mt-2" style={{ background: 'linear-gradient(180deg, #041433 0%, #08204D 100%)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#041433] font-bold text-sm flex-shrink-0">L</div>
                <span className="font-bold text-base tracking-wider">LECTOR</span>
              </div>
              <p className="text-gray-400 text-[12px] leading-relaxed mb-6">
                Transformando o aprendizado através da tecnologia e inovação.
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-[11px] text-gray-500">© Lector Tecnologia, 2006 – 2025. Todos os direitos reservados.</p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1.5">
                  <Globe className="h-3 w-3" /> Português (Brasil)
                </p>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
