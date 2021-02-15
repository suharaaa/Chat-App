const joinChat = () => {
    const username =  document.getElementById('username').value;
    console.log(username);
    localStorage.setItem('username', username);
    window.location.href = '/chat.html';
}