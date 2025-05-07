import React from 'react';
import { X } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ isOpen, onClose, documentUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Visualización de documento</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-grow overflow-auto">
          <div className="h-full w-full">
            <iframe
              src={documentUrl}
              className="w-full h-full border-0"
              title="Documento"
              style={{ height: 'calc(90vh - 60px)', width: '100%', objectFit: 'contain' }}
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;