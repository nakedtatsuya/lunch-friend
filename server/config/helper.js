const generateMessage = (from, text, time) => {
		return {
				from,
				text,
				time
		}
};

module.exports = {generateMessage};