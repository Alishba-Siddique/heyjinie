//src/components/page-ui/search/no_results.tsx

type NoResultsProps = {
  searchTerm?: string;
}

const NoResults: React.FC<NoResultsProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 mb-6 opacity-50">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-gray-400"
        >
          <path 
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" 
            fill="currentColor"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">No Results Found</h3>
      {searchTerm && (
        <p className="text-sm text-gray-500 mb-4">
          We couldn't find any products matching "{searchTerm}"
        </p>
      )}
      <p className="text-sm text-gray-500">
        Try searching with different keywords or browse our categories
      </p>
    </div>
  );
};

export default NoResults;