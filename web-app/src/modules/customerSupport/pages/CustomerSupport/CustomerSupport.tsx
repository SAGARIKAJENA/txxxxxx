import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatWindow } from '../../components'
import { useCustomerSupportChat } from '../../hooks/useCustomerSupportChat'
import './CustomerSupport.css'

export const CustomerSupport = () => {
  const [searchParams] = useSearchParams()

  const appId = searchParams.get('appId') || undefined
  const executiveId = searchParams.get('executiveId') || undefined

  const {
    conversation,
    isLoading: isChatLoading,
    isSending,
    sendMessage,
  } = useCustomerSupportChat(appId, executiveId)

  // Prevent double scrollbars by locking the body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="cs-mobile-view">
      <ChatWindow
        conversation={conversation}
        isLoading={isChatLoading}
        isSending={isSending}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

export default CustomerSupport
