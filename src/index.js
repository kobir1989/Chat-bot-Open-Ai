import dotenv from 'dotenv'
import readlineSync from 'readline-sync'
import colors from 'colors'

import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(configuration)

export default openai

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot Program!'))
  console.log(colors.bold.green('You can start chatting with the bot.'))

  const chatHistory = [] // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '))

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content
      }))

      // Add latest user input
      messages.push({ role: 'user', content: userInput })

      // Call the API with user input & history
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages
      })

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText)
        return
      }

      console.log(colors.green('Bot: ') + completionText)

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput])
      chatHistory.push(['assistant', completionText])
    } catch (error) {
      console.error(colors.red(error))
    }
  }
}

main()
