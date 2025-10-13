import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { ThemeInfo } from '@/components/theme-info'
import { Moon, Sun } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            🎨 Light & Dark Mode Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Klik tombol di header atau gunakan tombol di bawah untuk toggle theme
          </p>
        </div>

        {/* Theme Controls */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Theme Controls
          </h2>
          <p className="mb-4 text-muted-foreground">
            Current theme: <span className="font-bold text-primary">{theme}</span>
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Color Palette
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-border bg-primary" />
              <div>
                <p className="font-semibold text-foreground">Primary</p>
                <p className="text-sm text-muted-foreground">Accent color</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-border bg-secondary" />
              <div>
                <p className="font-semibold text-foreground">Secondary</p>
                <p className="text-sm text-muted-foreground">Supporting color</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-border bg-accent" />
              <div>
                <p className="font-semibold text-foreground">Accent</p>
                <p className="text-sm text-muted-foreground">Hover states</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-border bg-destructive" />
              <div>
                <p className="font-semibold text-foreground">Destructive</p>
                <p className="text-sm text-muted-foreground">Error states</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Button Variants
          </h2>
          
          <div className="space-y-4">
            {/* Standard Variants */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Standard Variants</h3>
              <div className="flex gap-3 flex-wrap">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Alert Variants */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Alert Variants (NEW!)</h3>
              <div className="flex gap-3 flex-wrap">
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="info">Info</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p className="text-sm">
            💡 Tips: Klik tombol <strong className="text-primary">Sun/Moon</strong> di pojok kanan atas header untuk toggle cepat!
          </p>
        </div>
      </div>

      {/* Floating Theme Indicator */}
      <ThemeInfo />
    </div>
  )
}
