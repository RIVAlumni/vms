let currentPage = 1;
function loadTable(page = 1) {
  currentPage = page;
  const params = new URLSearchParams({
    page: currentPage,
    nric: document.getElementById("nricFilter").value,
    fullname: document.getElementById("fullnameFilter").value,
    phone: document.getElementById("phoneFilter").value,
    time: document.getElementById("timeFilter").value,
    opfilter: document.getElementById("opFilter").value
  });
  fetch(`/list?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("pageNum").textContent = currentPage;
      const tbody = document.querySelector("#visitorTable tbody");
      tbody.innerHTML = "";
      data.rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach((cell, idx) => {
          const td = document.createElement("td");
          if (idx === 3) td.textContent = new Date(cell).toLocaleString();
          else td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    });
}
function prevPage() { if (currentPage > 1) loadTable(currentPage - 1); }
function nextPage() { loadTable(currentPage + 1); }
function sortTable(n) {
  const table = document.getElementById("visitorTable");
  let rows, switching = true, dir = "asc", switchcount = 0;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (let i = 1; i < (rows.length - 1); i++) {
      let x = rows[i].getElementsByTagName("TD")[n];
      let y = rows[i + 1].getElementsByTagName("TD")[n];
      let shouldSwitch = dir == "asc" ? x.innerHTML > y.innerHTML : x.innerHTML < y.innerHTML;
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
        break;
      }
    }
    if (switchcount === 0 && dir === "asc") {
      dir = "desc"; switching = true;
    }
  }
}
const cookies = document.cookie.split("; ");
for (let cookie of cookies) {
	const [key, value] = cookie.split("=");
	if (key === "operator") {
		operator_name = decodeURIComponent(value);
		let returnText = document.getElementById("operator_name");
		returnText.innerHTML = `Operator: ${operator_name}`;
	}
}