const token = sessionStorage.getItem("token");
console.log("Token", token);
if (!token) {
  window.location.href = "/login.html";
}

const joinChat = async () => {
  const topic = document.getElementById("subject").value;
  try {
      const session = await createSession(topic);
      console.log(session);
  } catch (err) {
      console.error(err);
  }
  window.location.href = "/chat.html";
};

const createSession = (subTopic) => {
  const data = { subTopic };
  return fetch("/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    //conversts data into a JSON string - stringify
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
