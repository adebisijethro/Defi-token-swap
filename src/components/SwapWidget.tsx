import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useCardanoWallet } from '../Providers';
import { useTokenQuote, TradeType } from '../hooks/useTokenQuote';
import { TOKENS, Token, getTokenBySymbol } from '../constants/tokens';

export const SwapWidget = () => {
  const { wallet, connectWallet, disconnectWallet } = useCardanoWallet();
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState('ADA');
  const [buyToken, setBuyToken] = useState('USDT');
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'sell' | 'buy' | null>(null);

  const { quoteAmount, loading, error } = useTokenQuote({
    tokenIn: sellToken,
    tokenOut: buyToken,
    amount: sellAmount,
    tradeType: TradeType.EXACT_INPUT,
  });

  const buyAmount = quoteAmount || '';

  const switchTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount(buyAmount);
  };

  const handleTokenSelect = (token: Token) => {
    if (selectingFor === 'sell') {
      if (token.symbol === buyToken) {
        setBuyToken(sellToken);
      }
      setSellToken(token.symbol);
    } else if (selectingFor === 'buy') {
      if (token.symbol === sellToken) {
        setSellToken(buyToken);
      }
      setBuyToken(token.symbol);
    }
    setSelectingFor(null);
  };

  const currentSellToken = getTokenBySymbol(sellToken);
  const currentBuyToken = getTokenBySymbol(buyToken);

  // Calculate exchange rate
  const exchangeRate = currentSellToken && currentBuyToken && parseFloat(sellAmount) > 0
    ? (currentSellToken.mockUsdPrice / currentBuyToken.mockUsdPrice).toFixed(5)
    : '0';

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 relative">
        
        {/* Close Button - positioned absolutely at top */}
        <button className="absolute -top-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Pay & Receive</h2>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            Crypto
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Pay Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-500 font-medium text-sm">You'll pay</label>
            <span className="text-gray-500 text-sm">Balance: 0.00</span>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-5">
            <div className="flex gap-3 items-start">
              <div className="flex-1 pt-1">
                <input
                  type="text"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="0"
                  className="w-full text-5xl font-bold text-gray-400 bg-transparent outline-none placeholder-gray-400"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectingFor('sell')}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-colors border border-gray-200 whitespace-nowrap"
                >
                  {currentSellToken?.icon ? (
                    <img src={currentSellToken.icon} alt={sellToken} className="w-6 h-6 rounded-full" />
                  ) : (
                    <span className={`w-6 h-6 rounded-full ${currentSellToken?.color}`}></span>
                  )}
                  <span className="font-semibold text-gray-900">{sellToken}</span>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
                <button className="text-gray-600 text-xs font-medium px-3 py-1 hover:text-gray-900">
                  MAX
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={switchTokens}
            className="p-3 bg-white border-4 border-gray-200 rounded-full hover:border-gray-300 transition-all text-gray-900 hover:bg-gray-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </button>
        </div>

        {/* Receive Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-500 font-medium text-sm">You'll receive</label>
            <span className="text-gray-500 text-sm">Balance: 0.00</span>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-5">
            <div className="flex gap-3 items-start">
              <div className="flex-1 pt-1">
                <input
                  type="text"
                  value={buyAmount}
                  readOnly
                  placeholder="0"
                  className="w-full text-5xl font-bold text-blue-500 bg-transparent outline-none placeholder-gray-400"
                />
              </div>
              
              <button
                onClick={() => setSelectingFor('buy')}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-colors border border-gray-200 whitespace-nowrap"
              >
                {currentBuyToken?.icon ? (
                  <img src={currentBuyToken.icon} alt={buyToken} className="w-6 h-6 rounded-full" />
                ) : (
                  <span className={`w-6 h-6 rounded-full ${currentBuyToken?.color}`}></span>
                )}
                <span className="font-semibold text-gray-900">{buyToken}</span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        {sellAmount && !loading && !error && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                i
              </div>
              <span className="text-gray-700 text-sm">
                1 {sellToken} = {exchangeRate} {buyToken}
              </span>
            </div>
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <span className="text-sm font-medium">Show details</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Status Messages */}
        {loading && (
          <div className="mb-8 p-4 bg-blue-50 rounded-xl">
            <span className="text-blue-700 text-sm font-medium">Fetching best price...</span>
          </div>
        )}
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-xl">
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Swap Now Button */}
        <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-gray-900 font-bold py-4 rounded-full hover:shadow-lg transition-all text-lg mb-4">
          Swap Now
        </button>

        {/* Wallet Connection Section */}
        {!wallet.connected ? (
          <button
            onClick={() => setShowWalletMenu(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-full transition-colors"
          >
            Connect Cardano Wallet
          </button>
        ) : (
          <div className="p-3 bg-green-50 rounded-full border border-green-200 flex items-center justify-between">
            <span className="text-green-700 text-sm font-medium">
              📍 {wallet.address?.slice(0, 10)}...{wallet.address?.slice(-8)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Token Selection Modal */}
      {selectingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Select Token</h3>
              <button
                onClick={() => setSelectingFor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              {TOKENS.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-2xl transition-colors text-left group mb-2"
                >
                  {token.icon ? (
                    <img src={token.icon} alt={token.symbol} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${token.color} text-white font-bold text-sm`}>
                      {token.symbol[0]}
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="text-gray-900 font-semibold">{token.name}</div>
                    <div className="text-gray-500 text-sm">{token.symbol}</div>
                  </div>
                  {((selectingFor === 'sell' && sellToken === token.symbol) ||
                    (selectingFor === 'buy' && buyToken === token.symbol)) && (
                      <div className="text-blue-500 font-semibold">✓</div>
                    )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wallet Selection Modal */}
      {showWalletMenu && !wallet.connected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Connect Wallet</h3>
              <button
                onClick={() => setShowWalletMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto p-4">
              {['Nami', 'Eternl', 'Flint'].map((walletName) => (
                <button
                  key={walletName}
                  onClick={async () => {
                    await connectWallet(walletName);
                    setShowWalletMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-2xl transition-colors text-left mb-2"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {walletName[0]}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">{walletName}</div>
                    <div className="text-gray-500 text-sm">Cardano Wallet</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};