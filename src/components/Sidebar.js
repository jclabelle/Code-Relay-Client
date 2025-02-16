import React, { useState, useEffect } from 'react';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import Alert, { AlertTitle, AlertDescription } from './Alert'; 

const Sidebar = ({ onNamespaceSelect, onTypeSelect }) => {
  const [directories, setDirectories] = useState([]);
  const [expandedDirs, setExpandedDirs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDirectories();
  }, []);

  const fetchDirectories = async (path = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/CodebaseExplorer/directories?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch directories');
      }
      const data = await response.json();
      setDirectories(data);
    } catch (err) {
      setError('Failed to load directories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDirectory = (path) => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
    if (!expandedDirs[path]) {
      fetchDirectories(path);
    }
  };

  const renderDirectory = (dir) => (
    <li key={dir.fullPath}>
      <div className="directory-item" onClick={() => toggleDirectory(dir.fullPath)}>
        {expandedDirs[dir.fullPath] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Folder size={16} />
        <span>{dir.name}</span>
      </div>
      {expandedDirs[dir.fullPath] && (
        <ul className="subdirectory">
          {directories
            .filter(subDir => subDir.fullPath.startsWith(dir.fullPath) && subDir.fullPath !== dir.fullPath)
            .map(renderDirectory)}
        </ul>
      )}
    </li>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="sidebar">
      <h2>Directory Navigation</h2>
      <ul className="directory-tree">
        {directories.filter(dir => !dir.fullPath.includes('/')).map(renderDirectory)}
      </ul>
    </div>
  );
};

export default Sidebar;
