const logger = require('../utils/logger')('chatbot')
const messageReplies = [
    { pattern: /^hi$/i, reply: "Hello! How can I help you?" },
    { pattern: /^hello$/i, reply: "Hi there! How can I assist you?" },
    { pattern: /help/i, reply: "Sure, I'm here to help. What can I do for you?" },
    // Add more patterns and corresponding replies here
    {
      pattern: /.*/,
      reply:
        "I'm sorry, I don't understand your message. Please contact us at test@gmail.com.",
    },
  ];
   
  exports.chatBot = async (req, res) => {
    try {
        console.log("--->",req.body)
      const userMessage = req.body.message.toLowerCase();
   
      let reply = "I'm not sure how to respond to that.";
   
      // Find a matching pattern and get the corresponding reply
      for (const { pattern, reply: responseMessage } of messageReplies) {
        if (pattern.test(userMessage)) {
          reply = responseMessage;
          break;
        }
      }
      logger.info();
      logger.info(`Replying with: ${reply}`);
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }