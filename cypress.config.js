const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // Add environment variables to Cypress config
      config.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      config.env.OPENAI_API_URL = process.env.OPENAI_API_URL;
      
      return config;
    },
  },
};
