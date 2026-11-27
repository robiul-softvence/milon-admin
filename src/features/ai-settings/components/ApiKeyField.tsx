import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

interface ApiKeyFieldProps {
  maskedKey: string
  apiKey: string
  name: string
}

/** Read-only key row (Figma "API Key") with a show/hide eye toggle. */
export function ApiKeyField({ maskedKey, apiKey, name }: ApiKeyFieldProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-line px-3 py-2.5">
      <Icon name="key" size={16} className="shrink-0 text-muted" />
      <p className="min-w-0 flex-1 truncate text-body text-muted" aria-label={`${name} API key`}>
        {visible ? apiKey : maskedKey}
      </p>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide API key' : 'Show API key'}
        title={visible ? 'Hide API key' : 'Show API key'}
        className="-m-1.5 inline-flex shrink-0 p-1.5 text-muted transition-colors hover:text-ink"
      >
        <Icon name={visible ? 'ai-eye-off' : 'eye'} size={16} />
      </button>
    </div>
  )
}
