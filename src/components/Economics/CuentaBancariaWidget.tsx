import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, CreditCard as StripeIcon, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CuentaBancariaWidgetProps {
  balances: {
    bank: number;
    stripe: number;
    cash: number;
  };
  isEditMode: boolean;
  onUpdate: (accountType: string, value: number) => void;
  onRemove: () => void;
}

type AccountType = 'bank' | 'stripe' | 'cash';

const ACCOUNT_TYPES: Record<AccountType, {
  label: string;
  icon: React.FC<{ className?: string }>;
}> = {
  bank: {
    label: 'Cuenta Bancaria',
    icon: CreditCard,
  },
  stripe: {
    label: 'Cuenta Stripe',
    icon: StripeIcon,
  },
  cash: {
    label: 'Efectivo',
    icon: Wallet,
  },
};

const CuentaBancariaWidget: React.FC<CuentaBancariaWidgetProps> = ({
  balances,
  isEditMode,
  onUpdate,
  onRemove,
}) => {
  const { theme } = useTheme();
  const [accountType, setAccountType] = useState<AccountType>('bank');
  const [inputValue, setInputValue] = useState(balances[accountType].toString());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setInputValue(balances[accountType].toString());
  }, [balances, accountType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onUpdate(accountType, numericValue);
    }
  };

  const baseClasses = {
    container: `relative p-6 h-full flex flex-col justify-between rounded-xl shadow-lg transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800'
    }`,
    removeButton: `absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 ${
      isDark
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
        : 'bg-white hover:bg-red-50 text-gray-500 hover:text-red-500'
    } shadow-md hover:shadow-lg`,
    header: `flex items-center justify-between mb-4`,
    accountSelector: `relative flex items-center gap-2 cursor-pointer select-none`,
    title: `text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`,
    iconContainer: `${
      isDark ? 'bg-gray-700' : 'bg-white'
    } p-2.5 rounded-full shadow-md`,
    icon: `w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-500'}`,
    amount: `text-3xl font-bold tracking-tight ${
      isDark ? 'text-gray-100' : 'text-gray-900'
    }`,
    input: `w-full text-2xl font-bold rounded-lg p-2 transition-all duration-200 ${
      isDark
        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
        : 'bg-white text-gray-900 border-blue-200 focus:border-blue-400'
    } border focus:ring-2 focus:ring-blue-500/20`,
    label: `text-xs font-medium ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    } mt-2`,
    dropdown: `absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-10 ${
      isDark
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    }`,
    dropdownItem: `flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 ${
      isDark
        ? 'hover:bg-gray-700 text-gray-200'
        : 'hover:bg-gray-50 text-gray-700'
    }`,
  };

  const CurrentIcon = ACCOUNT_TYPES[accountType].icon;

  return (
    <div className={baseClasses.container}>
      <div className={baseClasses.header}>
        <div className="relative">
          <div
            className={baseClasses.accountSelector}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <h3 className={baseClasses.title}>{ACCOUNT_TYPES[accountType].label}</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className={baseClasses.dropdown}>
              {(Object.entries(ACCOUNT_TYPES) as [AccountType, typeof ACCOUNT_TYPES[AccountType]][]).map(([type, { label, icon: Icon }]) => (
                <button
                  key={type}
                  className={`${baseClasses.dropdownItem} ${
                    type === accountType
                      ? isDark
                        ? 'bg-gray-700'
                        : 'bg-gray-50'
                      : ''
                  } w-full text-left`}
                  onClick={() => {
                    setAccountType(type);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Icon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={baseClasses.iconContainer}>
          <CurrentIcon className={baseClasses.icon} />
        </div>
      </div>

      <div>
        <div className={baseClasses.amount}>
          {isEditMode ? (
            <input
              type="number"
              value={inputValue}
              onChange={handleChange}
              className={baseClasses.input}
              step="0.01"
              min="0"
              aria-label="Account balance"
            />
          ) : (
            <span className="font-mono">
              {balances[accountType].toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          )}
        </div>
        <div className={baseClasses.label}>
          Saldo Actual
        </div>
      </div>
    </div>
  );
};

export default CuentaBancariaWidget;