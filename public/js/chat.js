const socket = io();
const generateMessage = (from, text) => {
		return {from, text}
};

function AutoLink(str) {
		const reg = new RegExp("((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))");
		return str.replace(reg, "<a href='$1' target='_blank'>$1</a>");
}
socket.on('connect', () => {
		console.log('Connected Server!!');
});

socket.on('disconnect', () => {
		console.log('Disconnect Server!!');
});



socket.on('newMessage', m => {
		const li = document.createElement("li");
		li.innerHTML = `${m.from}: ${AutoLink(m.text)}`;
		const ol = document.getElementById("message");
		ol.appendChild(li);
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
		e.preventDefault();
		socket.emit('createMessage', generateMessage("sdf", input.value));
		input.value = "";
		btn.disabled = true;
});

