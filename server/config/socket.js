const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {User} = require('../models/user');
const {Message} = require('../models/message');
const {generateMessage} = require('./helper');

		io.on('connection', (socket) => {
				console.log('connected!!');
				socket.on('disconnect', () => {
						console.log('server disconnected!!');
				});

				socket.on('join', (params) => {
						//ルームID生成の比較するためにIDを数字に変換
						const firstId = parseInt(params.userId.slice(0, 14), 16);
						const secondId = parseInt(params.youId.slice(0, 14), 16);
						let roomId;
						//IDが若い方を先に足したルームIDを作る
						if (firstId < secondId) {
								roomId = params.userId + params.roomId + params.youId;
						} else {
								roomId = params.youId + params.roomId + params.userId;
						}
						socket.join(roomId);
				});

				socket.on("createMessage", async (message) => {
						const user = await User.findById(message.from);
						const firstId = parseInt(message.from.slice(0, 14), 16);
						const secondId = parseInt(message.youId.slice(0, 14), 16);
						if (firstId < secondId) {
								roomId = message.from + message.roomId + message.youId;
						} else {
								roomId = message.youId + message.roomId + message.from;
						}

						if (!user) {

						}
						const newMessage = new Message({
								user: user._id,
								toUser: message.youId,
								message: message.text,
								roomId: roomId
						});

						newMessage.save().then(m => {
								io.to(roomId).emit("newMessage", generateMessage(user.icon, message.text, m.createdAt));
						});
				});
		});


		module.exports = {io, app, server};
