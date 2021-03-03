const login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("userType").value;

  if (!email || !password) {
    alert("Please enter both your email and password");
    return;
  }

  const data = { email, password, userType };

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      sessionStorage.setItem("token", data.token);
      if (userType === "student") {
        window.location.href = "/index.html";
        return;
      }else if (userType === "tutor") {
        return;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
