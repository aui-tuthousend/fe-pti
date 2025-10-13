import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Loading, LoadingSpinner } from '@/components/Loading'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/demo/errors')({
  component: ErrorsDemo,
})

function ErrorsDemo() {
  const [showAlerts, setShowAlerts] = useState(true)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🚨 Error Alert & Loading Components
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple alert dan loading component untuk custom
          </p>
        </div>

        {/* Error Alert */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Error Alert (4 Variants)
          </h2>
          <p className="text-muted-foreground mb-6">
            Alert dengan 4 variant: error, warning, success, info
          </p>
          
          <div className="space-y-4 mb-6">
            {showAlerts && (
              <>
                <ErrorAlert
                  variant="error"
                  title="Error"
                  message="This is an error alert. Something went wrong."
                  onClose={() => setShowAlerts(false)}
                />

                <ErrorAlert
                  variant="warning"
                  title="Warning"
                  message="This is a warning alert. Please review before proceeding."
                  dismissible
                />

                <ErrorAlert
                  variant="success"
                  title="Success"
                  message="This is a success alert. Changes saved successfully!"
                  dismissible
                />

                <ErrorAlert
                  variant="info"
                  title="Information"
                  message="This is an info alert. Here's some helpful information."
                  dismissible
                />
              </>
            )}
          </div>

          {!showAlerts && (
            <Button onClick={() => setShowAlerts(true)}>
              Show Alerts Again
            </Button>
          )}

          <div className="mt-6 bg-muted rounded-lg p-4">
            <pre className="text-sm text-foreground overflow-x-auto">
{`<ErrorAlert
  variant="error"    // error | warning | success | info
  title="Error"
  message="Something went wrong"
  dismissible
  onClose={() => {}}
/>`}
            </pre>
          </div>
        </section>

        {/* Loading Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Loading Component
          </h2>
          <p className="text-muted-foreground mb-6">
            Simple loading spinner yang bisa di-custom
          </p>
          
          <div className="bg-card border border-border rounded-lg p-8">
            {/* Using Loading Component */}
            <div className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">Loading Component</h3>
              <div className="flex items-center justify-center p-8">
                <Loading />
              </div>
              <pre className="mt-4 text-sm text-foreground bg-muted p-3 rounded overflow-x-auto">
{`import { Loading } from '@/components/Loading'

<Loading />`}
              </pre>
            </div>

            {/* Loading with Text */}
            <div className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">With Text</h3>
              <div className="flex flex-col items-center justify-center p-8">
                <Loading text="Loading data..." />
              </div>
              <pre className="mt-4 text-sm text-foreground bg-muted p-3 rounded overflow-x-auto">
{`<Loading text="Loading data..." />`}
              </pre>
            </div>

            {/* Loading Sizes */}
            <div className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">Different Sizes</h3>
              <div className="flex items-center gap-8 justify-center p-8">
                <div className="text-center">
                  <Loading size="sm" />
                  <p className="text-xs text-muted-foreground mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Loading size="md" />
                  <p className="text-xs text-muted-foreground mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Loading size="lg" />
                  <p className="text-xs text-muted-foreground mt-2">Large</p>
                </div>
              </div>
              <pre className="mt-4 text-sm text-foreground bg-muted p-3 rounded overflow-x-auto">
{`<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />`}
              </pre>
            </div>

            {/* Loading Colors */}
            <div className="mb-8">
              <h3 className="text-foreground font-semibold mb-4">Different Colors</h3>
              <div className="flex items-center gap-8 justify-center p-8">
                <div className="text-center">
                  <Loading color="primary" />
                  <p className="text-xs text-muted-foreground mt-2">Primary</p>
                </div>
                <div className="text-center">
                  <Loading color="secondary" />
                  <p className="text-xs text-muted-foreground mt-2">Secondary</p>
                </div>
                <div className="text-center">
                  <Loading color="success" />
                  <p className="text-xs text-muted-foreground mt-2">Success</p>
                </div>
                <div className="text-center">
                  <Loading color="destructive" />
                  <p className="text-xs text-muted-foreground mt-2">Destructive</p>
                </div>
              </div>
              <pre className="mt-4 text-sm text-foreground bg-muted p-3 rounded overflow-x-auto">
{`<Loading color="primary" />
<Loading color="secondary" />
<Loading color="success" />
<Loading color="destructive" />`}
              </pre>
            </div>

            {/* Inline Spinner */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Inline Spinner (for buttons)</h3>
              <div className="flex items-center gap-4 justify-center p-8">
                <Button disabled className="gap-2">
                  <LoadingSpinner />
                  Loading...
                </Button>
                <Button variant="secondary" disabled className="gap-2">
                  <LoadingSpinner />
                  Saving...
                </Button>
              </div>
              <pre className="mt-4 text-sm text-foreground bg-muted p-3 rounded overflow-x-auto">
              {`import { LoadingSpinner } from '@/components/Loading'

              <Button disabled className="gap-2">
                <LoadingSpinner />
                Loading...
              </Button>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Usage Examples
          </h2>
          
          <div className="space-y-6">
            {/* Alert Examples */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-foreground font-semibold mb-3">ErrorAlert Props</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• <code className="text-foreground">variant</code> - "error" | "warning" | "success" | "info"</p>
                <p>• <code className="text-foreground">title</code> - string (required)</p>
                <p>• <code className="text-foreground">message</code> - string (required)</p>
                <p>• <code className="text-foreground">dismissible</code> - boolean (default: true)</p>
                <p>• <code className="text-foreground">onClose</code> - () =&gt; void</p>
              </div>
            </div>

            {/* Loading Examples */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-foreground font-semibold mb-3">Loading Customization</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Change size: <code className="text-foreground">h-6 w-6</code> / <code className="text-foreground">h-12 w-12</code> / <code className="text-foreground">h-16 w-16</code></p>
                <p>• Change color: <code className="text-foreground">border-primary</code> / <code className="text-foreground">border-secondary</code></p>
                <p>• Add text: Wrap dengan flex dan tambahkan text</p>
                <p>• Full page: Tambahkan <code className="text-foreground">min-h-screen flex items-center justify-center</code></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
