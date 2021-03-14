const urlParams = new URLSearchParams(window.location.search);
const socket = io({ query: "id=" + urlParams.get("id") });
// console.log(urlParams.get("id"));

// read token in session storage
const token = sessionStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

const payload = token.split(".")[1];
const decodedPayload = JSON.parse(atob(payload));
console.log(decodedPayload);

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
  ).innerHTML += `<p class="user-join"><small>${data.username} joined the chat!</small]></>`;
});
socket.on("user_typing", (data) => {
  document.getElementById(
    "typing-area"
  ).innerText = `${data.username} is typing...`;
  setTimeout(() => {
    document.getElementById("typing-area").innerText = "";
  }, 3000);
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
