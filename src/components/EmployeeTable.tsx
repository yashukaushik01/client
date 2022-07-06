import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { SnackBarContext, UserContext } from '../Context';
import { DataResModel } from '../app.interface';
import { constants } from '../app.constants';
import { Role } from '../app.enums';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function EmployeeTable() {

  const {frameSnackbarMessage, setFrameSnackbarMessage} = useContext(SnackBarContext);

  const {user, setUser} = useContext<any>(UserContext);
  let userParsed;
  typeof user === "string" 
  ? userParsed = JSON.parse(user)
  : userParsed = user
  const classes = useStyles();

  const url = constants.employeeUrl;
  //For Users to be shown in the table
  const [employees, setEmployees] = useState([]);
  
  //Flag for deletePopup
  const [deletePopUp, setDeletePopUp] = useState(false);
  
  //For user to be deleted
  const [empToDelete, setEmpToDelete] = useState('');

  //Gets the users to be shown in table and sets 'employees'
  async function getUsers() {
    try{
      const response = await axios.get(url);
      setEmployees(response.data.model);
    } catch (Errors) {
      throw Errors;
    }
  }

  //Sets the user to be deleted when delete button in table is clicked and sets 'deletePopUp' to true
  const handleOpenPopUp = (empCode: string) => {
    setEmpToDelete(empCode);
    setDeletePopUp(true);
  }

  //Sets the 'deletePopUp' to false
  const handleCloseDeletePopUp = () => {
    setDeletePopUp(false);
  };

  //Sends request to backend to delete the user 'empToDelete' and sends msg to snackbar
  async function deleteEmployee(empCode: string){
    try{
      const response = await axios.delete(`${url}${empCode}`);
      setFrameSnackbarMessage(response.data.message);
      getUsers();
    } catch(Errors) {
      throw Errors;
    }
  }

  //Calls the getUsers to get the employees to be filled in table when component is rendered
  useEffect(() => { 
    getUsers();
  }, [])

  //Checks if loggedIn user is employee, if yes, returns the text
  if (userParsed?.role === Role.EMPLOYEE){
    return <h1>You don't have permission to view this.</h1>
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Employee Code</StyledTableCell>
            <StyledTableCell align="center">Role</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Job Title</StyledTableCell>
            <StyledTableCell align="center">Department</StyledTableCell>
            {/* <StyledTableCell align="right">D.O.B.</StyledTableCell> */}
            <StyledTableCell align="center">Phone Number</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Alloted Leaves</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { employees.map((employee: any) => (
            <StyledTableRow key={employee._id}>
              <StyledTableCell> {employee.empCode} </StyledTableCell>
              <StyledTableCell align="center"> {employee.name} </StyledTableCell>
              <StyledTableCell align="center"> {employee.role} </StyledTableCell>
              <StyledTableCell align="center"> {employee.jobTitle} </StyledTableCell>
              <StyledTableCell align="center"> {employee.deptId} </StyledTableCell>
              {/* <StyledTableCell align="right"> {employee.dateOfBirth} </StyledTableCell> */}
              <StyledTableCell align="center"> {employee.address.phone} </StyledTableCell>
              <StyledTableCell align="center"> {employee.address.email} </StyledTableCell>
              <StyledTableCell align="center"> {employee.allotedLeaves} </StyledTableCell>
              <StyledTableCell align="center"> 
                <Link to={`/admin/view-employee/${employee.address.email}`} style={{textDecoration:'none'}}> <Button size="small" variant="contained" style={{marginBottom:"4px", border: '1px solid #3f51b5'}}>View</Button> </Link> 
                {/* <Button variant="contained" onClick={()=>{ deleteEmployee(employee.empCode) }}>Delete</Button>  */}
                <Button size="small" variant="contained" onClick={() => {handleOpenPopUp(employee.empCode)}} style={{backgroundColor:'#b71c1c', color:'white'}}>Delete</Button> 
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <Dialog
          open={deletePopUp}
          onClose={handleCloseDeletePopUp}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you want to delete employee
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This can't be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeletePopUp}>Cancel</Button>
            <Button onClick={() => { 
                  handleCloseDeletePopUp();
                  deleteEmployee(empToDelete);
                }
              } 
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Table>
    </TableContainer>
  );
}
