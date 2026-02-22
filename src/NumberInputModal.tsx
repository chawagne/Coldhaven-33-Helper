import { useState, useEffect, useRef } from 'react'

export interface NumberInputModalProps {
  hexId: string | null
  currentNumber: number | null
  onClose: () => void
  onSave: (hexId: string, value: number | null) => void
}

export function NumberInputModal({
  hexId,
  currentNumber,
  onClose,
  onSave,
}: NumberInputModalProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (hexId != null) {
      setInput(
        currentNumber != null && currentNumber > 0
          ? String(currentNumber)
          : ''
      )
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [hexId, currentNumber])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hexId == null) return
    const raw = input.trim()
    if (raw === '') {
      onSave(hexId, null)
      onClose()
      return
    }
    const n = parseInt(raw, 10)
    if (Number.isNaN(n) || n < 0 || n > 12) return
    onSave(hexId, n === 0 ? null : n)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  if (hexId == null) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-gray-500 mb-2">Hex: {hexId}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            min={0}
            max={12}
            step={1}
            value={input}
            onChange={(e) => {
              const v = e.target.value
              if (v === '' || /^\d{1,2}$/.test(v)) {
                const n = parseInt(v, 10)
                if (v === '' || (Number.isInteger(n) && n >= 0 && n <= 12))
                  setInput(v)
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg"
            placeholder="0–12 (0 = clear)"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-slate-800 text-white"
            >
              OK
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-400 mt-2">Enter 0 or leave empty to clear.</p>
      </div>
    </div>
  )
}
