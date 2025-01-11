# Operating System Demo Kit 🚀

An interactive learning platform for understanding operating system concepts, algorithms, and practical implementations.

![OS Demo Kit](https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80&w=1740&h=400)

## 🌟 Features

- **CPU Scheduling Algorithms**

  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Round Robin
  - Priority Scheduling
- **Page Replacement Algorithms**

  - First In First Out (FIFO)
  - Least Recently Used (LRU)
  - Optimal Replacement
- **Linux Command Terminal**

  - Interactive command execution
  - Real-time output display
  - Common commands guide
- **Comprehensive Documentation**

  - Operating System concepts
  - Algorithm explanations
  - Implementation details

## 🛠️ Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- Lucide Icons
- Docker
- Python 3

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Development Setup

1. Clone the repository

```bash
git clone https://github.com/Dyr0tH/OS-demo-KIT.git
cd os-demo-kit
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Deployment

1. Build the project

```bash
npm run build
```

2. Preview the production build locally

```bash
npm run preview
```

3. Deploy the `dist` folder to your preferred hosting platform

## 🌐 API Server Setup (For Linux Terminal)

The Linux terminal feature requires a backend server running on port 5000.

1. Set up the server (requires docker)

```bash
docker build -t linux-command-executor .

docker run -d -p 5000:5000 --name linux-command-executor linux-command-executor
```

The API server will run on `http://localhost:5000`

## 📖 Project Structure

```
os-demo-kit/
├── src/
│   ├── components/         # React components
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
└── package.json          # Project dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Shahid Ali**

- GitHub: [@Dyr0tH](https://github.com/Dyr0tH)
- Email: shahid.ali.2004.12@gmail.com

## 🌟 Acknowledgments

- Special thanks to all contributors
- Inspired by modern operating system concepts
- Built with ❤️ using React and TypeScript
