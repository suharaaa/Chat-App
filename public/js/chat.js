const toggleLoading = (isLoading) => {
  const chatContainer = document.getElementById('chatContainer');
  const loader = document.getElementById('loader');
  if(isLoading) {
    loader.style.visibility = "visible";
    chatContainer.style.visibility="hidden";
  } else {
    chatContainer.style.visibility="visible";
    loader.style.visibility = "hidden";
  }
}

toggleLoading(true);

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
      console.log(data);
      if (!(data && (data.status === 'open' || data.status === 'active'))) {
        navigateBack();
      }
      document.getElementById('room-name').innerHTML = data.subTopic;
      toggleLoading(false);
    }).catch(err => console.log(err));

const messageContainer = document.getElementById("chat-messages");
// get messages
fetch('/sessions/'+id+'/messages', {
  method: 'GET',
  headers: new Headers({
    Authorization: 'Bearer ' + token,
    "Content-Type": "application/json"
  })
}).then(response => response.json())
    .then(data => {
      if (typeof data === typeof []) {
        data.forEach(m => messageContainer.innerHTML += generateMsg({
          username: m.username,
          message: m.content
        }, new Date(m.createdAt)));
      }
    }).catch(err => console.error(err));



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

const generateMsg = (data, time = new Date()) => `<div class="message">
<p class="meta">${data.username} <span>${formatDate(time)}</span></p>
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

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function init() {
  canvas = document.getElementById('can');
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
  }, false);
  canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
  }, false);
  canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
  }, false);
  canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
  }, false);
}

function color(obj) {
  switch (obj.id) {
    case "green":
      x = "green";
      break;
    case "blue":
      x = "blue";
      break;
    case "red":
      x = "red";
      break;
    case "yellow":
      x = "yellow";
      break;
    case "orange":
      x = "orange";
      break;
    case "black":
      x = "black";
      break;
    case "white":
      x = "white";
      break;
  }
  if (x == "white") y = 14;
  else y = 2;

}

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = x;
  ctx.lineWidth = y;
  ctx.stroke();
  ctx.closePath();
  socket.emit('draw', { prevX, prevY, currX, currY, strokeStyle: 'green', lineWidth: y });
}

function drawOtherUser({ prevX, prevY, currX, currY, strokeStyle, lineWidth}) {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
}

function erase() {
  ctx.clearRect(0, 0, w, h);
  document.getElementById("canvasimg").style.display = "none";
}

function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = x;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res == 'up' || res == "out") {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
    }
  }
}

socket.on('draw', data => {
  drawOtherUser(data);
});

socket.on('erase', data => {
  drawOtherUser(data);
});

init();
