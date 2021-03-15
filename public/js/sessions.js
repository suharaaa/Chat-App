const token = sessionStorage.getItem('token');

if (!token) {
    window.location.href = "/login.html";
}
// get sessions
const loadActiveSessions = () => fetch(
    '/sessions/state/open',
    {
        headers: new Headers({
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
        }),
    }
).then(response => response.json());

const sessionContainer = document.getElementById('sessionContainer');

loadActiveSessions().then(data => {
    data.forEach(session => {
        sessionContainer.innerHTML += `<li><small>${session._id}</small>  ${session.subTopic}  &nbsp;
        <button class="btn" onclick="joinSession('${session._id}')">Join Session</button></li>`
    });
});

const joinSession = id => {
    window.location.href = "/chat.html?id=" + id;
}
