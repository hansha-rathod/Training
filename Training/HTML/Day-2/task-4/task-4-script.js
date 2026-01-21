
const fileInput = document.getElementById("inputfile");
const result = document.getElementById("result");

fileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) {
    result.textContent = "";
    return;
  }

  if (file.type.startsWith("image/")) {
    //result.textContent = ";
    result.innerHTML ="File is Image <br> File type = "+ file.type.split('/')[1]; // file.type - img/png
    
  } else {
    result.innerHTML = "File is Not Image";
    
  }
});

