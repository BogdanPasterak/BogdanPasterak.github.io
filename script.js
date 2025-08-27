import Shapes from "./shapes.js";

// urzywane stale
const board = document.getElementById('board');
const modal = document.getElementById('modal');
const msg = document.getElementById('modal-message');
const yesBtn = document.getElementById('modal-yes');
const noBtn = document.getElementById('modal-no');
const komunikat =  document.getElementById("komunikat");
const zaznaczanie = document.getElementById('zaznaczanie');
const btnTest = document.getElementById('test');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');

// zmienne
let nazwyShapes = [];
let ustawione = Array(0);
let nrWyz = 0;

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
const wyzwania = [
    ["Thu", "Fri", "Sat"], ["7", "14", "21"], ["Jan", "Feb", "Mar"], ["Jan", "Jul", "1"]
]
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
    setToday();
    btnLeft.setAttribute('disabled', 'disabled');
    btnRight.setAttribute('disabled', 'disabled');
}

// 2. Obsluga ustawiania dnia na planszy
// ustawienie dzisiaj
function setToday() {
    clearDay();
    const dzis = new Date();
    setDay(dzis.getDate());
    setMonth(dzis.getMonth());
    setYear(dzis.getFullYear());
    sprawdzDate();
}

function clearDay() {
    if (document.querySelector(".week"))
        document.querySelector(".week").classList.remove("week");
    document.querySelectorAll(".today").forEach(d => d.classList.remove("today"));

}

function setWyzwanie(nr) {

    nrWyz = (nr === -1) ? wyzwania.length - 1 : nr % wyzwania.length;
    wyzwania[nrWyz].forEach(txt => 
            Array.from(document.querySelectorAll('.cell'))
            .filter(el => el.textContent.trim() === txt)[0]
            .classList.add("today")
    );
}

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
        if (document.querySelectorAll('.week').length > 0)
            document.querySelector(".week").classList.remove("week");
        document.querySelectorAll('.wday')[realDate.week].classList.add("week");
    }

}

// popraw dzien
function setDay(nr) {
    if (document.querySelectorAll('.today.day').length > 0)
        document.querySelector(".today.day").classList.remove("today");
    document.querySelectorAll(".day")[--nr].classList.add("today");
}

// popraw miesiac
function setMonth(nr) {
    if (document.querySelectorAll('.today.month').length > 0)
        document.querySelector(".today.month").classList.remove("today");
    document.querySelectorAll(".month")[nr].classList.add("today");
}

// popraw rok
function setYear(nr) {
    if (document.querySelectorAll('.today.year').length > 0)
        document.querySelector(".today.year").classList.remove("today");
    document.querySelectorAll('.year')[nr - 2025].classList.add("today");
}

// 3. Testowanie Ukladu

function zmazShape(nazwa) {
    board.querySelectorAll(`.${nazwa}`).forEach(klocek =>
        klocek.classList.remove(nazwa)
    );
}

// rysowanie figury
function rysujShape(obiekt, pole) {
    Shapes[obiekt.index].rotations[obiekt.konfig].forEach(kostka =>
        document.getElementById((pole + kostka[1] + kostka[0] * 7)).classList.add(obiekt.nazwa)
    );
}

// testuj pole
function testujPole(nr) {
    const color = window.getComputedStyle(document.getElementById(nr)).backgroundColor;

    if (color === "rgb(255, 255, 255)") return true;
    return false;
}

// Testowanie obiektu w konfiguracji, na pozycji, oparte o tablice
function testujObiekt(obiekt, pole) {

    let c = pole % 7;
    let r = (pole - c) / 7;
    let kostka, x, y;
    let ok = true;

    const kostki = Shapes[obiekt.index].rotations[obiekt.konfig];

    for (let i = 0; i < kostki.length; i++) {
        kostka = kostki[i];
        x = c + kostka[1];
        y = r + kostka[0];
        // poza obrazem lub nie biale pole
        if ( x < 0 || y < 0 || x > 6 || y > 7 || ! testujPole(x + y * 7)) {
            ok = false;
            break;
        }
    }
    return ok;
}

function includes(lista, uklad) {
    let jest = false;

    for (const e of lista)
        if (e.pole === uklad.pole && e.index === uklad.index && e.konfig === uklad.konfig) jest = true;

    return jest;
}

function wyczysc(lista, pole) {

    for (let i = lista.length - 1; i >= 0 ; i--) {
        const e = lista[i];
        if (e.pole >= pole)
            lista.pop();
        else
            break;
    }
}

function cofnijRuch(ustawione, obiekty) {
    let back = ustawione.shift();

    // usun klocki
    board.querySelectorAll(`.${back.nazwa}`).forEach(klocek =>
        klocek.classList.remove(back.nazwa)
    );
    back.konfig = (back.konfig + 1) % Shapes[back.index].rotations.length;
    //przechowaj pozycje - 1
    const pole = back.pole - 1;
    // wymaz element i przenies do obiektow
    back.pole = undefined;
    obiekty.push(back);
    // zwruc pozycje
    return pole;
}

// Funkcja obsadza figury na planszy
function setShapeOnBoard() {
    // metoda silowa, proba osadzenia kazdego ksztaltu w kazdej konfiguracji na kolejnych miejscach
    // tablica obiektow do osadzenia, numer ob, konfiguracja, nazwa
    let obiekty = Array(Shapes.length);
    ustawione = Array(0);
    let taKonf = true;
    let cont = 0;
    let lista = Array(0);
    let uklad = {};
    let back = {};
    let alicznik = 0;
    let wynik = true;

    for (let i = 0; i < Shapes.length; i++)
        obiekty[i] = { "index" : i, "konfig" : 0, "nazwa" : Shapes[i].name };

    // petla przechodzaca kolejne puste pola
    let pole = 0;
    do {    // pentla pustych pul
        if (testujPole(pole)) {
            cont = 0; taKonf = true;   // licznik obiektow do ustawienia
            do {    // pentla nieurzytych klockow
                while (! testujObiekt(obiekty[0], pole)) {  // pentla konfiguracji
                    obiekty[0].konfig ++;
                    if (obiekty[0].konfig >= Shapes[obiekty[0].index].rotations.length) {
                        taKonf = false; break; }
                }
                if (taKonf) {   // jesli pasuje to czy juz byla
                    uklad = {"index" : obiekty[0].index, "konfig" : obiekty[0].konfig, "nazwa" : obiekty[0].nazwa, "pole" : pole};
                    if ( includes( lista, uklad ) ) cont = 20;  // juz byl
                    else lista.push(uklad);
                    rysujShape(obiekty[0], pole);
                    alicznik++;
                    // if (alicznik % 100 === 0 && alicznik > 1) console.log(alicznik);
                    // if (alicznik === 552) debugger;
                    back = obiekty.shift();
                    back.pole = pole;
                    ustawione.unshift(back);
                    break;  // narysowana, wyjdz z petli klockow !
                } else {    // nie pasuje, przestawienie figur( zerowana konfig i na koniec)
                    cont++;
                    taKonf = true;
                    obiekty[0].konfig = 0;
                    obiekty.push(obiekty.shift());
                }
            } while (cont < obiekty.length);

            if (obiekty.length === 0)
                // { console.log("Koniec, jest uklad", alicznik); break;}
                { wynik = true; break;}

            if (cont >= obiekty.length) {   // cofnac, nie znaleziono zadnego ukladu
                if ( ustawione.length < 1 ) // nie ma co wycofac, wynik albo nie ma
                    // { console.log("Koniec, nie ma kombinacji", alicznik); wynik = false; break;}
                    { wynik = false; break;}
                pole = cofnijRuch(ustawione, obiekty)
                // cofnij kolejny
                if (cont === 20) {
                    // posciagac z listy te pola
                    wyczysc(lista, pole +1);
                    if ( ustawione.length < 1 ) // nie ma co wycofac, wynik albo nie ma
                        // { console.log("Koniec, nie ma kombinacji", alicznik); wynik = false; break;}
                        { wynik = false; break;}
                    pole = cofnijRuch(ustawione, obiekty)
                }
            }
        }
        pole ++;
        // if (obiekty.length < 2 && testujPole(pole)) debugger;
    } while (pole < 54 || obiekty.length === 0);
    return wynik;
}


// 4  Modals
function showModal(message, callback, singleButton = false) {
    msg.innerHTML = message;
    modal.classList.remove('modal-hidden');
    board.classList.add('modal-blur');

    if (singleButton) {
        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'none';
        yesBtn.textContent = 'OK';
        yesBtn.onclick = () => {
            modal.classList.add('modal-hidden');
            board.classList.remove('modal-blur');
            callback(true);
        };
    } else {
        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';
        yesBtn.textContent = 'Yes';
        noBtn.textContent = 'No';
        yesBtn.onclick = () => {
            modal.classList.add('modal-hidden');
            board.classList.remove('modal-blur');
            callback(true);
        };
        noBtn.onclick = () => {
            modal.classList.add('modal-hidden');
            board.classList.remove('modal-blur');
            callback(false);
        };
    }
}

//5 Przyciski
btnTest.onclick = function() {
    if (btnTest.textContent.startsWith("Test")) {
        if(setShapeOnBoard()) {
            // ukryj jak sa , zapisane w ustawione
            nazwyShapes.forEach(nazwa => zmazShape(nazwa));
            komunikat.innerText = "This Arrangement Exists!"
            flashTransmisja();
            btnTest.setAttribute('disabled', 'disabled');
            btnLeft.removeAttribute('disabled');
            btnLeft.textContent = "Show one";
            btnRight.removeAttribute('disabled');
            btnRight.textContent = "Show all";
            // console.log(ustawione);
        } else {
            komunikat.innerText = "Today's arrangements are non-existent, try another challenge."
            flashTransmisja();
            challenge();
        }
    } else if (btnTest.textContent === "Clear") {
        showModal("Clean this arrangement?", function(result) {
            if(result) {
                nazwyShapes.forEach(nazwa => zmazShape(nazwa));
                setToday();
                btnTest.textContent = "Test Today";
                btnLeft.textContent = "Challenge";
                btnRight.textContent = "Random";
                btnLeft.removeAttribute('disabled');
                btnRight.removeAttribute('disabled');
            } 
        });        
    }
};

btnLeft.onclick = function () {
    if (btnLeft.textContent === "Challenge") {
        challenge();
    } else if (ustawione.length) {
        showModal("Are you sure you want to see the hint?", function(result) {
            if(result) {
                let o = ustawione.pop();
                rysujShape(o, o.pole);
                if (!(ustawione.length)) {
                    pelnaPlansza();
                }
            }
        });
    } else if (btnLeft.textContent === "<--"){
        clearDay();
        setWyzwanie(nrWyz - 1);
    }
}

btnRight.onclick = function () {
    if (btnLeft.textContent === "Random") {
        randomSet();
    } else if (ustawione.length) {
        showModal(`Are you sure you want to see the entire solution?<br><b>You will spoil the fun of working independently.</b>`, function(result) {
            if(result) {
                while (ustawione.length) {
                    let o = ustawione.pop();
                    rysujShape(o, o.pole);
                }
                pelnaPlansza();
            }
        });
    } else if (btnRight.textContent === "-->") {
        clearDay();
        setWyzwanie(nrWyz + 1);
    }
}

function challenge() {
    // console.log("Challenge");
    btnTest.removeAttribute('disabled');
    btnTest.textContent = "Test";
    btnLeft.removeAttribute('disabled');
    btnRight.removeAttribute('disabled');
    btnLeft.textContent = "<--";
    btnRight.textContent = "-->";
    clearDay();
    setWyzwanie(nrWyz);
}
function randomSet() {
    // ustal losowe
    console.log("Random");
    
}

function pelnaPlansza() {
    btnTest.removeAttribute('disabled');
    btnTest.textContent = "Clear";
    btnLeft.setAttribute('disabled', 'disabled');
    btnRight.setAttribute('disabled', 'disabled');
    btnLeft.textContent = "<--";
    btnRight.textContent = "-->";

}

// do testow dzien bez ukladu Oct 30 Thu
document.querySelector("footer .test").onclick = function () {
    let dzien = new Date( 2025, 0, 303)
    setDay(dzien.getDate());
    setMonth(dzien.getMonth());
    setYear(dzien.getFullYear());
    sprawdzDate();
}

function flashTransmisja() {
    zaznaczanie.classList.add('flash');
    komunikat.classList.add('flash');
    setTimeout(() => {
        zaznaczanie.classList.remove('flash');
        komunikat.classList.remove('flash');
    }, 3000);
}


// START
generatePlansza();

window.addEventListener('DOMContentLoaded', resizeBoard);
window.addEventListener('resize', resizeBoard);

