function exportPDF() {
    var doc = new jsPDF();

    // Crée l'image du logo
    let img = new Image();
    img.src = "logo-pro-paysage.png"; // ⚠️ fichier dans le même dossier que index.html et app.js

    img.onload = function() {

        // --- Logo ---
        doc.addImage(img, "PNG", 15, 5, 40, 15); // x, y, largeur, hauteur

        // --- Titre ---
        doc.setFontSize(18);
        doc.setTextColor(0, 153, 0); // vert
        doc.text("Pro Paysage", 60, 15);

        // --- Nom employé ---
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Nom employé : " + employeeName, 15, 30);

        // --- Date de la semaine ---
        doc.text("Semaine du : " + weekStartStr, 15, 37);

        // --- Tableau des journées ---
        let startY = 45; // position verticale initiale
        const lineHeight = 10;
        jours.forEach((jour, index) => {
            let y = startY + index * lineHeight;
            let texte = `${jour.date} | Chantier: ${jour.chantier} | Entrée: ${jour.heureEntree} | Dîner: ${jour.diner} | Sortie: ${jour.heureSortie} | Total: ${jour.totalJour} h`;
            doc.text(texte, 15, y);
        });

        // --- Total semaine et banque ---
        doc.setFontSize(14);
        doc.text(`Total semaine : ${totalSemaine} h / 40 h`, 15, startY + jours.length * lineHeight + 10);
        doc.text(`Banque : ${banqueHeures.toFixed(2)} h`, 15, startY + jours.length * lineHeight + 20);

        // --- Enregistre le PDF ---
        doc.save("rapport_" + employeeName + "_" + weekStartStr + ".pdf");
    };
}
