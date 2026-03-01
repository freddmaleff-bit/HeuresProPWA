let jours = [];
let totalSemaine = 0;
let banqueHeures = 0;

function ajouterJour() {
    const employeeName = document.getElementById("employee-name").value || "Nom employé";
    const date = document.getElementById("date").value;
    const chantier = document.getElementById("chantier").value;
    const heureEntree = parseFloat(document.getElementById("heure-entree").value);
    const diner = parseFloat(document.getElementById("diner").value) || 0;
    const heureSortie = parseFloat(document.getElementById("heure-sortie").value);

    if (!date || !chantier || isNaN(heureEntree) || isNaN(heureSortie)) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const totalJour = heureSortie - heureEntree - diner;
    jours.push({date, chantier, heureEntree, diner, heureSortie, totalJour});
    calculerTotaux();
    afficherJours();
}

function calculerTotaux() {
    totalSemaine = jours.reduce((sum, j) => sum + j.totalJour, 0);
    banqueHeures = totalSemaine > 40 ? totalSemaine - 40 : 0;
}

function afficherJours() {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";
    jours.forEach(j => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${j.date}</td>
                        <td>${j.chantier}</td>
                        <td>${j.heureEntree}</td>
                        <td>${j.diner}</td>
                        <td>${j.heureSortie}</td>
                        <td>${j.totalJour}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById("total-semaine").innerText = totalSemaine.toFixed(2);
    document.getElementById("banque-heures").innerText = banqueHeures.toFixed(2);
}

function retirerBanque() {
    banqueHeures = 0;
    document.getElementById("banque-heures").innerText = banqueHeures;
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // logo
    const img = new Image();
    img.src = "logo-pro-paysage.png";
    img.onload = function() {
        doc.addImage(img, "PNG", 15, 5, 40, 15);

        // titre
        doc.setFontSize(18);
        doc.setTextColor(0, 153, 0);
        doc.text("Pro Paysage", 60, 15);

        // infos employé
        doc.setFontSize(12);
        doc.setTextColor(0,0,0);
        const employeeName = document.getElementById("employee-name").value || "Nom employé";
        doc.text("Nom employé : " + employeeName, 15, 30);
        doc.text("Total semaine : " + totalSemaine.toFixed(2) + " h", 15, 37);
        doc.text("Banque : " + banqueHeures.toFixed(2) + " h", 15, 44);

        // tableau
        let startY = 55;
        jours.forEach((jour, index) => {
            let y = startY + index * 10;
            let ligne = `${jour.date} | Chantier: ${jour.chantier} | Entrée: ${jour.heureEntree} | Dîner: ${jour.diner} | Sortie: ${jour.heureSortie} | Total: ${jour.totalJour.toFixed(2)} h`;
            doc.text(ligne, 15, y);
        });

        doc.save("HeuresProPaysage.pdf");
    };
}
