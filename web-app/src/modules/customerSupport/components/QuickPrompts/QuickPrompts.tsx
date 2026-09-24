import { QUICK_SUPPORT_TOPICS } from '../../constants/customerSupport.constants'
import './QuickPrompts.css'

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

export const QuickPrompts = ({ onSelectPrompt }: QuickPromptsProps) => {
  return (
    <div className="cs-quick-prompts">
      <div className="cs-quick-prompts__list">
        {QUICK_SUPPORT_TOPICS.map((topic, i) => (
          <button
            key={i}
            type="button"
            className="cs-quick-prompts__chip"
            onClick={() => onSelectPrompt(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}
