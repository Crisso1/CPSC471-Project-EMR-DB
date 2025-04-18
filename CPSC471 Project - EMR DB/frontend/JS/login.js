document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then((data) => {
        // Assume a token is returned
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        const errorBox = document.getElementById("error");
        errorBox.textContent = err.message;
        errorBox.classList.remove("d-none");
      });
  });
