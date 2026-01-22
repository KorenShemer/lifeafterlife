'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizes[size]} mx-4`}>
        <div className="bg-[#0f1419] border border-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <Button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
