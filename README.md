# Vitrine Lector — Mobile

Vitrine de conteúdos da Lector Tecnologia (treinamentos, trilhas e certificados), com experiência mobile estilo iOS: menu de perfil, chat, notificações, validação de certificado e navegação por vitrines.

## Stack

- React 19 + TypeScript + Vite
- TailwindCSS 4
- Motion (Framer Motion) para animações
- TanStack Router (SPA)
- Lucide React (ícones)

## Rodando localmente

```bash
npm install
npm run dev
```

O app sobe em `http://localhost:3000`.

## Build

```bash
npm run build    # gera o build de produção em dist/
npm run preview  # serve o build localmente
```

## Estrutura

```
src/
├── App.tsx                      # Vitrine principal (Topbar, Sidebar, views)
├── components/
│   ├── screens/                 # Telas mobile full-screen (estilo iOS)
│   │   ├── ProfileScreen.tsx    # Menu de perfil (portais, idioma, perfil)
│   │   ├── ChatScreen.tsx       # Chat (conversas + mensagens)
│   │   ├── NotificationsScreen.tsx
│   │   └── CertificadoScreen.tsx
│   └── training/                # Telas de treinamento e trilha
├── pages/                       # Páginas roteadas (TanStack Router)
├── data/                        # Catálogo de conteúdos
├── router.tsx                   # Definição de rotas
└── assets/                      # Imagens e logo
```

## Deploy na Vercel

O projeto já vem configurado ([vercel.json](vercel.json)):

1. Suba o repositório para o GitHub
2. Importe o repositório na Vercel — ela detecta Vite automaticamente
3. Build command `npm run build`, output `dist/` (já configurados)

As rotas da SPA (`/trilha`, `/treinamento/:id` etc.) são reescritas para `index.html` automaticamente.
