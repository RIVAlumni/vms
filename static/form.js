function parseQR(val) {
  console.log(val);
  if (!val.includes("|")) return;
  let parts = val.split("|");
  console.log(parts);
  if (parts.length >= 4) {
    document.getElementById("nric").value = parts[1];
    document.getElementById("phone").value = parts[2];
    document.getElementById("fullname").value = parts[3];
  }
}
function submitForm(e) {
  e.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const nric = document.getElementById("nric").value;
  const phone = document.getElementById("phone").value;
  const data = new URLSearchParams({ fullname, nric, phone });
  fetch("/submit", { method: "POST", body: data })
    .then(res => res.json())
    .then(res => {
      if (res.status === "OK") {
        document.getElementById("status").textContent = `✅ Entry recorded for ${fullname} (${nric}, ${phone})`;
      } else {
        document.getElementById("status").textContent = `⚠️ Duplicate entry: (${nric}), ${res.fullname}, ${res.phone} at ${res.datetime} by ${res.operator}`;
      }
    });
}