document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const usernameInput = document.querySelector("input[type='text']");
  const passwordInput = document.querySelector("input[type='password']");

  // Tangani pengiriman formulir login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
      alert("Please fill in both fields");
      return;
    }

    try {
      // Kirim data login ke server
      const response = await fetch("https://capy-lingo-backend.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Simpan data pengguna yang sudah login di sessionStorage
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("userId", result.userId);
        sessionStorage.setItem("username", result.username);
        sessionStorage.setItem("level", result.level); // Menyimpan level pengguna

        // Arahkan ke halaman belajar berdasarkan level
        const level = result.level;
        window.location.href = `../belajar/level${level}.html`; // Menyesuaikan dengan level
      } else {
        // Tampilkan pesan error
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  });
});
