import React, { useState } from 'react';
import './styles.css';
// renders single button in board grid
function Square({ value, onSquareClick, isWinning }) {
  const winningSquareStyle = isWinning ? 'winning-square' : 'square';

  return (
    <button 
      className={`square ${winningSquareStyle}`} 
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

// renders the 3x3 game board
function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  function handleClick(i) {
    // checks for winner or if space is occupied    
    if (winner || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let status;
  if (winner) { 
    status = 'Winner: ' + winner; 
  } else 
  if (squares.every(Boolean)) { // checks if every square is occupied
    status = 'Tie game'
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 3;
  const boardRows = Array(boardSize).fill(null).map((_, rowIndex) => (
    <div className="board-row" key={rowIndex}>
      {Array(boardSize).fill(null).map((c, colIndex) => {
        const squareIndex = rowIndex * boardSize + colIndex;
        return (
          <Square
            key={squareIndex}
            value={squares[squareIndex]}
            onSquareClick={() => handleClick(squareIndex)}
            isWinning={winningLine.includes(squareIndex)}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-container">
        {boardRows}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSortAscending, setIsSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
      return (
        <li key={move}>
          <span>{description}</span>
        </li>
      );
    } 
    description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });
  
  const sortedMoves = isSortAscending ? moves : [...moves].reverse();

  return (
    <>
      <div className="spacer">
        <div>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="moves-list-container">
          <h3>Move History</h3>
          <button onClick={() => setIsSortAscending(!isSortAscending)}>
            Sort {isSortAscending ? 'Descending' : 'Ascending'}
          </button>
          <ul>{sortedMoves}</ul>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: [a, b, c]};
    }
  }
  return null;
}
