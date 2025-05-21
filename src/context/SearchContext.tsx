// src/context/SearchContext.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  triggerSearch: (term: string) => void; // Function to explicitly set and trigger search
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // This function will be called by filters to update the search term
  // AND signal that it came from a filter click
  const triggerSearch = (term: string) => {
      console.log("SearchContext: Triggering search for -", term);
      setSearchTerm(term);
      // We rely on AlgoliaSearch component reacting to the searchTerm change
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, triggerSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};