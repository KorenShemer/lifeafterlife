interface ProgressBarProps {
  value: number;
  max?: number;
  showLabels?: boolean; // שיניתי מיחיד לרבים כדי שיתאים לשימוש שלך
  labels?: string[];    // הוספתי את המערך שהיה חסר
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  showLabels = false, // עדכון השם כאן
  labels = [],        // קבלת המערך החדש
  size = 'md',
  variant = 'default',
  className = '' 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  // ... שאר הלוגיקה
  
  return (
    <div className={className}>
      {/* שימוש ב-showLabels ובלייבלים החדשים */}
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          {labels.length > 0 ? (
            labels.map((label, i) => <span key={i}>{label}</span>)
          ) : (
            <>
              <span>{value} / {max}</span>
              <span>{percentage.toFixed(0)}%</span>
            </>
          )}
        </div>
      )}
      {/* ... ה-Progress Bar עצמו */}
    </div>
  );
}