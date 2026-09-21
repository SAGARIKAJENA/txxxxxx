import { useCallback, useEffect, useState } from 'react'
import { customerSupportService } from '../services/customerSupportService'
import type {
  SupportAttachment,
  SupportConversation,
  SupportMessage,
} from '../types/customerSupport.types'

export const useCustomerSupportChat = (appId?: string, executiveId?: string) => {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConversation = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await customerSupportService.getConversation(appId, executiveId)
      setConversation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation')
    } finally {
      setIsLoading(false)
    }
  }, [appId, executiveId])

  useEffect(() => {
    loadConversation()
  }, [loadConversation])

  const sendMessage = useCallback(
    async (text: string, attachments?: SupportAttachment[]): Promise<SupportMessage | null> => {
      if (!conversation || (!text.trim() && (!attachments || attachments.length === 0))) {
        return null
      }

      setIsSending(true)
      try {
        const sent = await customerSupportService.sendMessage({
          conversationId: conversation.id,
          text,
          attachments,
        })

        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, sent],
              }
            : null
        )

        // Simulate intelligent assistant / executive acknowledgment
        setTimeout(() => {
          const autoReply: SupportMessage = {
            id: `msg_exec_reply_${Date.now()}`,
            conversationId: conversation.id,
            senderId: conversation.executive.id,
            senderType: 'executive',
            senderName: conversation.executive.name,
            text: `Thank you for sharing. I've noted this in your file and will review it immediately.`,
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'read',
          }

          setConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, autoReply],
                }
              : null
          )
        }, 1200)

        return sent
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        return null
      } finally {
        setIsSending(false)
      }
    },
    [conversation]
  )

  return {
    conversation,
    isLoading,
    isSending,
    error,
    sendMessage,
    reload: loadConversation,
  }
}
