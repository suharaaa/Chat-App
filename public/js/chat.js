const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const socket = io({ query: "id=" + id });

// console.log(urlParams.get("id"));

// read token in session storage
const token = sessionStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

const payload = token.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
console.log(decodedPayload);

// check if session is open
// get session from db
fetch('/sessions/'+id, {
  headers: new Headers({
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  })
}).then(response => response.json())
    .then(data => {
      if (!(data && (data.status === 'open' || data.status === 'active'))) {
        navigateBack();
      }
    });

if (decodedPayload.userType === 'student') {
  document.getElementById('btnLeave').style.visibility = "hidden";
}

// += means append to end of the string
socket.on("message", (data) => {
  console.log(data);
  document.getElementById("chat-messages").innerHTML += generateMsg(data);
});

const username = decodedPayload.username;
socket.emit("new_user", { username });

socket.on("new_user_join", (data) => {
  console.log(`${data.username} joined the chat`);
  document.getElementById(
    "chat-messages"
  ).innerHTML += `<p class="user-join"><small>${data.username} joined the chat!</small]></p><br>`;
});

socket.on("user_typing", (data) => {
  document.getElementById(
    "typing-area"
  ).innerText = `${data.username} is typing...`;
  setTimeout(() => {
    document.getElementById("typing-area").innerText = "";
  }, 3000);
});

socket.on("end_session", (data) => {
  document.getElementById(
      "chat-messages"
  ).innerHTML += `<p class="user-join"><small>Session ended by ${data.username}. Navigating back to home...</small]></p><br>`;
  setTimeout(() => {
    navigateBack();
  }, 3000)
});

socket.on("tutor_leave", (data) => {
  document.getElementById(
      "chat-messages"
  ).innerHTML += `<p class="user-join"><small>Tutor ${data.username} left the session. Notifying available tutors...</small]></p><br>`;
});

const generateMsg = (data) => `<div class="message">
<p class="meta">${data.username} <span>${formatDate(new Date())}</span></p>
<p class="text">
    ${data.message}
</p>
</div>`;

//generate date and time
const formatDate = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
};

const chatMessage = () => {
  const message = document.getElementById("msg").value;
  socket.emit("message", {
    message,
    username,
    userID: decodedPayload.userID,
    userType: decodedPayload.userType,
  });
};

const sendTypingEvent = () => {
  socket.emit("user_typing", { username });
};

const endSession = () => {
  socket.emit("end_session", { username, userType: decodedPayload.userType });
  fetch('/sessions/' + id, {
    method: 'PUT',
    headers: new Headers({
      Authorization: 'Bearer ' + token,
      "Content-Type": "application/json"
    })
  }).then(response => response.json())
      .then(data => {
        navigateBack();
      }).catch(err => console.error(err));
}

const leaveSession = () => {
  socket.emit("tutor_leave", { username });
  window.location.href = "/sessions.html";
}


const navigateBack = () => {
  if (decodedPayload.userType === "student") {
    window.location.href = "/index.html";
  } else {
    window.location.href = "/sessions.html"
  }
}
