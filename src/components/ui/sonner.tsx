import { useTheme } from "@/components/theme-provider"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-card)",
          "--normal-text": "var(--color-foreground)",
          "--normal-border": "var(--color-border)",
          "--success-bg": "var(--color-success)",
          "--success-text": "var(--color-success-foreground)",
          "--error-bg": "var(--color-destructive)",
          "--error-text": "var(--color-destructive-foreground)",
          "--warning-bg": "var(--color-warning)",
          "--warning-text": "var(--color-warning-foreground)",
          "--info-bg": "var(--color-info)",
          "--info-text": "var(--color-info-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
