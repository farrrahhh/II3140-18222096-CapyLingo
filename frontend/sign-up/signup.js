document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.querySelector("form");
  const usernameInput = document.querySelector("input[type='text']");
  const passwordInput = document.querySelector("input[type='password']");

  // Tangani pengiriman formulir sign-up
  signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
      alert("Please fill in both fields");
      return;
    }

    try {
      // Kirim data sign-up ke server
      const response = await fetch("https://capy-lingo-backend.vercel.app/api/signup", {
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
        // Tampilkan pesan sukses dan arahkan ke halaman login
        alert(result.message);
        window.location.href = "../login/login.html";
      } else {
        // Tampilkan pesan error jika ada
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An error occurred while signing up. Please try again.");
    }
  });
});
