import Shapes from "./shapes.js";

// --- ZMIENNE ROZMIAROWE W JEDNYM MIEJSCU ---
const numRows = 8;        // Liczba wierszy planszy
const numCols = 7;       // Liczba kolumn planszy
const cellSize = 100;      // Rozmiar pojedynczej komórki w pikselach (np. 40px na 40px)
// ---------------------------------------------

const boardContainer = document.getElementById('board-container');
let sa = 0, nie = 0;

// texty na polach
const opis = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "2025",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","2026" ,
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21",
    "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
    "Sun", "Mon", "Tue", "Wed",
    "2027" ,"2028" ,"2029" ,"2030", "Thu", "Fri", "Sat"
];
// bierzacy dzien
let nazwyShapes = [];
const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dwe = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Ustawienie rozmiarów siatki dla #board-container za pomocą JavaScript
boardContainer.style.gridTemplateColumns = `repeat(${numCols}, ${cellSize}px)`;
boardContainer.style.gridTemplateRows = `repeat(${numRows + 1}, ${cellSize}px)`;
boardContainer.style.width = `${numCols * cellSize}px`;
boardContainer.style.height = `${(numRows + 1) * cellSize}px`;


// 1. Generowanie WSZYSTKICH komórek planszy
function generatePlansza() {
    let i = 0;

    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const cell = document.createElement('div');
            const text = opis[i];
            cell.classList.add('cell');

            // Ustawienie rozmiaru komórki
            cell.style.width = cell.style.height = `${cellSize}px`;
            cell.id = `${i}`;
            cell.textContent = text;

            // miesiac, dzien, rok, dzien tygodnia
            if ( text == "") cell.classList.add("empty");
            else if ( mon.includes(text) ) cell.classList.add("month");
            else if ( parseInt(text) < 32) cell.classList.add("day");
            else if ( dwe.includes(text) ) cell.classList.add("wday");
            else cell.classList.add("year");

            // pierwszy styczen 2025 - Sroda
            if ( text === "Jan" || text === "1" || text === "2025" ) cell.classList.add("today");
            if ( text === "Wed" ) cell.classList.add("week");
            // if ( text === "Thu" || text === "Fri" || text === "Sat" ) cell.classList.add("today");
            i++;
            boardContainer.appendChild(cell);
        }
    }

    Shapes.forEach(e => nazwyShapes.push(e.name));

    // test nowej figury
    // const testShape = { index: 1, konfig: 0, nazwa: 'r' };
    // rysujShape(testShape , 2);
}

// 2. Obsluga ustawiania dnia na planszy

// pobierz dzien tygodnia
function getDayOfWeek(year, month, day) {
    const date = new Date(year, month, day);

    return {
        "year": date.getFullYear(),
        "month" : date.getMonth(),
        "day" : date.getDate(),
        "week" : date.getDay()};
}

// pobierz dzien z planszy
function today() {

    return {
        "month" : mon.indexOf(document.querySelector(".today.month").textContent),
        "day" : parseInt(document.querySelector(".today.day").textContent),
        "year" : parseInt(document.querySelector(".today.year").textContent)
    }
}

// czy data jest poprawna, jak nie to popraw (odejmuj dzien)
function sprawdzDate() {
    let thisDate = today();
    let realDate = getDayOfWeek(thisDate.year, thisDate.month, thisDate.day);
    // jesli poza, zmienia dzien i miesiac

    while (thisDate.day !== realDate.day) {
        setDay(--thisDate.day )
        thisDate = today();
        realDate = getDayOfWeek(thisDate.year, thisDate.month, thisDate.day);
    }

    if (document.querySelectorAll('.wday').length > 0) {
        document.querySelector(".week").classList.remove("week");
        document.querySelectorAll('.wday')[realDate.week].classList.add("week");
    }

}

// popraw dzien
function setDay(nr) {
    document.querySelector(".today.day").classList.remove("today");
    document.querySelectorAll(".day")[--nr].classList.add("today");
}

// popraw miesiac
function setMonth(nr) {
    document.querySelector(".today.month").classList.remove("today");
    document.querySelectorAll(".month")[nr].classList.add("today");
}

// popraw rok
function setYear(nr) {
    document.querySelector(".today.year").classList.remove("today");
    document.querySelectorAll('.year')[nr - 2025].classList.add("today");
}

// 3. Dodaj eventy do pul i klawiszy

function dodajEventyDoPul() {
    document.addEventListener('DOMContentLoaded', () => {
        const months = document.querySelectorAll('div.month');
        const day = document.querySelectorAll('div.day');
        const year = document.querySelectorAll('div.year');

        months.forEach(div => {
            div.addEventListener('click', (event) => {
                setMonth(mon.indexOf(event.target.textContent));
                sprawdzDate();
            });
        });
        day.forEach(div => {
            div.addEventListener('click', (event) => {
                setDay(parseInt(event.target.textContent));
                sprawdzDate();
            });
        });

        year.forEach(div => {
            div.addEventListener('click', (event) => {
                setYear(parseInt(event.target.textContent))
                sprawdzDate();
            });
        });
    });
    document.querySelector("#test").addEventListener('click', (e) => {
        if (!setShapeOnBoard())
            console.log("Nie ma ukladu!");
    })
    document.querySelector("#clear").addEventListener('click', (e) => {
        nazwyShapes.forEach(nazwa => zmazShape(nazwa) );
    })
    document.querySelector("#petla").addEventListener('click', (e) => {
        sa = 0, nie = 0;
// -----
        // test(912,1095)  // 2027 B
        // test(731,911)  // 2027 A
        // test(547,730)    // 2026 B
        // test(366,546)    // 2026 A
        test(182,365)      // 2025 B
        // test(1,181)      // 2025 A
// -----        
            .then(wynik => console.log("Wynik końcowy: Sa ", sa, ".  Nie ma ", nie ))
            .catch(blad => console.error("Błąd w łańcuchu:", blad));
    })

}



// Wyświetl pierwszą konfigurację przy starcie
generatePlansza();

dodajEventyDoPul();


function test(wartosc, max) {
    return new Promise((resolve, reject) => {

        let dzien = new Date( 2025, 0, wartosc)
        setDay(dzien.getDate());
        setMonth(dzien.getMonth());
        setYear(dzien.getFullYear());
        sprawdzDate();

        let dzienText = dzien.toLocaleDateString("en-Gb");
        nazwyShapes.forEach(nazwa => zmazShape(nazwa) );
        
        if (setShapeOnBoard()) {
            if (wartosc % 30 === 0)
                console.log(`${dzienText}`);
            sa++;
        } else {
            console.log(`${dzienText} Nie ma`);
            nie++;
        }

        if (wartosc < max) {
            resolve(wartosc + 1); 
        } else {
            reject("Koniec");
        }
    })
    .then(newWartosc => {
        if (newWartosc <= max)
            return test(newWartosc, max);   // wywolanie rekurencyjne
        else
            return newWartosc;
    })
    .catch(blad => console.log( blad ) );
}


// rekurencyjnaObietnica(1, 5)
//     .then(wynik => console.log("Wynik końcowy:", wynik))
//     .catch(blad => console.error("Błąd w łańcuchu:", blad));

// --- KONIEC KODU DO OBSŁUGI OBIEKTU L ---