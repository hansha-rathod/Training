function addTwoNumbers(a, b) {
    return a + b;
  }
  
  function addCommaSeparatedNumbers(value) {
    if (!value) return 0;
  
    return value
      .split(",")
      .map(v => Number(v.trim())) //map converts str vals to num vals of array (& trim extra white spaces)
      .reduce((sum, num) => sum + num, 0); //reduces array to a single value
  }
  
  function calculate() {
    const t1 = Number(document.getElementById("t1").value) || 0;
    const t2 = Number(document.getElementById("t2").value) || 0;
    const t3Input = document.getElementById("t3").value;
  
    const t1t2 = addTwoNumbers(t1, t2);
    const t3Sum = addCommaSeparatedNumbers(t3Input);
    const finalTotal = t1t2 + t3Sum;
  
    document.getElementById("ans").value =
      `${t1t2} | ${t3Sum} | ${finalTotal}`;
  }
  