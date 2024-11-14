// Function to verify if the user is logged in (has a valid token)
async function checkLogin() {
  const token = sessionStorage.getItem("token");

  // If there is no token, redirect to the login page
  if (!token) {
    window.location.href = "../login/login.html";
    return;
  }

  try {
    // Make a request to a protected endpoint to verify the token
    const response = await fetch("https://capy-lingo-backend.vercel.app/api/verify-token", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      // If the token is invalid or expired, redirect to the login page
      window.location.href = "../login/login.html";
    } else {
      // Access the protected page
      const decoded = decodeJwt(token);
      console.log("User ID:", decoded.userId);
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    window.location.href = "../login/login.html";
  }
}

// Function to decode JWT (to check its contents)
function decodeJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Function to check if the token is expired
function isTokenExpired(decodedToken) {
  const expTime = decodedToken.exp * 1000; // Expiration time in milliseconds
  const currentTime = Date.now();
  return currentTime >= expTime;
}
// Function to handle user logout
function logout() {
  // Clear user session data from sessionStorage
  sessionStorage.removeItem("level");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("token"); // Assuming you store the token in sessionStorage

  // Redirect the user to the login page or home page
  window.location.href = "../index.html"; // You can redirect to your desired page
}

// Call the function to check login when the page loads
checkLogin();
