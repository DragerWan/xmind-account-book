import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import XLSX from 'xlsx';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function getBills(setBills: (bills:any) => any) {
    fetch('/bill.csv')
        .then(function(response) {
            return response.arrayBuffer();
        })
        .then(function(respAB) {
            let workbook = XLSX.read(new Uint8Array(respAB), {type: 'array'});
            let sheet:object[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            console.log("sheet", sheet);
            let first:any = sheet[0];
            Object.keys(first).forEach((key)=>{
                console.log(key, first[key])
            });
            setBills(sheet);
        }).catch(e=>{
          console.log("error: ", e);
    });
}

function getCategories(setCategories: (categories:any) => any) {
    fetch('/categories.csv')
        .then(function(response) {
            return response.arrayBuffer();
        })
        .then(function(respAB) {
            let workbook = XLSX.read(new Uint8Array(respAB), {type: 'array'});
            let sheet:object[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            let first:any = sheet[0];
            Object.keys(first).forEach((key)=>{
                console.log(key, first[key])
            });
            setCategories(sheet);
        }).catch(e=>{
        console.log("error: ", e);
    });
}

function MyTable() {
  const classes = useStyles();
  const [bills, setBills] = useState();
  const [categories, setCategories] = useState();
  useEffect(()=>{
      getBills(setBills);
      getCategories(setCategories);
  }, []);

  let list = [];
  if(bills && categories){
      let categoryMap:any = {};
      for(let{id, type, name} of categories){
          categoryMap[id] = {
              type,
              name
          }
      }
      list = bills.map((bill:any) => ({
          type: bill.type,
          time: bill.time,
          category: categoryMap[bill.category].name,
          amount: bill.amount
      }));
  }


  return (
    <div>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row:any, index:number) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.type}
              </TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      
    </div>
  );
}

export default MyTable;
