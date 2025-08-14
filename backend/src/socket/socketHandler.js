const jwt = require('jsonwebtoken');
const devConfig = require('../config/dev.config');
const OrderModel = require('../model/orderModel');
const userModel = require('../model/userModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.emit('welcome', { message: 'Welcome to Quick Commerce!' });

    // ----------------- PARTNER -----------------
    socket.on('joinPartnersRoom', async (token) => {
      try {
        const decoded = jwt.verify(token, devConfig.JWT_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user || user.roles !== 'Partner') return;

        socket.join('partners');

        const myLockedOrders = await OrderModel.find({
          locked: true,
          partnerId: user._id,
          "OrderStatus.Delivered": { $ne: true },
        });

        const unassignedOrders = await OrderModel.find({ locked: false });

        socket.emit('yourOrders', [...myLockedOrders, ...unassignedOrders]);

        myLockedOrders.forEach((order) => {
          const roomName = `order_${order._id}`;
          socket.join(roomName);
          socket.emit('orderLocked', { orderId: order._id, partnerId: user._id });
          io.to('admins').emit('orderLocked', { orderId:order._id, partnerId: user._id });
        });
      } catch (err) {
        console.error('Error in joinPartnersRoom:', err);
      }
    });

    // ----------------- ADMIN -----------------
    socket.on('joinAdminsRoom', async (token) => {
      try {
        const decoded = jwt.verify(token, devConfig.JWT_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user || user.roles !== 'Admin') return;

        socket.join('admins');

        const allOrders = await OrderModel.find({});
        socket.emit('allOrders', allOrders);
      } catch (err) {
        console.error('Error in joinAdminsRoom:', err);
      }
    });

    // ----------------- CUSTOMER -----------------
    socket.on('joinOrderRoom', (orderId) => {
      const roomName = `order_${orderId}`;
      socket.join(roomName);
    });

    socket.on('orderPlaced', async (orderId) => {
      try {
        const order = await OrderModel.findById(orderId);
        if (!order) return;

        const roomName = `order_${order._id}`;
        socket.join(roomName);

        io.to('partners').emit('newOrder', order);
        io.to('admins').emit('newOrder', order);
      } catch (err) {
        console.error('Error in orderPlaced:', err);
      }
    });

    socket.on('lockOrder', async ({ orderId, token }) => {
      try {
        const order = await OrderModel.findById(orderId);
        if (!order || order.locked) return;

        const decoded = jwt.verify(token, devConfig.JWT_KEY);
        const user = await userModel.findById(decoded._id);
        if (!user || user.roles !== 'Partner') return;

        order.locked = true;
        order.partnerId = user._id;
        await order.save();

        const roomName = `order_${order._id}`;
        socket.join(roomName);

        socket.to('partners').emit('orderLocked', { orderId, partnerId: user._id });
        io.to(roomName).emit('orderLocked', { orderId, partnerId: user._id });
        io.to('admins').emit('orderLocked', { orderId, partnerId: user._id });

        socket.emit('orderLockedSelf', { orderId, order });
      } catch (err) {
        console.error('Error in lockOrder:', err);
      }
    });

    socket.on('updateOrderStatus', async ({ orderId, status, token }) => {
      try {
        const order = await OrderModel.findById(orderId);
        if (!order) return;

        const decoded = jwt.verify(token, devConfig.JWT_KEY);
        if (decoded._id.toString() !== order.partnerId.toString()) return;

        order.OrderStatus = { ...order.OrderStatus, ...status };
        await order.save();

        const roomName = `order_${order._id}`;
        io.to(roomName).emit('orderStatusUpdated', order);
        io.to('admins').emit('orderStatusUpdated', order);

        if (status.Delivered) {
          io.socketsLeave(roomName);
        }
      } catch (err) {
        console.error('Error in updateOrderStatus:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
