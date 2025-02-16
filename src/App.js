import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CodeViewer from './components/CodeViewer';
import SelectionBasket from './components/SelectionBasket';
import SearchBar from './components/SearchBar';
import './App.css';
import { Camera } from 'lucide-react';
import CodeUpdater from './components/CodeUpdater';


const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('codeViewer');
  const [searchResults, setSearchResults] = useState({ types: [], members: [] });
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTypeCode, setSelectedTypeCode] = useState('');

  const handleSearch = (results) => {
    console.log("Received search results:", results);
    setSearchResults({
      types: Array.isArray(results.types) ? results.types : [],
      members: Array.isArray(results.members) ? results.members : [],
    });
  };


  const handleItemSelect = async (item) => {
    console.log("Item selected:", item);
    setSelectedType(item);
    try {
      const response = await fetch(`http://localhost:5000/api/CodebaseExplorer/code?namespaceName=${encodeURIComponent(item.namespace)}&typeName=${encodeURIComponent(item.typeName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch code - response not ok');
      }
      const data = await response.json();
      setSelectedTypeCode(data.code);
    } catch (error) {
      console.error('Error fetching code:', error);
      setSelectedTypeCode('');
    }
  };

  const handleAddToBasket = (item) => {
    if (!selectedItems.some(i => i.namespace === item.namespace && i.typeName === item.typeName)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="left-sidebar">
          <SearchBar 
            onSearch={handleSearch} 
            onAddToBasket={handleAddToBasket}
            onSelectType={handleItemSelect}
          />
        </div>
        <main className="main-content">
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'codeViewer' ? 'active' : ''}`}
              onClick={() => setActiveTab('codeViewer')}
            >
              Code Viewer
            </button>
            <button 
              className={`tab ${activeTab === 'selectionBasket' ? 'active' : ''}`}
              onClick={() => setActiveTab('selectionBasket')}
            >
              Selection Basket
            </button>
            <button
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'codeViewer' && (
              <CodeViewer 
              selectedType={selectedType}
              code={selectedTypeCode}
            />
            )}
            {activeTab === 'selectionBasket' && (
              <SelectionBasket 
                selectedItems={selectedItems} 
                setSelectedItems={setSelectedItems} 
              />
            )}
            {activeTab === 'settings' && ( 
              <CodeUpdater /> // 
            )}
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
