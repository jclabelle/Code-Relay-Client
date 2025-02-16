import React from 'react';

const CodeUpdater = () => {
    const handleUpdate = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/CodebaseExplorer/update-codebase', {
            method: 'GET',
          });
          
          const result = await response.json(); // Parse the JSON response
      
          if (response.ok) {
            alert(result.Message || 'Codebase updated successfully');
          } else {
            alert(`Failed to update codebase: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error updating codebase:', error);
          alert(`An error occurred while updating the codebase: ${error.message}`);
        }
      };
      
  return (
    <button onClick={handleUpdate} style={{
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }}>
      Update Codebase
    </button>
  );
};

export default CodeUpdater;
