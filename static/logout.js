
const cookies = document.cookie.split("; ");
for (let cookie of cookies) {
	const [key, value] = cookie.split("=");
	if (key === "operator") {
		operator_name = decodeURIComponent(value);
		let returnText = document.getElementById("operator_name");
		returnText.innerHTML = `Operator: ${operator_name}`;
	}
}
function logout() {
  document.cookie = "operator=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/login";
}
