
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Camera } from 'lucide-react';

const CodeViewer = ({ selectedType, code }) => {
  return (
    <div className="code-viewer">
            <button 
          onClick={() => navigator.clipboard.writeText(code)} 
          className="copy-button"
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Camera size={16} />
          Copy to Clipboard
        </button>
      <h2>{selectedType ? `${selectedType.namespace}.${selectedType.typeName}` : 'No type selected'}</h2>
      <div className="code-content">
        <SyntaxHighlighter 
          language="csharp" 
          style={vscDarkPlus}
          customStyle={{
            width: '100%',
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#1E1E1E',
          }}
          lineProps={{
            style: { wordBreak: 'normal', whiteSpace: 'pre-wrap' }
            // style: { whiteSpace: 'pre-wrap' }
            // style: { wordBreak: 'normal', whiteSpace: 'pre-wrap', wordSpacing: '0px' }

          }}
          wrapLines={true}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>

      </div>
    </div>
  );
};

export default CodeViewer;
