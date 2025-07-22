import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Leaf } from 'lucide-react';
import axios from 'axios';

interface Disease {
  id: number;
  name: string;
  displayName: string;
  plantType: string;
  description: string;
  severity: string;
  treatment: string;
  prevention: string;
}

interface MentionedDisease {
  id: number;
  name: string;
  displayName: string;
  plantType: string;
  severity: string;
  treatment: string;
  prevention: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentionedDiseases: MentionedDisease[]) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "Type @ to mention diseases...",
  disabled = false,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<Disease[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mentionedDiseases, setMentionedDiseases] = useState<MentionedDisease[]>([]);
  const [currentMention, setCurrentMention] = useState<{ start: number; query: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search for diseases when @ is typed
  const searchDiseases = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('/api/diseases/search', {
        params: { q: query, limit: 8 },
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.data.success) {
        setSuggestions(response.data.data);
      }
    } catch (error) {
      console.error('Error searching diseases:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Check for @ mentions
    const beforeCursor = newValue.substring(0, cursorPosition);
    const atIndex = beforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const afterAt = beforeCursor.substring(atIndex + 1);
      const spaceIndex = afterAt.indexOf(' ');

      if (spaceIndex === -1) {
        // We're in the middle of typing a mention
        setCurrentMention({ start: atIndex, query: afterAt });
        setShowSuggestions(true);
        setSelectedIndex(0);

        // Add test suggestions if query is empty (just typed @)
        if (afterAt === '') {
          setSuggestions([
            {
              id: 1,
              name: 'Test_Disease',
              displayName: 'Test Disease',
              plantType: 'Test Plant',
              description: 'This is a test disease for debugging',
              severity: 'Medium',
              treatment: 'Test treatment',
              prevention: 'Test prevention'
            }
          ]);
        } else {
          searchDiseases(afterAt);
        }
      } else {
        // Mention is complete or we moved past it
        setShowSuggestions(false);
        setCurrentMention(null);
      }
    } else {
      setShowSuggestions(false);
      setCurrentMention(null);
    }

    onChange(newValue, mentionedDiseases);
  };

  // Handle suggestion selection
  const selectSuggestion = (disease: Disease) => {
    if (!currentMention) return;

    const beforeMention = value.substring(0, currentMention.start);
    const afterMention = value.substring(currentMention.start + currentMention.query.length + 1);
    const mentionText = `@${disease.displayName}`;
    const newValue = beforeMention + mentionText + ' ' + afterMention;

    // Add to mentioned diseases
    const newMentionedDisease: MentionedDisease = {
      id: disease.id,
      name: disease.name,
      displayName: disease.displayName,
      plantType: disease.plantType,
      severity: disease.severity,
      treatment: disease.treatment,
      prevention: disease.prevention,
    };

    const updatedMentions = [...mentionedDiseases];
    if (!updatedMentions.find(m => m.id === disease.id)) {
      updatedMentions.push(newMentionedDisease);
    }

    setMentionedDiseases(updatedMentions);
    setShowSuggestions(false);
    setCurrentMention(null);
    setSuggestions([]);

    onChange(newValue, updatedMentions);

    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
      const newCursorPos = beforeMention.length + mentionText.length + 1;
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
          e.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setCurrentMention(null);
          break;
      }
    } else if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />

      {/* Mentioned diseases display */}
      {mentionedDiseases.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {mentionedDiseases.map((disease) => (
            <Badge
              key={disease.id}
              variant="secondary"
              className="text-xs bg-green-100 text-green-800 border-green-200"
            >
              <Leaf className="h-3 w-3 mr-1" />
              {disease.displayName}
              <button
                onClick={() => {
                  const updated = mentionedDiseases.filter(m => m.id !== disease.id);
                  setMentionedDiseases(updated);
                  // Remove mention from text
                  const mentionText = `@${disease.displayName}`;
                  const newValue = value.replace(new RegExp(`@${disease.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g'), '');
                  onChange(newValue, updated);
                }}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-xl max-h-64 overflow-y-auto"
          style={{
            position: 'absolute',
            zIndex: 99999,
            backgroundColor: '#1f2937',
            border: '2px solid #4b5563',
            borderRadius: '6px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
            minHeight: '80px',
            width: '100%',
            maxHeight: '250px'
          }}
        >
          {isLoading ? (
            <div className="p-3 text-center">
              <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-300" />
              <span className="text-sm text-gray-300 ml-2">Searching diseases...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((disease, index) => (
              <div
                key={disease.id}
                className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-700 ${
                  index === selectedIndex ? 'bg-gray-600' : ''
                }`}
                onClick={() => selectSuggestion(disease)}
                style={{
                  borderBottom: index === suggestions.length - 1 ? 'none' : '1px solid #4b5563'
                }}
              >
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate text-white">{disease.displayName}</span>
                      <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-500">
                        {disease.plantType}
                      </Badge>
                      <Badge
                        variant={disease.severity === 'High' ? 'destructive' : disease.severity === 'Medium' ? 'default' : 'secondary'}
                        className="text-xs"
                        style={{
                          backgroundColor: disease.severity === 'High' ? '#dc2626' : disease.severity === 'Medium' ? '#d97706' : '#6b7280',
                          color: 'white'
                        }}
                      >
                        {disease.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{disease.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : currentMention && currentMention.query.length > 0 ? (
            <div className="p-3 text-center text-sm text-gray-400">
              No diseases found for "{currentMention.query}"
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-gray-400">
              Type to search diseases...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentionInput;
