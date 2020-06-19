import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { solve } from './logic/solver';
import './board.css';
export class Board extends React.Component {

    constructor(props) {
        super(props);
        //let initialValues = [0,0,0,1,0,0,2,0,0,8,0,2,0,0,5,0,0,0,0,9,4,0,0,0,0,0,0,2,0,0,3,0,0,0,0,1,0,0,0,0,0,9,7,0,0,4,0,0,0,6,0,0,8,0,0,0,0,2,0,7,0,0,0,0,0,5,9,0,0,0,0,0,0,0,0,6,1,0,0,9,4];
        //let initialValues = [5, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 4, 0, 0, 6, 0, 0, 1, 8, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 2, 0, 9, 0, 0, 0, 0, 5, 3, 0, 0, 8, 0, 2, 4, 7, 9, 0, 0, 0, 0, 1, 8, 0, 0, 0, 0, 4, 0, 0, 0, 0, 9, 0, 0, 0, 0];
        this.state = {
            values: this.getInitialValue(),
            canLaunch: true,
            solvedValues: this.getInitialValue(),
        }
    }
    getInitialValue(){
        let initialValues = [];
        for (let i = 0; i < 81; i++) {
            initialValues.push(0);
        }
        return initialValues;
    }

    changeValue(index, newValue) {
        let valueCopy = this.state.values;
        valueCopy[index] = parseInt(newValue);
        this.setState({
            values: valueCopy
        });
        let canLaunchCopy = (this.state.values[index] >= 0 && this.state.values[index] <= 9);
        this.setState({
            canLaunch: canLaunchCopy
        });
    }

    onSolveButtonClick() {
        this.setState({
            solvedValues: solve(this.state.values)
        });
    }

    onClearButtonClick() {
        this.setState({
            solvedValues: this.getInitialValue(),
            values: this.getInitialValue()
        });
    }

    render() {
        const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        return (
            <div >
                <Table style={{ width: 550, margin: 100, display: "inline-flex" }} component={Paper}>
                    <TableBody>
                        {
                            indexes.map((outerValue, outerIndex) => (
                                <TableRow key={outerIndex}>{
                                    indexes.map((innerValue, innerIndex) => (
                                        <TableCell align="center" key={outerIndex * 9 + innerIndex} >
                                            <TextField
                                                key={outerIndex * 9 + innerIndex}
                                                inputProps={{ min: 0, style: { textAlign: 'center', borderBottom: "none" } }}
                                                error={this.state.values[outerIndex * 9 + innerIndex] >= 0 && this.state.values[outerIndex * 9 + innerIndex] <= 9 ? false : true}
                                                onChange={event => this.changeValue(outerIndex * 9 + innerIndex, event.target.value)} />
                                        </TableCell>
                                    ))
                                }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    this.state.canLaunch &&
                    <div style={{display: "inline"}}>
                        <Table style={{ width: 550, margin: 100, display: "inline-flex" }} component={Paper}>
                            <TableBody>
                                {
                                    indexes.map((outerValue, outerIndex) => (
                                        <TableRow key={outerIndex}>{
                                            indexes.map((innerValue, innerIndex) => (
                                                <TableCell align="center" key={outerIndex * 9 + innerIndex}>
                                                    <TextField
                                                        key={outerIndex * 9 + innerIndex}
                                                        value={this.state.solvedValues[outerIndex * 9 + innerIndex]}
                                                        inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                                    />
                                                </TableCell>
                                            ))
                                        }
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <Button variant="contained" color="primary" onClick={e => this.onSolveButtonClick()} style={{ width: 600, margin: 10, display: "inline-flex" }}> Solve </Button>
                        <Button variant="contained" color="primary" onClick={e => this.onClearButtonClick()} style={{ width: 600, margin: 10, display: "inline-flex" }}> Clear </Button>
                    </div> 
                }
            </div>
        );
    }
}