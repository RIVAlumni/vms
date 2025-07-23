function isoToLocal(iso) {
  const date = new Date(iso);
  return date.toLocaleString('sv-SE').replace('T', ' ');
}

const form = document.getElementById('search-form');
const tbody = document.getElementById('results-table-body');
const pagination = document.getElementById('pagination');
const pageSize=50;
let currentPage = 1;
let totalRecords = 0;
let totalPages = 0;
let results = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  loadTable(1);
});

function renderPagination() {
  pagination.innerHTML = '';
  let li = document.createElement('li');
  if (currentPage != 1) {
    li.className = "page-item";
    li.innerHTML = '<button class="page-link" onclick="prevPage()">Previous</button>';
    pagination.appendChild(li);
  }
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<button class="page-link" onclick="loadTable(${i})">${i}</button>`;
    pagination.appendChild(li);
  }
  if (currentPage != totalPages) {
    li = document.createElement('li');
    li.className = "page-item";
    li.innerHTML = '<button class="page-link" onclick="nextPage()">Next</button>';
    pagination.appendChild(li);
  }
}

async function loadTable(page = 1) {
  let data = Object.fromEntries(new FormData(form));
  data.page = currentPage = page;
  const params = new URLSearchParams(data).toString();
  const res = await fetch('/list?' + params);
  const response = await res.json();
  results = response["rows"];
  totalRecords = response["total_count"];
  totalPages = Math.ceil(totalRecords / pageSize);
  
  tbody.innerHTML = '';
  for (const r of results) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${isoToLocal(r[3])}</td>
      <td>${r[4]}</td>`;
    tbody.appendChild(row);
  }
  renderPagination();
}


function prevPage() { 
  if (currentPage > 1) loadTable(currentPage - 1); 
}
function nextPage() { 
  if (currentPage != totalPages) loadTable(currentPage + 1); 
}
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