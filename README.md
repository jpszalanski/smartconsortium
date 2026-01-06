# Smart Consortium Calculators

Este repositório contém um conjunto de ferramentas web desenvolvidas para simular e demonstrar estratégias financeiras avançadas utilizando o produto Consórcio. A aplicação é composta por dois módulos principais: **Quita Smart** e **Invest Smart**.

## Módulos

### 1. Quita Smart 🏠
O **Quita Smart** é uma calculadora destinada a comparar e projetar a quitação de financiamentos imobiliários utilizando cartas de consórcio.

*   **Objetivo:** Demonstrar a economia gerada ao substituir os juros compostos de um financiamento imobiliário (SAC) pela taxa de administração fixa do consórcio.
*   **Funcionalidades:**
    *   Simulação para financiamentos **Novos** ou **Em Andamento** (calculando saldo devedor futuro).
    *   Cálculo automático do valor da carta necessária (com projeção de INCC até a contemplação).
    *   Comparativo "Lado a Lado": Fluxo de pagamento Financiamento vs. Consórcio.
    *   Gráficos dinâmicos de Evolução do Saldo Devedor e Compromisso Mensal.

### 2. Invest Smart 📈
O **Invest Smart** é um simulador de alavancagem financeira ("Consórcio Contemplado"), focado em comparar a rentabilidade do consórcio contra investimentos tradicionais.

*   **Objetivo:** Evidenciar o **Fator de Alavancagem**, onde o rendimento no consórcio (via Fundo Master) incide sobre o valor integral da carta de crédito (capital do banco), enquanto investimentos tradicionais rendem apenas sobre o capital próprio acumulado.
*   **Funcionalidades:**
    *   Comparativo direto contra **CDB**, **Fundo DI** e **Poupança**.
    *   Integração com API do Banco Central para obter taxas CDI e Poupança atuais.
    *   Cálculo de Imposto de Renda regressivo automático.
    *   Destaques visuais de "Ganho vs Benchmark" (ex: "35% maior que o CDB").

## Tecnologias Utilizadas

*   **HTML5 & CSS3:** Estrutura e layout responsivo.
*   **Tailwind CSS:** Estilização moderna com suporte a *Dark Mode* e componentes *Glassmorphism*.
*   **Alpine.js:** Framework JavaScript leve para reatividade e manipulação de estado em tempo real.
*   **Chart.js:** Renderização de gráficos interativos e comparativos.
*   **API BCB:** Consumo de dados reais para taxas de mercado (SGS - Sistema Gerenciador de Séries Temporais).

## Como Executar

O projeto é uma aplicação *client-side* pura (apenas index.html).

1.  Clone o repositório:
    ```bash
    git clone https://github.com/jpszalanski/smartconsortium.git
    ```
2.  Abra o arquivo `index.html` em qualquer navegador moderno.

---

*Desenvolvido para auxiliar na consultoria e venda técnica de produtos financeiros.*
