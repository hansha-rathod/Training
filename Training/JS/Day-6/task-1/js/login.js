$(document).ready(function () {
  $("#loginBtn").on("click", function () {
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (!email || !password) {
      $("#errorMsg").text("Email and password required");
      return;
    }

    $.ajax({
      url: "http://trainingsampleapi.satva.solutions/api/auth/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        Email: email,
        Password: password
      }),
      success: function (res) {
        localStorage.setItem("token", res.token);
        window.location.href = "transactions.html";
      },
      error: function () {
        $("#errorMsg").text("Invalid credentials");
      }
    });
  });
});
