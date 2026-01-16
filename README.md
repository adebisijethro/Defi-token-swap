# Cardano Token Swap Widget

A modern, responsive React-based token swap widget designed for the Cardano ecosystem. This project demonstrates a clean UI for swapping ADA and Cardano native tokens (DJED, MIN, AGIX, etc.), with integration support for Cardano wallets and DEX protocols.

> [!NOTE]
> **Simulation Mode**: The current implementation simulates token price quotes (mock ADA and Cardano native tokens) and does not execute real transactions on any blockchain. It serves as a UI/UX demonstration and frontend template.

## Features

- **Cardano Wallet Integration**: Ready for integration with [Nami](https://namiwallet.io/), [Eternl](https://eternl.io/), [Flint](https://flint.cx/), and other Cardano browser wallets.
- **ADA & Native Tokens**: Built-in support for swapping ADA with Cardano native tokens (DJED, MIN, AGIX, etc.).
- **Token Swap UI**: Intuitive interface for inputting "Pay" and "Receive" amounts with real-time quote simulation.
- **Responsive Design**: Built with Tailwind CSS for a fully responsive experience on desktop and mobile.
- **Dark Mode**: Features a sleek dark mode with ambient background effects optimized for DeFi interfaces.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Cardano Integration**:
    - [Lucid](https://dappio.github.io/lucid/): TypeScript library for Cardano wallet interaction and transaction building.
    - [Blockfrost](https://blockfrost.io/): REST API for Cardano blockchain data and transaction submission.
    - [Nami](https://namiwallet.io/) / [Eternl](https://eternl.io/) / [Flint](https://flint.cx/): Popular Cardano browser wallets.
    - [Minswap](https://minswap.org/) / [SundaeSwap](https://sundaeswap.finance/): Cardano DEX protocols for swap quotes and execution.
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React `useState` & `useEffect`.

## Supported Tokens

The widget supports swapping the following Cardano tokens (with mock prices for demo):

| Token  | Name             | Decimals | Mock Price | Network |
|--------|------------------|----------|------------|---------|
| ADA    | Cardano          | 6        | $0.35      | Mainnet |
| DJED   | Djed Stablecoin  | 6        | $1.00      | Mainnet |
| MIN    | MIN Finance      | 6        | $0.12      | Mainnet |
| AGIX   | SingularityNET   | 6        | $0.08      | Mainnet |

*Mock prices are used for UI simulation only. Replace with real oracle data (e.g., from CoinGecko or DEX protocols) in production.*

## Project Structure

```
src/
├── components/
│   └── SwapWidget.tsx    # Main widget component handling UI and swap logic
├── hooks/
│   └── useTokenQuote.ts  # Custom hook for fetching (simulated) token quotes
├── constants/
│   └── tokens.ts         # Cardano token definitions with policyId and assetName
├── App.tsx               # Main application layout with ambient background
├── Providers.tsx         # Web3 and Query providers setup
└── main.tsx              # Entry point
```

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment** (optional)
    ```bash
    # For Blockfrost integration, add to .env.local:
    VITE_BLOCKFROST_API_KEY=your_api_key_here
    VITE_BLOCKFROST_NETWORK=mainnet  # or preprod/preview
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## Next Steps for Production

To deploy this widget on the Cardano network, you'll need to:

1. **Replace Wallet Provider**: Swap the Ethereum-focused RainbowKit/Wagmi setup with Cardano wallet connectors (Nami/Eternl).
2. **Integrate Lucid**: Use [Lucid](https://dappio.github.io/lucid/) to build and submit transactions to Cardano.
3. **Add DEX Integration**: Connect to Cardano DEXes (Minswap, SundaeSwap) for real swap quotes and liquidity.
4. **Implement Oracle Pricing**: Fetch real token prices from Blockfrost or CoinGecko API.
5. **Handle UTXOs**: Implement UTXO selection and management for Cardano transactions.

## Resources

- [Cardano Developer Portal](https://developers.cardano.org/)
- [Lucid Documentation](https://dappio.github.io/lucid/)
- [Blockfrost API Docs](https://docs.blockfrost.io/)
- [CIP Standards](https://cips.cardano.org/) - Cardano Improvement Proposals
