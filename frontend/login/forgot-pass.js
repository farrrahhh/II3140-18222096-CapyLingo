// Change Password Pop-Up Logic
const forgotPassLink = document.querySelector(".forgot-pass");
const popup = document.getElementById("change-password-popup");
const closePopupButton = document.getElementById("close-popup");

// Open pop-up
forgotPassLink.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("hidden");
});

// Close pop-up
closePopupButton.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Change Password Form Handler
const changePasswordForm = document.getElementById("change-password-form");
changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const oldPassword = document.getElementById("old-password").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  if (!username || !oldPassword || !newPassword) {
    alert("All fields are required.");
    return;
  }

  if (oldPassword === newPassword) {
    alert("New password cannot be the same as old password.");
    return;
  }

  try {
    const response = await fetch("https://capy-lingo-backend.vercel.app/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, oldPassword, newPassword }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Password changed successfully!");
      popup.classList.add("hidden");
    } else {
      alert(result.message || "Failed to change password. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
});
