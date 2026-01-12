import React, { useEffect, useState, Component } from 'react';
import { Settings, ChevronDown, ArrowDown, Wallet, Info } from 'lucide-react';
// --- Types ---
type Token = {
  symbol: string;
  name: string;
  balance: string;
  iconColor: string;
};
type SwapState = 'connect' | 'insufficient' | 'swap';
// --- Mock Data ---
const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '1.45',
    iconColor: 'bg-blue-500'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '2450.00',
    iconColor: 'bg-indigo-500'
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    balance: '145.20',
    iconColor: 'bg-purple-500'
  }
};
// --- Sub-Components ---
const TokenIcon = ({
  color
}: {
  color: string;
}) => <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center mr-2 shadow-sm`}>
    <div className="w-3 h-3 bg-white/20 rounded-full" />
  </div>;
const TokenSelector = ({
  token,
  onClick
}: {
  token: Token;
  onClick?: () => void;
}) => {
  return <button onClick={onClick} className="flex items-center bg-slate-800 hover:bg-slate-700 text-white pl-2 pr-3 py-1.5 rounded-full transition-colors duration-200 border border-slate-700 hover:border-slate-600 group">
      <TokenIcon color={token.iconColor} />
      <span className="font-semibold text-lg mr-1">{token.symbol}</span>
      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
    </button>;
};
interface SwapInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  token: Token;
  usdValue?: string;
  readOnly?: boolean;
}
const SwapInput = ({
  label,
  value,
  onChange,
  token,
  usdValue,
  readOnly
}: SwapInputProps) => {
  return <div className="bg-slate-900/50 hover:bg-slate-900/70 transition-colors rounded-2xl p-4 border border-slate-800/50 focus-within:border-slate-700/80 focus-within:ring-1 focus-within:ring-slate-700/50">
      <div className="flex justify-between mb-1">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
      </div>

      <div className="flex justify-between items-center gap-4">
        <input type="text" inputMode="decimal" placeholder="0" value={value} onChange={e => {
        // Only allow numbers and one decimal point
        if (/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
          onChange(e.target.value);
        }
      }} readOnly={readOnly} className="bg-transparent text-4xl font-semibold text-white placeholder-slate-600 outline-none w-full min-w-0 font-sans" />
        <TokenSelector token={token} />
      </div>

      <div className="flex justify-between mt-2 h-6">
        <span className="text-slate-500 text-sm">
          {usdValue ? `$${usdValue}` : ''}
        </span>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Balance: {token.balance}</span>
          {label === 'Pay' && <button onClick={() => onChange(token.balance)} className="text-blue-400 hover:text-blue-300 font-medium text-xs uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
              Max
            </button>}
        </div>
      </div>
    </div>;
};
const SwapButton = ({
  state,
  onClick
}: {
  state: SwapState;
  onClick: () => void;
}) => {
  const styles = {
    connect: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20',
    insufficient: 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700',
    swap: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 border border-blue-500/50'
  };
  const labels = {
    connect: 'Connect Wallet',
    insufficient: 'Insufficient Balance',
    swap: 'Swap'
  };
  return <button onClick={onClick} disabled={state === 'insufficient'} className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform active:scale-[0.99] ${styles[state]}`}>
      {state === 'connect' && <Wallet className="inline-block w-5 h-5 mr-2 -mt-1" />}
      {labels[state]}
    </button>;
};
const SlippageSettings = ({
  isOpen,
  value,
  onChange
}: {
  isOpen: boolean;
  value: number;
  onChange: (val: number) => void;
}) => {
  if (!isOpen) return null;
  return <div className="absolute top-14 right-4 z-20 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl w-64 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-sm text-slate-400 mb-3 font-medium">
        Max Slippage
      </div>
      <div className="flex gap-2">
        {[0.1, 0.5, 1.0].map(opt => <button key={opt} onClick={() => onChange(opt)} className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${value === opt ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            {opt}%
          </button>)}
        <div className="flex items-center bg-slate-700 rounded-lg px-3 min-w-[60px]">
          <span className="text-slate-300 text-sm font-medium">{value}%</span>
        </div>
      </div>
    </div>;
};
// --- Main Component ---
export function SwapWidget() {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [slippageOpen, setSlippageOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  // Mock conversion rate
  const RATE = 2450.5; // ETH to USDC
  useEffect(() => {
    if (!payAmount) {
      setReceiveAmount('');
      return;
    }
    const val = parseFloat(payAmount);
    if (!isNaN(val)) {
      setReceiveAmount((val * RATE).toFixed(2));
    }
  }, [payAmount]);
  const handleSwap = () => {
    // Swap logic would go here
    setPayAmount('');
    setReceiveAmount('');
  };
  const handleConnect = () => {
    setIsWalletConnected(true);
  };
  // Determine button state
  let buttonState: SwapState = 'connect';
  if (isWalletConnected) {
    if (!payAmount || parseFloat(payAmount) === 0) {
      buttonState = 'insufficient'; // Or 'enter amount' ideally, but using requested states
    } else if (parseFloat(payAmount) > parseFloat(TOKENS.ETH.balance)) {
      buttonState = 'insufficient';
    } else {
      buttonState = 'swap';
    }
  }
  return <div className="relative w-full max-w-[480px] mx-auto">
      {/* Main Card */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-4 shadow-2xl shadow-black/40 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex gap-4 text-slate-400 font-medium">
            <button className="text-white">Swap</button>
            <button className="hover:text-white transition-colors">
              Limit
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setSlippageOpen(!slippageOpen)} className={`p-2 rounded-full transition-colors ${slippageOpen ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <Settings className="w-5 h-5" />
            </button>
            <SlippageSettings isOpen={slippageOpen} value={slippage} onChange={setSlippage} />
          </div>
        </div>

        {/* Inputs Container */}
        <div className="relative flex flex-col gap-1">
          <SwapInput label="Pay" value={payAmount} onChange={setPayAmount} token={TOKENS.ETH} usdValue={payAmount ? (parseFloat(payAmount) * 2450).toFixed(2) : undefined} />

          {/* Arrow Switcher */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button className="bg-slate-900 border-[4px] border-slate-950 rounded-xl p-2 text-slate-400 hover:text-blue-400 hover:scale-110 transition-all duration-200 shadow-lg">
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          <SwapInput label="Receive" value={receiveAmount} onChange={() => {}} token={TOKENS.USDC} usdValue={receiveAmount} readOnly />
        </div>

        {/* Price Info (Accordion-style placeholder) */}
        {payAmount && <div className="flex justify-between items-center px-4 py-3 mt-2 text-xs font-medium text-slate-400 bg-slate-900/30 rounded-xl border border-slate-800/30">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>1 ETH = {RATE} USDC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                $6.45 gas
              </span>
            </div>
          </div>}

        {/* Action Button */}
        <div className="mt-4">
          <SwapButton state={buttonState} onClick={isWalletConnected ? handleSwap : handleConnect} />
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>;
}