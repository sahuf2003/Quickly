const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const devConfig = require('./src/config/dev.config')
const socketHandler = require('./src/socket/socketHandler'); // <-- import socket logic

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json());

require('./src/config/db.config');
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/customer', require('./src/routes/customerRoutes'));
app.use('/admin', require('./src/routes/adminRoutes'));

app.get('/', (req, res) => res.send('Quick Commerce Server'));
app.get('/health', (req, res) =>
  res.status(200).json({ message: 'Server is up & running', success: true })
);

// Initialize socket handlers
socketHandler(io);

server.listen(devConfig.PORT, () => {
  console.log('Server & Socket.IO running');
});
