import Shapes from "./shapes.js";

// urzywane stale
const board = document.getElementById('board');


// zmienne
let nazwyShapes = [];
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
// miesiace i dni tygodnia
const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dwe = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


// Dostosowanie rozmiarow do wymiarow board
function resizeBoard() {
    // Wyliczenie kratki
    board.style.width = board.style.height = "";
    const square = Math.floor(board.getBoundingClientRect().width / 7);

    // Poprawka rozmiaru panelu
    board.style.width = (square * 7) + 'px';
    board.style.height = (square * 8) + 'px';

    // Ustawienie rozmiarów siatki dla panelu
    board.style.gridTemplateColumns = `repeat(7, ${square}px)`;
    board.style.gridTemplateRows = `repeat(8, ${square}px)`;
}

// Generowanie WSZYSTKICH komórek planszy
function generatePlansza() {
    let i = 0;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 7; c++) {
            const cell = document.createElement('div');
            const text = opis[i];
            cell.classList.add('cell');

            // Ustawienie rozmiaru komórki
            // cell.style.width = cell.style.height = `${cellSize}px`;
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
            board.appendChild(cell);
        }
    }

    Shapes.forEach(e => nazwyShapes.push(e.name));

    // ustawienie dzisiaj
    const dzis = new Date();
    setDay(dzis.getDate());
    setMonth(dzis.getMonth());
    setYear(dzis.getFullYear());
    sprawdzDate();

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

    // ustaw dzien tygodnia
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



// START
generatePlansza();

window.addEventListener('DOMContentLoaded', resizeBoard);
window.addEventListener('resize', resizeBoard);
