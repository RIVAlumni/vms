function login(e) {
  e.preventDefault();
  const op = document.getElementById("operator").value;
  fetch("/login", {
    method: "POST",
    body: new URLSearchParams({ operator: op })
  }).then(() => window.location.href = "/");
}
