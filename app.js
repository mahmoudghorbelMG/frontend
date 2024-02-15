const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.FRONTEND_PORT || 8080;
const backendHost = process.env.BACKEND_HOST || 'localhost';
const backendPort = process.env.BACKEND_PORT || 3000;
const version = process.env.VERSION || '1.0';
const color = process.env.COLOR || 'green';


// Initialize the array to store the history of messages
let messageHistory = [];
let message_color;

app.get('/', (req, res) => {
  message_color = (color === 'blue') ? 'lightblue' : (color === 'green') ? 'lightgreen' : 'lightred';
  const html = `
    <html>
      <head>
        <title>Frontend (version: ${version}, color: ${color})</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          button { padding: 10px 20px; font-size: 16px; }
          #response { margin-top: 20px; text-align: left; }
          .new-message { background-color: ${message_color}; padding: 5px; margin-bottom: 5px; }
          .old-message { background-color: #f2f2f2; padding: 5px; margin-bottom: 5px; }
          .bold-text { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Frontend (version: ${version}, color: ${color}) (backend: ${backendHost})</h1>
        <button onclick="sendRequest()">Send Request to Backend</button>
        <div id="response"></div>

        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

        <script>
          // Ensure messageHistory is defined
          let messageHistory = [];

          async function sendRequest() {
            try {
              const response = await axios.get(\`http://${backendHost}:${backendPort}\`);

              // Add the new message to the top of the history
              messageHistory.unshift(response.data);
              
              // Display the message history with appropriate styling
              const responseDiv = document.getElementById('response');
              responseDiv.innerHTML = messageHistory.map((message, index) => {
                // Use different classes for new and old messages
                const messageClass = index === 0 ? 'new-message' : 'old-message';

                // Replace text inside brackets with bold text
                //message = message.replace(/\((.*?)\)/g, '<span class="bold-text">$1</span>');
              

                return '<div class="' + messageClass + '">' + message + '</div>';
              }).join('');
            } catch (error) {
              console.error('Error communicating with the backend:', error.message);
              document.getElementById('response').innerText = 'Error communicating with the backend';
            }
          }
        </script>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Frontend microservice listening at http://localhost:${port}`);
});
