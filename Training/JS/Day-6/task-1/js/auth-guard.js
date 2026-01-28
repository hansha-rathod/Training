// If there is NO JWT token stored in the browser...send the user back to the login page.
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
})();
