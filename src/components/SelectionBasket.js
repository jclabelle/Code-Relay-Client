import React, { useState } from 'react';
import { Trash2, Download, Clipboard } from 'lucide-react';
import Alert, { AlertTitle, AlertDescription } from './Alert';

const SelectionBasket = ({ selectedItems, setSelectedItems }) => {
  const [includeComments, setIncludeComments] = useState(true);
  const [includeAttributes, setIncludeAttributes] = useState(true);
  const [includeUsingStatements, setIncludeUsingStatements] = useState(true);
  const [error, setError] = useState(null);

  const removeItem = (index) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const exportCode = async () => {
    setError(null);
    try {
      console.log("Exporting with options:", { includeComments, includeAttributes, includeUsingStatements });
      console.log("Selected items before processing:", selectedItems);

      const processedItems = selectedItems.map(item => ({
        Namespace: item.namespace,
        TypeName: item.typeName,
        MemberName: item.memberName || null
      }));

      console.log("Processed items for export:", processedItems);

      const response = await fetch('http://localhost:5000/api/CodebaseExplorer/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SelectedItems: processedItems,
          IncludeComments: includeComments,
          IncludeAttributes: includeAttributes,
          IncludeUsingStatements: includeUsingStatements
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!data.exportedCode) {
        throw new Error("Exported code is empty or undefined");
      }

      // Create a blob and download it
      const blob = new Blob([data.exportedCode], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'exported_code.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      setError(`Export failed: ${err.message}`);
    }
  };

  const saveToClipboard = async () => {
    setError(null);
    try {
      const processedItems = selectedItems.map(item => ({
        Namespace: item.namespace,
        TypeName: item.typeName,
        MemberName: item.memberName || null
      }));

      const response = await fetch('http://localhost:5000/api/CodebaseExplorer/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SelectedItems: processedItems,
          IncludeComments: includeComments,
          IncludeAttributes: includeAttributes,
          IncludeUsingStatements: includeUsingStatements
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.exportedCode) {
        throw new Error("Exported code is empty or undefined");
      }

      await navigator.clipboard.writeText(data.exportedCode);
      alert("Code saved to clipboard!");
    } catch (err) {
      console.error("Clipboard save error:", err);
      setError(`Failed to save to clipboard: ${err.message}`);
    }
  };

  return (
    <div className="selection-basket">
      <h3>Selection Basket</h3>
      <div className="basket-actions">
        <button onClick={exportCode} className="export-button">
          <Download size={16} />
          Export Selected Code
        </button>
        <button onClick={saveToClipboard} className="clipboard-button">
          <Clipboard size={16} />
          Save to Clipboard
        </button>
      </div>
      <ul>
        {selectedItems.map((item, index) => (
          <li key={index}>
            {item.namespace}.{item.typeName}{item.memberName ? `.${item.memberName}` : ''}
            <button onClick={() => removeItem(index)}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      <div className="export-options">
        <label>
          <input
            type="checkbox"
            checked={includeComments}
            onChange={(e) => setIncludeComments(e.target.checked)}
          />
          Include Comments
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeAttributes}
            onChange={(e) => setIncludeAttributes(e.target.checked)}
          />
          Include Attributes
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeUsingStatements}
            onChange={(e) => setIncludeUsingStatements(e.target.checked)}
          />
          Include Using Statements
        </label>
      </div>
      {error && (
        <Alert variant="danger">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SelectionBasket;