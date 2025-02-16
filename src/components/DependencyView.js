import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Alert, { AlertTitle, AlertDescription } from './Alert'; 

const DependencyView = ({ namespace, typeName }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetchDependencies();
  }, [namespace, typeName]);

  const fetchDependencies = async () => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/CodebaseExplorer/dependencies?namespaceName=${namespace}&typeName=${typeName || ''}`);
      const data = await response.json();
      setGraphData(transformDataToGraphFormat(data));
    } catch (err) {
      setError('Failed to fetch dependencies. Please try again.');
    }
  };

  const transformDataToGraphFormat = (data) => {
    const nodes = [];
    const links = [];
    return { nodes, links };
  };

  const handleZoomIn = () => setZoom(zoom * 1.2);
  const handleZoomOut = () => setZoom(zoom / 1.2);

  if (error) {
    return (
      <Alert variant="danger">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="dependency-view">
      <div className="zoom-controls">
        <button onClick={handleZoomIn}><ZoomIn size={16} /></button>
        <button onClick={handleZoomOut}><ZoomOut size={16} /></button>
      </div>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => d.value * 0.001}
        zoom={zoom}
      />
    </div>
  );
};

export default DependencyView;
