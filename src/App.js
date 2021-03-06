import React from 'react';
import './App.css';
import { Board } from './board/board';

export default class App extends React.Component {

  render() {
    return (
      <div className="App">
        <h1>Sudoku Solver</h1>
        <Board />
        Made with <span style={{color: "#e25555"}}>&hearts;</span> &nbsp;[
        <a href="https://github.com/raunakjodhawat/sudokuSolver" >Github</a>, &nbsp;
        <a href="https://www.linkedin.com/in/jodhawat/" >LinkedIn</a>]
      </div>
    );
  }
}
