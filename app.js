let employeeName = "Nom employé";
let weekStartStr = "2026-02-28";
let jours = [];
let totalSemaine = 0;
let banqueHeures = 0;

function ajouterJour(date, chantier, heureEntree, diner, heureSortie) {
    const totalJour = calculerTotalJour(heureEntree, diner, heureSortie);
    jours.push({date, chantier, heureEntree, diner, heureSortie, totalJour});
    calculerTotaux();
    afficherJours();
}

function calculerTotalJour(heureEntree, diner, heureSortie) {
    let entree = parseFloat(heureEntree);
    let sortie = parseFloat(heureSortie);
    let total = sortie - entree - parseFloat(diner);
    return total;
}

function calculerTotaux() {
    totalSemaine = jours.reduce((sum, j) => sum + j.totalJour, 0);
    banqueHeures = totalSemaine > 40 ? totalSemaine - 40 : 0;
}

function afficherJours() {
    const tbody = document.getElementById("table-body");
    if(!tbody) return;
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
    const totalEl = document.getElementById("total-semaine");
    if(totalEl) totalEl.innerText = totalSemaine;
    const banqueEl = document.getElementById("banque-heures");
    if(banqueEl) banqueEl.innerText = banqueHeures.toFixed(2);
}

function exportPDF() {
    var doc = new jsPDF();
    let img = new Image();
    img.src = "logo-pro-paysage.png";
    img.onload = function() {
        doc.addImage(img, "PNG", 15, 5, 40, 15);
        doc.setFontSize(18);
        doc.setTextColor(0, 153, 0);
        doc.text("Pro Paysage", 60, 15);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Nom employé : " + employeeName, 15, 30);
        doc.text("Semaine du : " + weekStartStr, 15, 37);
        let startY = 45;
        const lineHeight = 10;
        jours.forEach((jour, index) => {
            let y = startY + index * lineHeight;
            let texte = `${jour.date} | Chantier: ${jour.chantier} | Entrée: ${jour.heureEntree} | Dîner: ${jour.diner} | Sortie: ${jour.heureSortie} | Total: ${jour.totalJour} h`;
            doc.setTextColor(0, 0, 0);
            doc.text(texte, 15, y);
        });
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 0);
        doc.text(`Total semaine : ${totalSemaine} h / 40 h`, 15, startY + jours.length * lineHeight + 10);
        doc.text(`Banque : ${banqueHeures.toFixed(2)} h`, 15, startY + jours.length * lineHeight + 20);
        doc.save("rapport_" + employeeName + "_" + weekStartStr + ".pdf");
    };
}
