
const cookies = document.cookie.split("; ");
let operator_name = "undefined";
let login_time = "undefined";
for (let cookie of cookies) {
  const [key, value] = cookie.split("=");
  if (key === "operator") {
    operator_name = decodeURIComponent(value);
    let returnText = document.getElementById("operator_name");
    returnText.innerHTML = `Operator: ${operator_name}`;
  } else if (key === "login_time") {
    val = decodeURIComponent(value);
    login_time = val.replace('T', ' ').replaceAll('-', '').replaceAll(':', '').split('.')[0];
  }
}

function logout() {
  document.cookie = "operator=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/login";
}

function setWatermark(name, time) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 4); // 45° diagonally
  ctx.fillText(`${name} ${time} `, 0, 0);

  const overlay = document.getElementById('watermark-overlay');
  overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
}

// Set your watermark text here
setWatermark(operator_name, login_time);
