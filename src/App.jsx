import React, { useState } from 'react';
import "./styles.css";
// renders single button in board grid
function Square({ value, onSquareClick, isWinning }) {
	return (
		<button
			className={`w-20 h-20 md:w-24 md:h-24 border border-gray-400 dark:border-gray-600 text-4xl font-bold flex items-center justify-center transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-white ${isWinning ? 'winning-square' : ''}`}
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
		<div className="flex" key={rowIndex}>
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
			<div className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">{status}</div>
			<div className="board-contashadow-lg rounded-lg overflow-hidden">
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
				<li key={move} className="mb-2">
					<span className="font-semibold text-gray-600 dark:text-gray-300">{description}</span>
				</li>
			);
		}
		description = move > 0 ? `Go to move #${move}` : 'Go to game start';

		return (
			<li key={move} className="mb-2">
				<button
					onClick={() => jumpTo(move)}
					className="w-full text-left bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
				>
					{description}
				</button>
			</li>
		);
	});

	const sortedMoves = isSortAscending ? moves : [...moves].reverse();

	return (
		<>
			<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center font-sans">
				<div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row justify-center items-start gap-8">
					<div className="flex-shrink-0">
						<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
					</div>
					<div className="w-full lg:w-64 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
						<h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Move History</h3>
						<button 
							onClick={() => setIsSortAscending(!isSortAscending)}
							className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"	
						>
							Sort {isSortAscending ? 'Descending' : 'Ascending'}
						</button>
						<ul  className="list-none">{sortedMoves}</ul>
					</div>
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
			return { winner: squares[a], line: [a, b, c] };
		}
	}
	return null;
}
