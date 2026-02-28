let workDays = JSON.parse(localStorage.getItem("workDays")) || [];
let bankHours = JSON.parse(localStorage.getItem("bankHours")) || 0;
let employeeName = localStorage.getItem("employeeName") || "";

document.getElementById("employeeName").value = employeeName;

document.getElementById("employeeName").addEventListener("input", function () {
    employeeName = this.value;
    localStorage.setItem("employeeName", employeeName);
});

function getWeekStart(dateStr) {
    let date = new Date(dateStr);
    let day = date.getDay(); // dimanche = 0
    let diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

function getWeekEnd(startDate) {
    let end = new Date(startDate);
    end.setDate(end.getDate() + 6);
    return end;
}

function calculateHours(start, lunch, end) {
    let startTime = new Date("1970-01-01T" + start + ":00");
    let endTime = new Date("1970-01-01T" + end + ":00");
    let total = (endTime - startTime) / (1000 * 60 * 60);
    return total - parseFloat(lunch);
}

function getWeeklyTotal(weekStartStr) {
    return workDays
        .filter(d => d.weekStart === weekStartStr)
        .reduce((sum, d) => sum + d.total, 0);
}

function updateBankDisplay() {
    document.getElementById("bankHoursDisplay").innerText =
        "Banque : " + bankHours.toFixed(2) + " h";
}

function updateWeeklyDisplay(date) {
    if (!date) return;
    let weekStart = getWeekStart(date).toISOString().split("T")[0];
    let total = getWeeklyTotal(weekStart);
    document.getElementById("weeklyTotalDisplay").innerText =
        "Total semaine : " + total.toFixed(2) + " h / 40 h";
}

function addWorkDay() {

    let date = document.getElementById("date").value;
    let chantier = document.getElementById("chantier").value;
    let start = document.getElementById("startTime").value;
    let lunch = document.getElementById("lunchTime").value;
    let end = document.getElementById("endTime").value;

    if (!date || !start || !lunch || !end) {
        alert("Remplis tous les champs");
        return;
    }

    let dailyHours = calculateHours(start, lunch, end);
    let weekStart = getWeekStart(date).toISOString().split("T")[0];

    let weeklyBefore = getWeeklyTotal(weekStart);
    let weeklyAfter = weeklyBefore + dailyHours;

    let overtime = 0;

    if (weeklyAfter > 40) {
        if (weeklyBefore >= 40) {
            overtime = dailyHours;
        } else {
            overtime = weeklyAfter - 40;
        }
        bankHours += overtime;
    }

    workDays.push({
        date,
        chantier,
        start,
        lunch,
        end,
        total: dailyHours,
        overtime,
        weekStart
    });

    localStorage.setItem("workDays", JSON.stringify(workDays));
    localStorage.setItem("bankHours", JSON.stringify(bankHours));

    displayHistory();
    updateBankDisplay();
    updateWeeklyDisplay(date);
}

function withdrawBankHours() {
    let amount = parseFloat(prompt("Combien d'heures retirer ?"));
    if (isNaN(amount) || amount <= 0 || amount > bankHours) {
        alert("Montant invalide");
        return;
    }
    bankHours -= amount;
    localStorage.setItem("bankHours", bankHours);
    updateBankDisplay();
}

function displayHistory() {
    let div = document.getElementById("history");
    div.innerHTML = "";

    workDays.forEach(d => {
        div.innerHTML += `
        <div>
        <strong>${d.date}</strong> - ${d.chantier}<br>
        ${d.start} à ${d.end} | Dîner: ${d.lunch}h<br>
        Total: ${d.total.toFixed(2)} h | Sup: ${d.overtime.toFixed(2)} h
        <hr>
        </div>`;
    });
}

function exportWeeklyPDF() {

    if (!employeeName) {
        alert("Entre ton nom.");
        return;
    }

    let selectedDate = document.getElementById("date").value;
    if (!selectedDate) {
        alert("Sélectionne une date.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let weekStart = getWeekStart(selectedDate);
    let weekStartStr = weekStart.toISOString().split("T")[0];
    let weekEnd = getWeekEnd(weekStart);

    let weeklyDays = workDays.filter(d => d.weekStart === weekStartStr);

    let y = 20;

    doc.setFontSize(16);
    doc.text("Pro Paysage", 20, 10);
    doc.setFontSize(12);
    doc.text("Employé : " + employeeName, 20, 16);
    doc.text(
        "Période : " +
        weekStartStr +
        " au " +
        weekEnd.toISOString().split("T")[0],
        20,
        22
    );

    y = 35;

    doc.setFontSize(10);
    doc.text("Date", 10, y);
    doc.text("Chantier", 25, y);
    doc.text("Entrée", 70, y);
    doc.text("Sortie", 85, y);
    doc.text("Dîner", 105, y);
    doc.text("Total", 125, y);
    doc.text("Sup", 145, y);

    y += 5;
    doc.line(10, y, 200, y);
    y += 5;

    weeklyDays.forEach(d => {

        doc.text(d.date, 10, y);
        doc.text(d.chantier.substring(0, 18), 25, y);
        doc.text(d.start, 70, y);
        doc.text(d.end, 85, y);
        doc.text(d.lunch + "h", 105, y);
        doc.text(d.total.toFixed(2), 125, y);
        doc.text(d.overtime.toFixed(2), 145, y);

        y += 7;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    let weeklyTotal = getWeeklyTotal(weekStartStr);

    y += 10;
    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Total semaine : " + weeklyTotal.toFixed(2) + " h", 15, y);
    y += 8;
    doc.text("Banque actuelle : " + bankHours.toFixed(2) + " h", 15, y);

    doc.save("rapport_" + employeeName + "_" + weekStartStr + ".pdf");
}

window.onload = function () {
    displayHistory();
    updateBankDisplay();
};