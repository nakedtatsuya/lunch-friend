const profileBtn = document.getElementById('profile-btn');
const blogBtn = document.getElementById('lunch-blog-btn');
const profileBox = document.getElementById('profile-box');
const blogBox = document.getElementById('blog-box');

const profileOrBlog = document.getElementById('profileOrBlog');

profileBtn.addEventListener('click', e => {
		profileBox.style.display = 'block';
		blogBox.style.display = 'none';
		blogBtn.classList.remove('active');
		profileBtn.classList.add('active');
});

blogBtn.addEventListener('click', e => {
		profileBox.style.display = 'none';
		blogBox.style.display = 'block';
		profileBtn.classList.remove('active');
		blogBtn.classList.add('active');
});