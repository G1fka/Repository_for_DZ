document.addEventListener('DOMContentLoaded', function() {
    addColumn(20);
    loadHTML('approximation.html', 'theory-div');
});

function showContent(tabName) {
    const selectedContent = document.getElementById(`content-12`);

    selectedContent.style.display = 'block';
    selectedContent.textContent = null;

    switch (tabName) {
        case '12': { loadHTML(`approximation.html`, `content-12`); break; }
        case '3': { loadHTML(`comparison.html`, `content-12`); break; }
        case '4': { loadHTML(`analyse.html`, `content-12`); break; }
    }
}

function handleButtonClick(id) {
    const buttons = document.querySelectorAll('.tabs-container button');
    buttons.forEach(button => {
        if (button.id === `btn${id}`) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    showContent(id)
}

function addColumn(n) {
    // Находим таблицу
    let table = document.getElementById('input-table');

    // Проходим по каждой строке в таблице и добавляем новую ячейку
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.addEventListener('click', function() {
                this.select();
            });
            cell.appendChild(input);
            table.rows[i].appendChild(cell);
        }
    }
}

function removeColumn(n) {
    // Находим таблицу
    let table = document.getElementById('input-table');

    // Проходим по каждой строке в таблице и удаляем последнюю ячейку
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < n; j++) {
            table.rows[i].deleteCell(-1);
        }
    }
}

// Функция для удаления символов перевода строки (\r) из массива
function cleanArray(array) {
    return array.map(row => row.map(cell => cell.toString().replace(/\r/g, '')));
}

function csvToArray (csv) {
    rows = csv.split("\n");

    return rows.map(function (row) {
    	return row.split(",");
    });
};

function loadFromCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    var csvData = "";

    input.onchange = function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                csvData = e.target.result;
                console.log('Данные из CSV файла: \n', csvData);

                var array = cleanArray(csvToArray(csvData));

                console.log('Преобразованный массив: ', array);

                // Находим таблицу
                let table = document.getElementById('input-table');

                const headerRow = table.querySelector('tr');
                const headerCells = Array.from(headerRow.querySelectorAll('td'));
                const columnCount = headerCells.length;

                removeColumn(columnCount);
                
                // Проходим по каждой строке массива
                array.forEach((rowData, rowIndex) => {
                    // Проходим по каждому элементу текущей строки массива
                    rowData.forEach((cellData) => {
                        // Создаем новую ячейку в строке
                        const cell = document.createElement('td');
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.value = cellData;
                        cell.appendChild(input);
                        table.rows[rowIndex].appendChild(cell);
                    });

                    // Добавляем дополнительные пустые ячейки, если необходимо
                    const emptyColumns = Math.max(0, array[0].length - rowData.length);
                    if (emptyColumns > 0) {
                        for (let i = 0; i < emptyColumns; i++) {
                            const cell = document.createElement('td');
                            const input = document.createElement('input');
                            input.type = 'number';
                            input.value = '0';
                            cell.appendChild(input);
                            row.appendChild(cell);
                        }
                    }
                });
            };
            
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function loadHTML(file, tag) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            const myDiv = document.getElementById(tag);
            myDiv.outerHTML = data;
        })
        .catch(error => {
            console.log('An error occurred:', error);
        });
}