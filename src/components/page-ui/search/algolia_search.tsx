'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
  InstantSearch,
  connectSearchBox,
  connectHits,
} from 'react-instantsearch-dom';
import { useRouter, usePathname } from 'next/navigation';
import { FiSearch, FiX, FiClock } from 'react-icons/fi';
import { useSearch } from '@/context/SearchContext';

// Import the correct types from react-instantsearch-core
import type { SearchBoxProvided, HitsProvided } from 'react-instantsearch-core';

const appId = `${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`;
const searchApiKey = `${process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY}`;

// Ensure keys are strings, handle potential undefined
if (!appId || !searchApiKey) {
  console.error('Algolia App ID or Search API Key is missing!');
  // Handle this case appropriately, maybe return a disabled component
}

const searchClient = algoliasearch(appId!, searchApiKey!);

const STORAGE_KEY = 'search_history';

// --- Interfaces and Helper Functions (getSearchHistory, saveSearchHistory) ---
const getSearchHistory = (): string[] => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Failed to parse search history:', e);
      return [];
    }
  }
  return [];
};

const saveSearchHistory = (query: string) => {
  if (!query.trim() || typeof window === 'undefined') return;
  const history = getSearchHistory();

  // Remove existing entry if present to move it to the top
  const filteredHistory = history.filter((item) => item !== query);

  const newHistory = [query, ...filteredHistory].slice(0, 5); // Limit history size
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed to save search history:', e);
  }
};

// --- Hit Component (Fixed prop types) ---
interface HitProps {
  hit: any;
  setSearchHistory: Dispatch<SetStateAction<string[]>>;
}

const Hit: React.FC<HitProps> = ({ hit, setSearchHistory }) => {
  const router = useRouter();

  const handleHitClick = () => {
    if (!hit || !hit.name) return;
    saveSearchHistory(hit.name);
    setSearchHistory(getSearchHistory()); // Update state in parent

    // Navigate to product or brand page
    // Example navigation:
    const companyId = hit.company_id?._id || 'defaultCompanyId';
    const companyName = hit.company_id?.name?.toLowerCase() || 'brand';
    router.push(`/${companyName}/${companyId}`);
    // toast.info(`Navigating to details for ${hit.name} (implement navigation)`);
  };

  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100"
      onClick={handleHitClick}
    >
      <div className="w-12 h-12 relative mr-3 flex-shrink-0">
        <img
          src={hit.sticker_path || hit.image_path || '/images/logoicons.png'}
          className="w-full h-full object-contain"
          alt={hit.name || 'Product'}
          onError={(e) => {
            e.currentTarget.src = '/images/logoicons.png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {hit.name || 'Unnamed Product'}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {hit.description || ''}
        </p>
      </div>
      {hit.price && ( // Conditionally render price
        <span className="text-sm font-semibold text-gray-900 ml-2">
          Rs.{hit.price}
        </span>
      )}
    </div>
  );
};

// --- CustomHitsComponent ---
const CustomHitsComponent = ({
  hits,
  setSearchHistory,
}: {
  hits: any[];
  setSearchHistory: Dispatch<SetStateAction<string[]>>;
}) => {
  return hits.length ? (
    <div className="search-hits-container">
      {hits.map((hit) => (
        <Hit hit={hit} key={hit.objectID} setSearchHistory={setSearchHistory} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-[20vh] text-center p-6">
      <FiSearch className="text-gray-400 text-3xl mb-2" />
      <p className="text-gray-500 text-base font-medium">No Results Found</p>
      <p className="text-gray-400 text-sm mt-1">
        Try searching with different keywords
      </p>
    </div>
  );
};

// Fixed connectHits implementation
const CustomHits = connectHits((props: HitsProvided<any>) => {
  // Extract searchHistory setter from parent component through a global or ref
  // This is a workaround since the higher-order component pattern doesn't allow passing extra props
  // This can happen if CustomHits is rendered outside an AlgoliaSearchContextProvider.
  const algoliaCtx = React.useContext(AlgoliaSearchContext);
  if (!algoliaCtx) {
    console.error(
      'AlgoliaSearchContext not found in CustomHits. Ensure CustomHits is rendered within AlgoliaSearchContextProvider.'
    );
    return null; // Or some fallback UI
  }
  return (
    <CustomHitsComponent
      hits={props.hits}
      setSearchHistory={algoliaCtx.setSearchHistory}
    />
  );
});

// --- Search Box Component ---
const CustomSearchBox = ({
  currentRefinement,
  refine,
  algoliaContext,
}: SearchBoxProvided & {
  algoliaContext: {
    onHistoryUpdate: (newHistory: string[]) => void;
    setContextSearchTerm: (term: string) => void;
    contextSearchTerm: string;
    setDropdownOpen: (isOpen: boolean) => void;
    isDropdownOpen: boolean;
    shouldShowDropdown: boolean;
  };
}) => {
  const {
    onHistoryUpdate,
    setContextSearchTerm,
    contextSearchTerm,
    setDropdownOpen,
    isDropdownOpen,
    shouldShowDropdown,
  } = algoliaContext;

  const [inputValue, setInputValue] = useState(currentRefinement || '');

  useEffect(() => {
    if (currentRefinement !== inputValue) {
      setInputValue(currentRefinement);
    }
    if (
      contextSearchTerm !== currentRefinement &&
      contextSearchTerm !== inputValue
    ) {
      setInputValue(contextSearchTerm);
    }
  }, [currentRefinement, contextSearchTerm, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    refine(value);
    setContextSearchTerm(value);
    if (shouldShowDropdown) {
      setDropdownOpen(value.length > 0);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      console.log('CustomSearchBox: Enter pressed with term:', trimmedValue);
      saveSearchHistory(trimmedValue);
      onHistoryUpdate(getSearchHistory());
      if (trimmedValue !== currentRefinement) {
        refine(trimmedValue);
      }
      if (trimmedValue !== contextSearchTerm) {
        setContextSearchTerm(trimmedValue);
      }
      setDropdownOpen(false);
    }
  };

  const clearSearch = () => {
    setInputValue('');
    refine('');
    setContextSearchTerm('');
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-200 rounded-md bg-white px-3 shadow-sm hover:border-gray-300 focus-within:border-[#000000] focus-within:ring-1 focus-within:ring-[#000000]">
        <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
        <input
          placeholder="Search items..."
          className="w-full py-2 px-2 bg-transparent focus:outline-none text-sm placeholder-gray-400"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue && shouldShowDropdown) setDropdownOpen(true);
          }}
          aria-label="Search items"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0"
            aria-label="Clear search"
            type="button"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// Connect the search box - proper implementation
const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

// Create a context to pass props to connected components
const AlgoliaSearchContext = React.createContext<{
  setSearchHistory: Dispatch<SetStateAction<string[]>>;
  onHistoryUpdate: (newHistory: string[]) => void;
  setContextSearchTerm: (term: string) => void;
  contextSearchTerm: string;
  setDropdownOpen: (isOpen: boolean) => void;
  isDropdownOpen: boolean;
  shouldShowDropdown: boolean;
}>({
  setSearchHistory: () => {},
  onHistoryUpdate: () => {},
  setContextSearchTerm: () => {},
  contextSearchTerm: '',
  setDropdownOpen: () => {},
  isDropdownOpen: false,
  shouldShowDropdown: true,
});

// Context provider component
const AlgoliaSearchContextProvider = AlgoliaSearchContext.Provider;

// --- Main AlgoliaSearch Component ---
const AlgoliaSearch = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(
    getSearchHistory()
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const {
    searchTerm: contextSearchTerm,
    setSearchTerm: setContextSearchTerm,
    triggerSearch,
  } = useSearch();

  // Check if we're on the /brands page
  const shouldShowDropdown = !pathname?.startsWith('/brands');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when searchTerm changes (e.g., from filter clicks)
  useEffect(() => {
    if (contextSearchTerm && contextSearchTerm.trim().length > 0 && shouldShowDropdown) {
      setIsDropdownOpen(true);
    }
  }, [contextSearchTerm, shouldShowDropdown]);

  const handleHistoryClick = useCallback(
    (item: string) => {
      console.log('AlgoliaSearch: History item clicked:', item);
      triggerSearch(item);
      if (shouldShowDropdown) {
        setIsDropdownOpen(true);
      }
    },
    [triggerSearch, shouldShowDropdown]
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSearchHistory([]);
    setIsDropdownOpen(false);
  }, []);

  const handleHistoryUpdate = useCallback((newHistory: string[]) => {
    setSearchHistory(newHistory);
  }, []);

  // Context value for connected components
  const contextValue = {
    setSearchHistory,
    onHistoryUpdate: handleHistoryUpdate,
    setContextSearchTerm,
    contextSearchTerm,
    setDropdownOpen: setIsDropdownOpen,
    isDropdownOpen,
    shouldShowDropdown,
  };

  return (
    <AlgoliaSearchContextProvider value={contextValue}>
      <div className="relative w-full" ref={searchRef}>
        <InstantSearch
          searchClient={searchClient}
          indexName="products_stag"
          searchState={{ query: contextSearchTerm }}
          onSearchStateChange={({ query }) => {
            if (query !== undefined && query !== contextSearchTerm) {
              // setContextSearchTerm(query);
            }
          }}
        >
          <ConnectedSearchBox algoliaContext={contextValue} />

          {isDropdownOpen && shouldShowDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
              {searchHistory.length > 0 && !contextSearchTerm && (
                <div className="p-2 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-xs text-gray-500 font-semibold">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-blue-500 hover:text-blue-700"
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {searchHistory.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <FiClock className="text-gray-500 mr-2 flex-shrink-0 w-4 h-4" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {contextSearchTerm && <CustomHits />}
            </div>
          )}
        </InstantSearch>
      </div>
    </AlgoliaSearchContextProvider>
  );
};

export default AlgoliaSearch;