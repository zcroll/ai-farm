import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Camera, Leaf } from 'lucide-react';

interface QuickScanFabProps {
  className?: string;
}

const QuickScanFab: React.FC<QuickScanFabProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      <Link href="/scan">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors group"
          title="Quick Plant Scan"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Camera className="h-6 w-6 group-hover:hidden" />
            <Leaf className="h-6 w-6 hidden group-hover:block" />
          </motion.div>
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default QuickScanFab;