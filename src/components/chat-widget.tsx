import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useChat } from '@/contexts/ChatContext'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { Bot, MessageSquareMoreIcon, Send, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export function ChatWidget() {
  const { messages, sessionId, isLoading, hasInitialized, addMessage, setLoading, setInitialized } = useChat()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = useCallback(async () => {
    if (hasInitialized) return

    setLoading(true)
    try {
      const response = await axios.post('https://n8n.felipecisotto.com.br/webhook/e8ae79d5-f290-4a64-8280-7ed336959e15', {
        text: 'Olá, fale quem você é e o que faz',
        session: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      addMessage({
        text: response.data.output || 'Olá! Como posso te ajudar?',
        isUser: false
      })
      setInitialized(true)
    } catch (error) {
      console.error('Erro ao inicializar chat:', error)

      addMessage({
        text: 'Olá! Como posso te ajudar?',
        isUser: false
      })
      setInitialized(true)
    } finally {
      setLoading(false)
    }
  }, [hasInitialized, sessionId, setLoading, addMessage, setInitialized])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      initializeChat()
    }
  }, [isOpen, hasInitialized, initializeChat])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const currentInput = inputValue
    addMessage({
      text: currentInput,
      isUser: true
    })
    setInputValue('')
    setLoading(true)

    try {
      const response = await axios.post('https://n8n.felipecisotto.com.br/webhook/e8ae79d5-f290-4a64-8280-7ed336959e15', {
        text: currentInput,
        session: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      addMessage({
        text: response.data.output || 'Desculpe, não consegui processar sua mensagem.',
        isUser: false
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)

      addMessage({
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        isUser: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 hover:scale-110"
        >
          <MessageSquareMoreIcon className="scale-150 text-2xl" size={48} />
          <span className="sr-only">Abrir chat</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto z-50">
      <Card className="w-full h-full gap-0 sm:w-96 sm:h-[28rem] sm:max-h-[28rem] shadow-xl transition-all duration-300 ease-in-out border p-0">
        <CardHeader className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Assistente Virtual</CardTitle>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20 transition-all hover:scale-110"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar chat</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col" style={{ height: 'calc(100% - 80px)' }}>
          <ScrollArea className="flex-1 min-h-0 px-4 py-3 bg-card/50">
            <div className="space-y-3">
              {messages.length === 0 && isLoading ? (
                <div className="flex justify-start">
                  <div className="bg-secondary/80 text-secondary-foreground p-3 rounded-lg text-sm mr-4 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 bg-secondary-foreground/20 rounded w-32"></div>
                      <div className="h-3 bg-secondary-foreground/20 rounded w-24"></div>
                      <div className="h-3 bg-secondary-foreground/20 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg text-sm",
                        message.isUser
                          ? "bg-primary text-primary-foreground ml-4"
                          : "bg-secondary/80 text-secondary-foreground mr-4"
                      )}
                    >
                      {message.isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic">{children}</blockquote>
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-secondary/80 text-secondary-foreground p-3 rounded-lg text-sm mr-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-secondary-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-secondary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-secondary-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 p-3 bg-background/95 backdrop-blur-sm rounded-b-lg">
            <div className="flex gap-2 items-end">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1 min-h-9 max-h-32 bg-background border-border/50 focus:border-primary/50 resize-none"
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3 h-9 mb-1"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}