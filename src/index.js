import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.column);
  }
  render() {
    return (<div className={this.props.boxClass} key={this.props.boxId} id={this.props.boxId} onClick={this.selectBox}/>);
  }
}

class Grid extends React.Component {
  render() {
    const width = this.props.columns * 15;
    let rowsArr = [];
    let boxClass = '';
    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.columns; j++) {
        let boxId = i + "_" + j;
        boxClass = this.props.gridFull[i][j]
          ? "box on"
          : "box off";
        rowsArr.push(<Box boxClass={boxClass} key={boxId} boxId={boxId} row={i} column={j} selectBox={this.props.selectBox}/>);
      }
    }
    return (
      <div className="grid" style={{
        width: width
      }}>
        {rowsArr}
      </div>
    );
  }
}

class Main extends React.Component {

  constructor() {
    super();
    this.rows = 30;
    this.columns = 30;
    this.speed = 100;
    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.columns).fill(false))
    }
  }

  selectBox = (row, column) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][column] = !gridCopy[row][column];
    this.setState({gridFull: gridCopy});
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.columns; j++) {
        gridCopy[i][j] = false;
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({gridFull: gridCopy});
  }

  clearGame = () => {
    clearInterval(this.intervalId);
    this.setState({
      gridFull: Array(this.rows).fill().map(() => Array(this.columns).fill(false)),
      generation: 0
    });
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  slowGame = () => {
    this.speed += 100;
    this.playButton();
  }
  fastGame = () => {
    if(this.speed >= 100){
    this.speed -= 100;
    this.playButton();
  }
  }
  gridSizeChange = (e) => {
    clearInterval(this.intervalId);
    switch (e.target.value) {
      case 'small': this.rows = 20;
                    this.columns = 40;
                    break;
      case 'large': this.rows = 50;
                    this.columns = 80;
                    break;
      case 'medium':
      default:      this.rows = 30;
                    this.columns = 30;
                    break;
    }
    this.value = e.target.value;
    this.clearGame();
  }

  play = () => {
    let grid1 = arrayClone(this.state.gridFull);
    let grid2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let currentCell = grid1[i][j] || false;
        let rightCell = ((j+1)>=this.columns) ? false : grid1[i][j + 1];
        let leftCell = ((j-1)<0) ? false : grid1[i][j - 1];
        let topCell = ((i-1)<0) ? false : grid1[i - 1][j];
        let bottomCell = (i+1)>=this.rows ? false : grid1[i + 1][j];
        let topRightCell = ((i-1)<0 || (j + 1)>=this.columns ) ? false : grid1[i - 1][j + 1];
        let topLeftCell = ((i-1)<0 || (j - 1)<0 ) ? false : grid1[i - 1][j - 1];
        let bottomRightCell = ((i+1)>=this.rows || (j + 1)>=this.columns ) ? false : grid1[i + 1][j + 1];
        let bottomLeftCell = ((i+1)>=this.rows || (j - 1)<0 ) ? false : grid1[i + 1][j - 1];
        let noOfLiveNeighbourCell = this.sumOfNeighbourCellStatus(rightCell, leftCell, topCell, bottomCell, topRightCell, topLeftCell, bottomRightCell, bottomLeftCell, true);
        let noOfDeadNeighbourCell = this.sumOfNeighbourCellStatus(rightCell, leftCell, topCell, bottomCell, topRightCell, topLeftCell, bottomRightCell, bottomLeftCell, false);
        if (currentCell === true) {
          if(noOfLiveNeighbourCell < 2){
            grid2[i][j] = false;
          }
          else if (noOfLiveNeighbourCell === 2 || noOfLiveNeighbourCell === 3) {
            grid2[i][j] = true;
          }
          else if (noOfLiveNeighbourCell > 3) {
            grid2[i][j] = false;
          }
        } else {
          if (noOfLiveNeighbourCell === 3) {
            grid2[i][j] = true;
          }
        }
      }

    }
    this.setState({gridFull: grid2, generation: this.state.generation+1});
  }

  sumOfNeighbourCellStatus = (rightCell, leftCell, topCell, bottomCell, topRightCell, topLeftCell, bottomRightCell, bottomLeftCell, live) => {
    let sumLive = 0,
      sumDead = 0;
    if (rightCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (leftCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (topCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (bottomCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (topRightCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (bottomRightCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (bottomLeftCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }
    if (topLeftCell === true) {
      sumLive++;
    } else {
      sumDead++;
    }

    if(live === true) {
      return sumLive;
    }
    else {
      return sumDead;
    }
  }

  componentDidMount() {
    this.seed();
  }

  render() {
    return (
      <div>
      <div className="center">
          <h1>Conway's Game of Life</h1>
          <div className="buttons-wrapper">
            <button onClick={this.seed}>Seed</button>
            <button onClick={this.playButton}>Play</button>
            <button onClick={this.pauseButton}>Pause</button>
            <button onClick={this.slowGame}>Slow</button>
            <button onClick={this.fastGame}>Fast</button>
            <button onClick={this.clearGame}>Clear</button>
            <select onChange={this.gridSizeChange} value="none">
              <option value="none">Select Grid Size</option>
              <option value="small">20 * 40</option>
              <option value="medium" >30 * 30</option>
              <option value="large">50 * 80</option>
            </select>
          </div>
          <Grid rows={this.rows} columns={this.columns} gridFull={this.state.gridFull} selectBox={this.selectBox}/>
          <h2>Generations : {this.state.generation}</h2>
        </div>
        <footer>
          <span className="float-left">Built by <a href="https://github.com/deepakkj" target="_blank"rel="noopener noreferrer">Deepak Kumar Jain</a></span>
          A React Implementation
          <span className="float-right">MIT License</span>
        </footer>
      </div>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
  <Main></Main>, document.getElementById('root'));
