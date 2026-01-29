# Smart Consortium Calculators

![Smart Consortium Cover](webapp/public/mobile-splash.jpg)

Este repositório contém um conjunto de ferramentas web desenvolvidas para simular e demonstrar estratégias financeiras avançadas utilizando o produto Consórcio. A aplicação é composta por dois módulos principais: **Quita Smart** e **Invest Smart**.

A aplicação foi modernizada para **React (Vite)** e utiliza **Capacitor** para deploy nativo no iOS.

| Plataforma | Status |
| :--- | :--- |
| **Web** | Deployed (Firebase) |
| **iOS** | Native (Capacitor) |

## Módulos

### 1. Quita Smart 🏠
O **Quita Smart** é uma calculadora destinada a comparar e projetar a quitação de financiamentos imobiliários utilizando cartas de consórcio.
*   **Comparativo "Lado a Lado":** Fluxo de pagamento Financiamento vs. Consórcio.
*   **Gráficos dinâmicos:** Evolução do Saldo Devedor.

### 2. Invest Smart 📈
O **Invest Smart** é um simulador de alavancagem financeira ("Consórcio Contemplado"), focado em comparar a rentabilidade do consórcio contra investimentos tradicionais (CDB, Poupança).

## Tecnologias Utilizadas

*   **Frontend:** React 19, Vite, TypeScript.
*   **Estilização:** Tailwind CSS v4.
*   **Mobile:** Capacitor v7 (iOS).
*   **Backend/Hosting:** Firebase Hosting & Authentication.
*   **Charts:** Chart.js + react-chartjs-2.

## Estrutura do Projeto

*   `webapp/`: Código fonte da aplicação React.
*   `webapp/ios/`: Projeto nativo iOS (Xcode).
*   `webapp/dist/`: Build de produção para web.

## Como Executar

### Pré-requisitos
*   Node.js 18+
*   CocoaPods (para iOS)

### Instalação
```bash
cd webapp
npm install
```

### Desenvolvimento Web
```bash
npm run dev
```

### Build e Deploy
1.  **Build Web:**
    ```bash
    npm run build
    ```
2.  **Sincronizar iOS:**
    ```bash
    npx cap sync ios
    ```
3.  **Deploy Firebase:**
    ```bash
    npx firebase deploy
    ```

### Compilar para iOS
Abra o projeto no Xcode:
```bash
npx cap open ios
```
*   **Nota:** O projeto segue estritamente os padrões **iOS 26+**.

---

*Desenvolvido para auxiliar na consultoria e venda técnica de produtos financeiros.*
