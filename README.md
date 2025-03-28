# Chess Website

This is a **Chess Website** built as a college project, designed to showcase scalability and efficient design choices using modern web technologies.

## Tech Stack

### **Frontend**

- [Next.js](https://nextjs.org/) with [shadcn/ui](https://ui.shadcn.com/)

### **Backend & Database**

- **PostgreSQL** – For user profiles, leaderboards, and structured data.
- **MongoDB** – For storing game history in a flexible format.
- **Redis** – For caching and real-time game state.

### **Real-time Communication**

- **Socket.io** – For handling live chess gameplay.

## Features

- **User Authentication** using Firebase Authentication.
- **Real-time Chess Gameplay** with WebSockets (Socket.io).
- **Game History Storage** with MongoDB.
- **Leaderboard System** with PostgreSQL.
- **High Performance** with Redis caching.
- **Smooth UI/UX** with Next.js and shadcn/ui components.

## Setup Instructions

### **Prerequisites**

Ensure you have the following installed:

- Node.js (Latest LTS)
- PostgreSQL
- MongoDB
- Redis

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-repo/chess-website.git
cd chess-website

# Install dependencies
npm install
```

### **Environment Variables**

Create a `.env` file in the root directory and configure it as follows:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
DATABASE_URL=
NODE_ENV=
REDIS_URL=
PORT=
HOSTNAME=
NEXT_PUBLIC_API_URL=
```

### **Run the Development Server**

```bash
npm run dev
```

### **Build for Production**

```bash
npm run build
npm start
```

## Deployment

You can deploy the project using platforms like:

- **Vercel** (Recommended for Next.js frontend)
- **Hostinger + Nginx** (For backend with PostgreSQL, MongoDB, and Redis)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
