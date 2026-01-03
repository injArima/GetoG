import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full z-50">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-purple rounded-full blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
        <div className="relative flex items-center bg-black/80 backdrop-blur-xl rounded-full border border-white/10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-transparent text-white px-6 py-4 rounded-full focus:outline-none placeholder-white/40 font-medium"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-3 mr-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;