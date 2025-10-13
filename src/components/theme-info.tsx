import { useTheme } from './theme-provider'

export function ThemeInfo() {
  const { theme } = useTheme()
  
  const isDark = theme === 'dark'

  return (
    <div 
      className="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg border text-sm font-mono"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-foreground)',
        zIndex: 1000
      }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ 
            backgroundColor: isDark ? '#FAD643' : '#eac12c'
          }}
        />
        <span>
          Mode: <strong>{theme}</strong> {isDark ? '🌙' : '☀️'}
        </span>
      </div>
    </div>
  )
}
