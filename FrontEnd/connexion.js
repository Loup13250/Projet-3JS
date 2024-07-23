window.onload = function () {
  var loginLink = document.getElementById("loginLink");
  var token = getToken();
  if (token) {
    loginLink.textContent = "logout";
    loginLink.href = "index.html"; // Changer vers page de décon
  }
};

function getToken() {
  //
  return localStorage.getItem("token");
}
