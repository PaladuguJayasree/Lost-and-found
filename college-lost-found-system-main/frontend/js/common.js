// Local dev: frontend served separately (file:// or another port) talks to the API on :5000.
// Deployed: frontend and API share one origin.
const BASE_URL = (location.protocol === "file:" ||
  (["localhost", "127.0.0.1"].includes(location.hostname) && location.port !== "5000"))
  ? "http://localhost:5000"
  : location.origin;

// Redirect to login if token missing
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

function goToLost() {
  window.location.href = "lost.html";
}

function goToFound() {
  window.location.href = "found.html";
}
