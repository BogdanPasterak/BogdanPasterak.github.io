// Tutaj możesz dodać kod JavaScript, który będzie sterował funkcjonalnością strony
const board = document.getElementById('board');


// zmienne

let square = 0;

console.log("Strona załadowana!");

function resizeBoard() {
    // Wyliczenie kratki
    board.style.width = board.style.height = "";

    const rect = board.getBoundingClientRect();
    square = Math.floor(rect.width / 7);

    // Poprawka rozmiaru panelu
    board.style.width = (square * 7) + 'px';
    board.style.height = (square * 8) + 'px';

    // Ustawienie rozmiarów siatki dla panelu
    board.style.gridTemplateColumns = `repeat(7, ${square}px)`;
    board.style.gridTemplateRows = `repeat(8, ${square}px)`;

}



window.addEventListener('DOMContentLoaded', resizeBoard);
window.addEventListener('resize', resizeBoard);
