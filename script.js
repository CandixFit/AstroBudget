function addEntry() {
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !description || !category || isNaN(amount)) {
        alert('Bitte füllen Sie alle Felder aus!');
        return;
    }

    const table = document.getElementById('budgetTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Datum formatieren (DD.MM.YYYY)
    const formattedDate = new Date(date).toLocaleDateString('de-DE');

    newRow.innerHTML = `
        <td>${formattedDate}</td>
        <td>${type === 'income' ? 'Einnahme' : 'Ausgabe'}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}€</td>
        <td><button onclick="deleteRow(this)">Löschen</button></td>
    `;

    updateTotal();
    clearForm();
}
//Button für Fehleingaben
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotal();
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

function clearForm() {
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
}

function printTable(){
    alert("under construction")
}