const { io } = require('socket.io-client');

// Connect to your Socket.IO server
const socket = io('http://localhost:3000', {
  transports: ['websocket'] // optional, forces WS instead of polling
});

// When connected
socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);

  // Send a test event
  socket.emit('orderPlaced', {
    orderId: '12345',
    customer: 'John Doe',
    items: ['Pizza', 'Coke']
  });
});

// Listen for server's welcome message
socket.on('welcome', (data) => {
  console.log('📩 Welcome from server:', data);
});

// Listen for new orders (could be your own or from others)
socket.on('newOrder', (order) => {
  console.log('🛒 New order broadcast:', order);
});

// Listen for order locked
socket.on('orderLocked', (data) => {
  console.log('🔒 Order locked:', data);
});

// Handle disconnect
socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});
