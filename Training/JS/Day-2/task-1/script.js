$(function () {

  /* ---------- Look Ahead Data ---------- */
  const states = ["Gujarat", "Maharashtra", "Rajasthan", "Karnataka", "Tamil Nadu"];
  const cities = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Rajasthan: ["Jaipur", "Udaipur"],
    Karnataka: ["Bangalore", "Mysore"],
    "Tamil Nadu": ["Chennai", "Coimbatore"]
  };

  $("#state").autocomplete({
    source: states,
    select: function (e, ui) {
      $("#city").val("");
      $("#city").autocomplete({
        source: cities[ui.item.value] || []
      });
    }
  });

  /* ---------- Utility Functions ---------- */
  function showError(input, message) {
    input.next(".error").remove();
    input.after(`<small class="error text-danger">${message}</small>`);
  }

  function clearError(input) {
    input.next(".error").remove();
  }

  /* ---------- Field Validations ---------- */
  function validateName() {
    const el = $("#name");
    if (el.val().trim().length < 3) {
      showError(el, "Name must be at least 3 characters");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateMobile() {
    const el = $("#mobile");
    if (!/^\d{10}$/.test(el.val())) {
      showError(el, "Mobile must be 10 digits");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateEmail() {
    const el = $("#email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.val())) {
      showError(el, "Invalid email address");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateCollege() {
    const el = $("#college");
    if (el.val().trim() === "") {
      showError(el, "College name required");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateCGPA() {
    const el = $("#cgpa");
    const value = parseFloat(el.val());
    if (isNaN(value) || value < 0 || value > 10) {
      showError(el, "CGPA must be between 0 and 10");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateBranch() {
    const el = $("#branch");
    if (el.val().trim() === "") {
      showError(el, "Branch required");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateStateCity() {
    const state = $("#state");
    const city = $("#city");

    if (!states.includes(state.val())) {
      showError(state, "Select a valid state");
      return false;
    }

    if (!cities[state.val()]?.includes(city.val())) {
      showError(city, "Select a valid city");
      return false;
    }

    clearError(state);
    clearError(city);
    return true;
  }

  function validateZip() {
    const el = $("#zip");
    if (!/^\d{6}$/.test(el.val())) {
      showError(el, "ZIP must be 6 digits");
      return false;
    }
    clearError(el);
    return true;
  }

  function validateDates() {
    const from = $("#fromDate").val();
    const to = $("#toDate").val();

    if (!from || !to || from > to) {
      alert("Invalid date range");
      return false;
    }
    return true;
  }

  /* ---------- Master Validation ---------- */
  function validateForm() {
    return (
      validateName() &&
      validateMobile() &&
      validateEmail() &&
      validateCollege() &&
      validateCGPA() &&
      validateBranch() &&
      validateStateCity() &&
      validateZip() &&
      validateDates()
    );
  }

  /* ---------- Add New ---------- */
  $("#addNew").click(function () {
    $(".error").remove();

    if (!validateForm()) return;

    const record = {
      name: $("#name").val(),
      mobile: $("#mobile").val(),
      email: $("#email").val(),
      college: $("#college").val(),
      cgpa: $("#cgpa").val(),
      branch: $("#branch").val(),
      state: $("#state").val(),
      city: $("#city").val(),
      zip: $("#zip").val(),
      duration: $("#fromDate").val() + " to " + $("#toDate").val()
    };

    let data = JSON.parse(localStorage.getItem("students")) || [];
    data.push(record);
    localStorage.setItem("students", JSON.stringify(data));

    $("#studentForm")[0].reset();
    alert("Record added successfully");
  });

  /* ---------- Export ---------- */
  $("#export").click(function () {
    let data = JSON.parse(localStorage.getItem("students")) || [];
    $("#tableBody").html("");

    data.forEach(d => {
      $("#tableBody").append(`
        <tr>
          <td>${d.name}</td>
          <td>${d.mobile}</td>
          <td>${d.email}</td>
          <td>${d.college}</td>
          <td>${d.cgpa}</td>
          <td>${d.branch}</td>
          <td>${d.state}</td>
          <td>${d.city}</td>
          <td>${d.zip}</td>
          <td>${d.duration}</td>
        </tr>
      `);
    });
  });

  /* ---------- Clear Storage ---------- */
  $("#clearStorage").click(function () {
    if (confirm("Are you sure?")) {
      localStorage.removeItem("students");
      $("#tableBody").html("");
    }
  });

});
