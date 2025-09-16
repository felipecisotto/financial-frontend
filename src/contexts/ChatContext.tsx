import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  sessionId: string
  isLoading: boolean
  hasInitialized: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clearChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const addMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const setInitialized = useCallback((initialized: boolean) => {
    setHasInitialized(initialized)
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setHasInitialized(false)
    setIsLoading(false)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessionId,
        isLoading,
        hasInitialized,
        addMessage,
        setLoading,
        setInitialized,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}