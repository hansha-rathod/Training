let currentStep = 0;
const steps = document.querySelectorAll(".step");
const dots = document.querySelectorAll("#stepDots span");

function showStep(index) {
  steps.forEach(step => step.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  steps[index].classList.add("active");
  dots[index].classList.add("active");

  if (index === 4) populateSummary();
}

function next() {
  if (!validate()) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prev() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function validate() {
  // HTML required + pattern validation
  const inputs = steps[currentStep].querySelectorAll("input, select");

  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }

  // Extra JS email validation (Step 2)
  if (currentStep === 1) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net)$/;

    if (!emailRegex.test(email)) {
      alert("Email must be valid and end with .com, .in, .org, etc.");
      return false;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return false;
    }
  }

  return true;
}

function populateSummary() {
  summary.innerHTML = `
    <tr><td>First Name</td><td>${fname.value}</td></tr>
    <tr><td>Last Name</td><td>${lname.value}</td></tr>
    <tr><td>Gender</td><td>${gender.value}</td></tr>
    <tr><td>Zip</td><td>${zip.value}</td></tr>
    <tr><td>Email</td><td>${email.value}</td></tr>
    <tr><td>Username</td><td>${username.value}</td></tr>
    <tr><td>Bank</td><td>${bank.value}</td></tr>
    <tr><td>Branch</td><td>${branch.value}</td></tr>
    <tr><td>Account</td><td>${account.value}</td></tr>
    <tr><td>Card Holder</td><td>${cardName.value}</td></tr>
    <tr><td>Card Number</td><td>${cardNumber.value}</td></tr>
    <tr><td>Expiry</td><td>${expiry.value}</td></tr>
  `;
}

function save() {
  alert("All details saved successfully!");
}
