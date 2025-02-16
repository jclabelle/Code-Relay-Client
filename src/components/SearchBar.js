import React, { useState, useEffect } from 'react';
import { Search, Settings } from 'lucide-react';
import Select from 'react-select'; // Import a multi-select dropdown library
import Alert, { AlertTitle, AlertDescription } from './Alert';

// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#2c2c2c',  // Dark background color for the dropdown
    borderColor: '#444',          // Dark border color
    color: '#cccccc',             // Light text color
    minHeight: '36px',            // Adjust height if necessary
    boxShadow: 'none',            // Remove default shadow
    '&:hover': {
      borderColor: '#007bff',     // Border color on hover
    },
  }),
  input: (provided) => ({
    ...provided,
    color: '#cccccc',              // Light text color for the input field
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#2c2c2c',   // Match menu background with control background
    color: '#cccccc',             // Light text color
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#444',      // Background color for selected options
    color: '#ffffff',             // Light text color for selected options
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#ffffff',             // Light text color for labels in selected options
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#ffffff',             // Light color for remove icon
    ':hover': {
      backgroundColor: '#007bff', // Highlight remove button on hover
      color: 'white',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#007bff' : '#2c2c2c', // Highlight focused option
    color: state.isFocused ? 'white' : '#cccccc',             // Text color for focused option
    ':active': {
      backgroundColor: '#007bff',  // Background color on option click
      color: 'white',              // Text color on option click
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#999999',              // Placeholder text color
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#cccccc',              // Single selected value text color
  }),
};

const SearchBar = ({ onSearch, onAddToBasket, onSelectType }) => {
  const [query, setQuery] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [filters, setFilters] = useState({
    namespaces: [],
    typeKinds: [],
    memberKinds: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState({ types: [], members: [] });
  const [selectedNamespaces, setSelectedNamespaces] = useState([]); // New state for selected namespaces
  const [availableNamespaces, setAvailableNamespaces] = useState([]); // To store fetched namespaces

  useEffect(() => {
    // Fetch the list of namespaces when the component mounts
    fetch('http://localhost:5000/api/CodebaseExplorer/namespaces')
      .then(response => response.json())
      .then(data => setAvailableNamespaces(data.map(ns => ({ value: ns, label: ns }))))
      .catch(err => console.error("Failed to fetch namespaces:", err));
  }, []);


  const handleNamespaceChange = (selectedOptions) => {
    setSelectedNamespaces(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleSearch = async () => {
    setError(null);
  
    try {
      // Construct the request data
      const requestData = {
        query,
        useRegex,
        filters: {
          ...filters,
          namespaces: selectedNamespaces, // Include selected namespaces in filters
        },
      };
  
      const response = await fetch('http://localhost:5000/api/CodebaseExplorer/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const formattedTypes = data.types.map(type => ({
        namespace: type.namespace,
        name: type.name
      }));
  
      setSearchResults({ types: formattedTypes, members: data.members });
      onSearch({ types: formattedTypes, members: data.members });
  
    } catch (err) {
      console.error("Search error:", err);
      setError(`Search failed: ${err.message}`);
      setSearchResults({ types: [], members: [] });
      onSearch({ types: [], members: [] });
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const renderSearchResults = () => {
    return (
      <div className="search-results">
        <h3>Search Results</h3>
        {searchResults.types && searchResults.types.length > 0 ? (
          <ul className="namespace-list">
            {Object.entries(groupByNamespace(searchResults.types)).map(([namespace, types], index) => (
              <li key={index} className="namespace-item">
                <div className="namespace-header">{namespace}</div>
                <ul className="type-list">
                  {types.map((type, typeIndex) => (
                    <li key={typeIndex} className="type-item">
                      <button onClick={() => onAddToBasket({ namespace, typeName: type })}>+</button>
                      <span onClick={() => onSelectType({ namespace, typeName: type })}>{type}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No types found</p>
        )}
      </div>
    );
  };
  
  const groupByNamespace = (types) => {
    return types.reduce((acc, type) => {
      if (!acc[type.namespace]) {
        acc[type.namespace] = [];
      }
      acc[type.namespace].push(type.name);
      return acc;
    }, {});
  };

  return (
    <div className="search-bar">
      <div className="search-input">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress} /* Listen for Enter key press */
          placeholder="Search types or members..."
        />
        <button onClick={handleSearch}>
          <Search size={16} />
          Search
        </button>
        <button onClick={toggleFilters}>
          <Settings size={16} />
          Filters
        </button>
      </div>
      {showFilters && (
        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
            />
            Use Regex
          </label>

          <div>
            <h4>Filter by Namespace</h4>
            <Select
              isMulti
              options={availableNamespaces}
              value={availableNamespaces.filter(ns => selectedNamespaces.includes(ns.value))}
              onChange={handleNamespaceChange}
              placeholder="Select namespaces..."
              className="namespace-select"
              styles={customStyles}
            />
          </div>
        </div>
      )}
      {error && (
        <Alert variant="danger">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {renderSearchResults()}
    </div>
  );
};

export default SearchBar;
