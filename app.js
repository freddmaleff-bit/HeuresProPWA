// Données locales
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Ajouter une entrée
document.getElementById('add-entry').addEventListener('click', () => {
  const date = new Date().toLocaleDateString();
  const company = document.getElementById('company').value;
  const site = document.getElementById('site').value;
  const start = document.getElementById('start').value;
  const lunch = parseInt(document.getElementById('lunch').value) || 0;
  const end = document.getElementById('end').value;

  if (!site || !start || !end) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const total = calculateTotal(start, end, lunch);
  const entry = { date, company, site, start, lunch, end, total };
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderHistory();
});

// Calcul total net
function calculateTotal(start, end, lunch) {
  const [h1,m1] = start.split(':').map(Number);
  const [h2,m2] = end.split(':').map(Number);
  let totalMinutes = (h2*60 + m2) - (h1*60 + m1) - lunch;
  return (totalMinutes/60).toFixed(2);
}

// Affichage de l'historique
function renderHistory() {
  const tbody = document.getElementById('history-body');
  tbody.innerHTML = '';
  entries.forEach((e, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.company}</td>
      <td>${e.site}</td>
      <td>${e.start}</td>
      <td>${e.lunch}</td>
      <td>${e.end}</td>
      <td>${e.total}</td>
      <td><button onclick="deleteEntry(${i})">Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteEntry(index) {
  if(confirm("Supprimer cette entrée ?")) {
    entries.splice(index,1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderHistory();
  }
}

// TODO: Export PDF (utiliser jsPDF plus tard)
document.getElementById('export-weekly').addEventListener('click', () => {
  alert("Export hebdomadaire PDF (à implémenter)");
});
document.getElementById('export-monthly').addEventListener('click', () => {
  alert("Export mensuel PDF (à implémenter)");
});

// Affichage initial
renderHistory();