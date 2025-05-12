let categoryChart;
let typeChart;
//diagramm erstelle
//sidebar
let editingIndex = null;

function addEntry() {
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = ""; // Reset

    if (!date) {
        errorContainer.textContent = "❗ Bitte ein Datum angeben.";
        return;
    }

    if (!description) {
        errorContainer.textContent = "❗ Beschreibung darf nicht leer sein.";
        return;
    }

    if (!category) {
        errorContainer.textContent = "❗ Kategorie darf nicht leer sein.";
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        errorContainer.textContent = "❗ Betrag muss eine Zahl größer als 0 sein.";
        return;
    }

    // Optional: kein zukünftiges Datum
    if (new Date(date) > new Date()) {
        errorContainer.textContent = "❗ Datum darf nicht in der Zukunft liegen.";
        return;
    }

    // ✅ Alles gültig – Weiter mit dem ursprünglichen Code:

        entries.push({
        date,
        type,
        description,
        category,
        amount
    });

    renderTable(entries);

    clearForm();
    showSuccess("✅ Eintrag wurde erfolgreich hinzugefügt!");
}


function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotal();
    showSuccess("✅ Eintrag wurde gelöscht.");
}

function updateTotal() {
    const rows = document.querySelectorAll('#budgetTable tbody tr');
    let total = 0;

    rows.forEach(row => {
        const amountCell = row.cells[4].textContent;
        const amount = parseFloat(amountCell.replace('€', '').trim());
        const type = row.cells[1].textContent;

        if (type === 'Einnahme') {
            total += amount;
        } else {
            total -= amount;
        }
    });

    document.getElementById('totalAmount').textContent = `Gesamt: ${total.toFixed(2)}€`;
}
function renderTable(data) {
    const tbody = document.querySelector('#budgetTable tbody');
    tbody.innerHTML = ''; // Tabelle leeren

    data.forEach((entry, index) => {
        const formattedDate = new Date(entry.date).toLocaleDateString('de-DE');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Datum">${formattedDate}</td>
            <td data-label="Art">${entry.type === 'income' ? 'Einnahme' : 'Ausgabe'}</td>
            <td data-label="Beschreibung">${entry.description}</td>
            <td data-label="Kategorie">${entry.category}</td>
            <td data-label="Betrag">${entry.amount.toFixed(2)}€</td>
            <td data-label="Aktionen">
                <button onclick="editEntry(${index})">Bearbeiten</button>
                <button onclick="deleteRow(this)">Löschen</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateTotal();
    updateCharts(data);
}



function clearForm() {
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
}
function showSuccess(message) {
    const success = document.getElementById('success-message');
    success.textContent = message;
    setTimeout(() => {
        success.textContent = "";
    }, 3000);
}
//filter funktion
document.getElementById('filterButton').addEventListener('click', filterEntries);

function filterEntries() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedType = document.getElementById('typeFilter').value;

    const filtered = entries.filter(entry => {
        const matchSearch = entry.description.toLowerCase().includes(searchTerm) ||
                            entry.category.toLowerCase().includes(searchTerm);
        const matchType = selectedType ? entry.type === selectedType : true;
        return matchSearch && matchType;
    });

    renderTable(filtered);
}
let entries = [];

window.addEventListener('DOMContentLoaded', () => {
    // optional: hier könntest du Daten aus localStorage laden
    renderTable(entries);
});
//funktion um update statistik definieren
function updateCharts(data) {
    // Gesamtsummen nach Kategorie berechnen
    const categorySums = {};
    const typeSums = { income: 0, expense: 0 };

    data.forEach(entry => {
        const amount = entry.amount;
        const category = entry.category;
        const type = entry.type;

        categorySums[category] = (categorySums[category] || 0) + amount;
        typeSums[type] += amount;
    });

    // Daten für Kreisdiagramm (Kategorie)
    const categoryLabels = Object.keys(categorySums);
    const categoryData = Object.values(categorySums);

    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Verteilung nach Kategorie',
                data: categoryData
            }]
        }
    });
}
// Einzelne Einnahmen/Ausgaben als eigene Balken
// Einnahmen/Ausgaben als getrennte Datasets
const incomeLabels = [];
const incomeData = [];
const expenseLabels = [];
const expenseData = [];

data.forEach((entry, index) => {
    const label = `${entry.description} (${entry.amount.toFixed(2)}€)`;
    if (entry.type === 'income') {
        incomeLabels.push(label);
        incomeData.push(entry.amount);
    } else {
        expenseLabels.push(label);
        expenseData.push(entry.amount);
    }
});

// Kombiniere Labels für X-Achse
const allLabels = [...incomeLabels, ...expenseLabels];

if (typeChart) typeChart.destroy();
typeChart = new Chart(document.getElementById('typeChart'), {
    type: 'bar',
    data: {
        labels: allLabels,
        datasets: [
            {
                label: 'Einnahmen',
                data: [...incomeData, ...Array(expenseData.length).fill(null)],
                backgroundColor: '#2ecc71' // grün
            },
            {
                label: 'Ausgaben',
                data: [...Array(incomeData.length).fill(null), ...expenseData],
                backgroundColor: '#e74c3c' // rot
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
//edit funktion
function editEntry(index) {
    editingIndex = index;
    const entry = entries[index];

    document.getElementById('editDate').value = entry.date;
    document.getElementById('editType').value = entry.type;
    document.getElementById('editDescription').value = entry.description;
    document.getElementById('editCategory').value = entry.category;
    document.getElementById('editAmount').value = entry.amount;

    document.getElementById('editSidebar').classList.add('active');
}
//speichern in sidebar
document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const updatedEntry = {
        date: document.getElementById('editDate').value,
        type: document.getElementById('editType').value,
        description: document.getElementById('editDescription').value.trim(),
        category: document.getElementById('editCategory').value.trim(),
        amount: parseFloat(document.getElementById('editAmount').value)
    };

    entries[editingIndex] = updatedEntry;
    renderTable(entries);
    showSuccess("✅ Eintrag aktualisiert.");
    closeSidebar();
});
function closeSidebar() {
    document.getElementById('editSidebar').classList.remove('active');
    editingIndex = null;
}

