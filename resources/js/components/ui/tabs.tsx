import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
}) => {
  const [activeTabState, setActiveTabState] = useState(defaultValue);
  
  const activeTab = value !== undefined ? value : activeTabState;
  
  const setActiveTab = (tabValue: string) => {
    if (value === undefined) {
      setActiveTabState(tabValue);
    }
    onValueChange?.(tabValue);
  };
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex space-x-1 rounded-md p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children,
  className = ""
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1.5 text-sm font-medium transition-all rounded-sm ${
        isActive ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children,
  className = ""
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }
  
  const { activeTab } = context;
  const isActive = activeTab === value;
  
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={`mt-2 ${className}`}
    >
      {children}
    </div>
  );
}; 