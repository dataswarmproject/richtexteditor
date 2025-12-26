import '@digitaltrendz/core'

declare module '@digitaltrendz/core' {
  interface Commands<ReturnType> {
    aiAssistant: {
      /**
       * Open the AI assistant panel
       */
      openAIAssistant: (mode?: 'chat' | 'inline' | 'command') => ReturnType
      /**
       * Close the AI assistant panel
       */
      closeAIAssistant: () => ReturnType
      /**
       * Toggle the AI assistant panel
       */
      toggleAIAssistant: (mode?: 'chat' | 'inline' | 'command') => ReturnType
      /**
       * Send a message to the AI assistant
       */
      sendAIMessage: (message: string) => ReturnType
      /**
       * Execute an AI action by ID
       */
      executeAIAction: (actionId: string) => ReturnType
      /**
       * Execute an AI tool by name
       */
      executeAITool: (toolName: string, params?: Record<string, unknown>) => ReturnType
      /**
       * Clear all messages in the AI assistant
       */
      clearAIMessages: () => ReturnType
    }
  }
}
