# Projeto Mari - Cesta Básica

Aplicativo mobile para doação e solicitação de cestas básicas, desenvolvido com React Native (Expo) e Firebase.

## Funcionalidades

- **Autenticação**: Login e cadastro com email/senha via Firebase Auth
- **Fazer Doação**: Cadastro de doações com categorias (Cesta básica, Alimentos, Higiene, Limpeza, Outros), endereço via GPS e opção de entrega
- **Pedir Doação**: Visualização e solicitação de doações disponíveis
- **Painel Administrativo**: Aprovação/recusa de doações e pedidos, histórico, estatísticas e gráfico por categoria
- **Perfil**: Edição de email e alternância entre tema claro/escuro
- **Tema Noturno**: Suporte completo a light/dark mode

## Tecnologias

- **React Native** 0.81.5 / **Expo** ~54
- **Firebase** (Authentication + Firestore)
- **React Navigation** (Drawer + Stack)
- **expo-location** (GPS e geocodificação reversa)
- **react-native-reanimated** (animações)

## Estrutura

```
├── screen/           # Telas do aplicativo
│   ├── login.js      # Login e cadastro
│   ├── home.js       # Tela inicial
│   ├── Fazerdoacao.js
│   ├── Pedirdoacao.js
│   ├── adm.js        # Painel admin
│   └── Perfil.js     # Perfil do usuário
├── App.js            # Navegação principal
├── AuthContext.js    # Contexto de autenticação
├── DoacoesContext.js # Contexto de doações
├── TemaContext.js    # Contexto de tema
└── firebaseConfig.js # Configuração do Firebase
```

## Como executar

```bash
npm install
npm start
# ou
npm run android
npm run web
```

## Build

```bash
eas build --platform android --profile preview   # APK
eas build --platform android --profile production
```
