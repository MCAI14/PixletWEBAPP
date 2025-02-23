# WhatsApp Clone

This project is a clone of the popular messaging application, WhatsApp. It is built using React and TypeScript, providing a modern and responsive user interface for chatting.

## Features

- Real-time messaging
- User authentication
- Chat interface with message display and input handling
- Responsive design

## Project Structure

```
whatsapp-clone
├── src
│   ├── components
│   │   └── Chat.tsx        # Chat component for managing chat interface
│   ├── pages
│   │   └── Home.tsx        # Main page rendering the Chat component
│   ├── services
│   │   └── api.ts          # API service for sending and receiving messages
│   ├── App.tsx             # Main application component with routing
│   └── index.tsx           # Entry point of the application
├── public
│   └── index.html          # Main HTML file for the application
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd whatsapp-clone
npm install
```

## Usage

To run the application in development mode, use the following command:

```bash
npm start
```

This will start the development server and open the application in your default web browser.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.