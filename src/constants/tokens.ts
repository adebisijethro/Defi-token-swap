export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    mockUsdPrice: number;
    color: string; // Tailwind class or hex for icon background
    icon?: string; // URL or path to icon
    // Cardano-specific optional fields for native assets
    policyId?: string;
    assetName?: string; // hex or ascii name for native asset
}

export const TOKENS: Token[] = [
    {
        symbol: 'ADA',
        name: 'Cardano',
        decimals: 6,
        mockUsdPrice: 0.35,
        color: 'bg-sky-500',
        icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860',
    },
    {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        mockUsdPrice: 1,
        color: 'bg-emerald-500',
        icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1598529401',
        policyId: '00000000000000000000000000000000000000000000000000000000',
        assetName: '555344', // 'USD' hex
    },
];

export const getTokenBySymbol = (symbol: string): Token | undefined => {
    return TOKENS.find((t) => t.symbol === symbol);
};
