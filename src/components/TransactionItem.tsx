import { Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, Utensils, Bus, Film, Home, 
  Activity, GraduationCap, HelpCircle, Trash2 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  onDelete?: () => void;
}

export function TransactionItem({ transaction, onClick, onDelete }: TransactionItemProps) {
  const { amount, description, date, category, source } = transaction;
  const formattedDate = formatDistanceToNow(new Date(date), { addSuffix: true });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick of the parent
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div 
      onClick={onClick}
      className="glass animate-in fade-in p-3 rounded-lg mb-2.5 transition-all duration-200 
        hover:shadow-md hover:translate-y-[-1px] press-effect active:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-primary/10 mr-3">
          {getCategoryIcon(category)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate">{description}</h3>
          <p className="text-xs text-muted-foreground flex items-center">
            {formattedDate}
            {source === 'sms' && (
              <span className="ml-2 px-1 py-0.5 text-[10px] rounded-md bg-blue-100 text-blue-700">SMS</span>
            )}
          </p>
        </div>
        <div className="text-right pl-2 flex items-center">
          <p className="font-semibold text-base mr-3">₹{amount.toFixed(0)}</p>
          {onDelete && (
            <button 
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Delete transaction"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'food':
      return <Utensils className="h-4 w-4 text-orange-500" />;
    case 'shopping':
      return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    case 'transportation':
      return <Bus className="h-4 w-4 text-green-500" />;
    case 'entertainment':
      return <Film className="h-4 w-4 text-purple-500" />;
    case 'utilities':
      return <Home className="h-4 w-4 text-yellow-500" />;
    case 'health':
      return <Activity className="h-4 w-4 text-red-500" />;
    case 'education':
      return <GraduationCap className="h-4 w-4 text-indigo-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
}
