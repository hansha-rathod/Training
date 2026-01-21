function calculateTax() {
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const income = Number(document.getElementById("income").value);
    const loan = Number(document.getElementById("loan").value);
    const investment = Number(document.getElementById("investment").value);
  
    if (!gender || income <= 0) {
      alert("Please enter valid details");
      return;
    }
  
    // Loan exemption
    const loanExempt = loan * 0.8;
    const loanTaxable = loan * 0.2;
  
    // Investment exemption
    const investExempt = Math.min(investment, 100000);
  
    let taxableIncome =
      income - loanExempt - investExempt;
  
    taxableIncome = taxableIncome < 0 ? 0 : taxableIncome;
  
    let tax = 0;
    let noTax = false;
  
    if (gender === "men") {
      if (taxableIncome <= 240000) noTax = true;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 240000) * 0.10;
      else tax = (600000 - 240000) * 0.10 + (taxableIncome - 600000) * 0.20;
    }
  
    if (gender === "women") {
      if (taxableIncome <= 260000) noTax = true;
      else if (taxableIncome <= 700000) tax = (taxableIncome - 260000) * 0.10;
      else tax = (700000 - 260000) * 0.10 + (taxableIncome - 700000) * 0.20;
    }
  
    if (gender === "senior") {
      if (taxableIncome <= 300000) noTax = true;
      else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.10;
      else tax = (700000 - 300000) * 0.10 + (taxableIncome - 700000) * 0.20;
    }
  
    document.getElementById("outName").innerText = name;
    document.getElementById("taxableAmount").innerText = taxableIncome.toFixed(2);
    document.getElementById("payableTax").innerText = tax.toFixed(2);
  
    const outputBox = document.getElementById("outputBox");
    outputBox.classList.toggle("no-tax", noTax);
  }
  
  function resetForm() {
    document.querySelectorAll("input, select").forEach(el => el.value = "");
    document.getElementById("taxableAmount").innerText = "";
    document.getElementById("payableTax").innerText = "";
    document.getElementById("outName").innerText = "";
  }
  