const socket = io();
const generateMessage = (from, text, youId, roomId) => {
		return {from, text, youId, roomId}
};

//メッセージの中にURLがあればaタグをつける
const AutoLink = (str) => {
		const reg = new RegExp("((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))");
		return str.replace(reg, "<a href='$1' target='_blank'>$1</a>");
};

const scrollBottom = () => {
		const message = jQuery('#message');
		const scrollHeight = message.prop('scrollHeight');
		message.scrollTop(scrollHeight);
};

socket.on('connect', () => {
		console.log('Connected Server!!');
		const userId = document.getElementById('userId').value;
		const youId = document.getElementById('youId').value;
		const roomId = document.getElementById('roomId').value;
		socket.emit('join', {
				userId,
				youId,
				roomId
		});
});

socket.on('disconnect', () => {
		console.log('Disconnect Server!!');
});



socket.on('newMessage', m => {
		const time = moment(m.time).format('HH:mm');
		const li = document.createElement("li");
		li.innerHTML = `
							 <li class="message">
        				<div class="message__title">
            		<img src="${m.from}" class="chat-icon">
        				</div>
        				<div class="message__body">
														<span class="message-text">${AutoLink(m.text)}</span>
														<span class="send-time">${time}</span>
        				</div>
    				</li>
		`;
		const ol = document.getElementById("message");
		ol.appendChild(li);
		scrollBottom();
});

const input = document.getElementById('message-box');

const btn = document.getElementById('send-btn');
input.addEventListener('input', (e) => {
		if(e.target.value === "") {
				btn.disabled = true;
		}else {
				btn.disabled = false;
		}
});

document.getElementById('message-form').addEventListener('submit', (e) => {
		const userId = document.getElementById('userId').value;

		//hostではなく相手
		const youId = document.getElementById('youId').value;




		const roomId = document.getElementById('roomId').value;
		e.preventDefault();
		socket.emit('createMessage', generateMessage(userId, input.value, youId, roomId));
		input.value = "";
		btn.disabled = true;
});


window.addEventListener('load', scrollBottom);