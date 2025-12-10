import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectAutocompleteProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name: string;
}

export default function SelectAutocomplete({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  required = false,
  name,
}: SelectAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atualizar opções filtradas quando options mudar
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Filtrar opções baseado no termo de busca
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input Container */}
      <div
        onClick={handleToggle}
        className={`
          w-full bg-[#f3f3f5] border-none rounded-lg px-3 py-1.5 text-[12px] text-gray-700
          flex items-center justify-between cursor-pointer
          focus-within:ring-2 focus-within:ring-[#c6f4ce]
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-[#717182]"
          autoComplete="off"
        />
        
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              tabIndex={-1}
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
          <ChevronDown
            className={`w-3 h-3 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-3 py-2 text-[12px] cursor-pointer transition-colors
                  ${value === option.value ? 'bg-[#c6f4ce] text-black' : 'hover:bg-gray-100 text-gray-700'}
                `}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-[12px] text-gray-500 text-center">
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
