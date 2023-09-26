// main.js
document.addEventListener('DOMContentLoaded', function () {
  AOS.init();
});

document.addEventListener("DOMContentLoaded", function () {
const form = document.getElementById("urlTestForm");
const resultDiv = document.getElementById("testResult");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const targetUrl = document.getElementById("targetUrl").value;

  fetch("/test-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUrl }),
  })
    .then((res) => res.text())
    .then((data) => {
      resultDiv.innerHTML = data;
      resultDiv.style.color = 'green';  // Green for success
    })
    .catch((error) => {
      resultDiv.innerHTML = `An error occurred: ${error}`;
      resultDiv.style.color = 'red';  // Red for error
    });    
});
});