
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

function setWatermark(color = 'rgba(0, 0, 0, 0.1)') {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20px Arial';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 4); // 45° diagonally
  // Draw each line manually
  const lines = [operator_name, login_time];
  const lineHeight = 24;

  lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i - 0.5) * lineHeight);
  });

  const overlay = document.getElementById('watermark-overlay');
  overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
}