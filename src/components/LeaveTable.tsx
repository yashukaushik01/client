import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { withStyles} from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { SnackBarContext, UserContext } from '../Context';
import { constants } from '../app.constants';
import { Role, LeaveStatus } from '../app.enums';


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

export default function LeaveTable() {

    const {frameSnackbarMessage, setFrameSnackbarMessage} = useContext(SnackBarContext);

    const classes = useStyles();
    const url = constants.leaveUrl;
    const [leaves, setLeaves] = useState([]);
    const [reasonPopUp, setReasonPopUp] = useState(false);
    const [leaveToReject, setLeaveToReject] = useState('');

    const {user, setUser} = useContext<any>(UserContext);
    let userParsed: any;
    typeof user === "string" 
    ? userParsed = JSON.parse(user)
    : userParsed = user

    //Get all leaves and set them in 'leaves' to show in table when coming from 'admin/view-leaves'
    async function getLeaves() {
        try{
          const response = await axios.get(url);
          setLeaves(response.data.model);
        } catch (Error) {
          throw Error;
        }
    }

    //Get leaves for a User(employee) to show in table when coming from 'employee/view-leaves'
    async function getUserLeaves() {
      try{
        const response = await axios.get(`${url}${userParsed.email}`);
        if(response.data.model){
          setLeaves(response.data.model)
        }
      } catch (Error) {
        throw Error;
      }
    }

    
    const handleOpenPopUp = (leaveId: string) => {
        setLeaveToReject(leaveId);
        setReasonPopUp(true);
    }   

    const handleClosePopUp = () => {
        setReasonPopUp(false);
      };
    
    
    async function handleApprove(leaveId: string) {
        try{
            const response = await axios.put(`${url}${leaveId}`, {
                'statusToUpdate': LeaveStatus.APPROVED,
                'reasonReject': null
            });
            setFrameSnackbarMessage(response.data.message);
            let userEmail = response.data.model.email;
            const userResult = await axios.get(`${constants.employeeUrl}${userEmail}`);
            const result = await axios.put(`${constants.employeeUrl}${userEmail}`, {allotedLeaves: userResult.data.model.allotedLeaves - response.data.model.nosOfDays});
            getLeaves();
        } catch(Errors) {
            throw Errors;
        } 
    }
    
    async function handleDecline(leaveId: string) {
        try{
            const response = await axios.put(`${url}${leaveId}`, {
                'statusToUpdate': LeaveStatus.DECLINED,
                'reasonRejected': formik.values.reasonToReject
            });
            setFrameSnackbarMessage(response.data.message);
            getLeaves();
          } catch(Errors) {
            throw Errors;
          } 
    }

    useEffect( ()=>{
      if (userParsed?.role === Role.ADMIN){
        getLeaves();
      } else {
        getUserLeaves();
      }
    }, [])

    const formik = useFormik({
      initialValues: {
        reasonToReject : ''
      },
      onSubmit: values => {
        handleDecline(leaveToReject);
        handleClosePopUp();
      }
    });
  

    return (
        <TableContainer component={Paper}>
            <h3>Leaves</h3>
            <Table className={classes.table} aria-label="customized table">
            <TableHead>
                <TableRow>
                    {userParsed?.role === Role.ADMIN 
                    ? <StyledTableCell>Employee Email</StyledTableCell>
                    : null}
                    <StyledTableCell align="center">From Date</StyledTableCell>
                    <StyledTableCell align="center">To Date</StyledTableCell>
                    <StyledTableCell align="center">Reason</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    {userParsed?.role === Role.ADMIN
                    ? <StyledTableCell align="center">Action</StyledTableCell>
                    : null}
                    <StyledTableCell align="center">Reason of Rejection</StyledTableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {
                    leaves.map((leave: any) => (
                        <StyledTableRow key={leave._id}>
                            {userParsed?.role === Role.ADMIN 
                            ? <StyledTableCell>{leave.email}</StyledTableCell>
                            : null}
                            <StyledTableCell align="center">{leave.fromDate}</StyledTableCell>
                            <StyledTableCell align="center">{leave.toDate}</StyledTableCell>
                            <StyledTableCell align="center">{leave.reason}</StyledTableCell>
                            <StyledTableCell align="center">{leave.status}</StyledTableCell>
                            {userParsed?.role === Role.ADMIN 
                            ? <StyledTableCell align="center">
                                    <Button variant="contained" size="small" color="primary" style={{margin:"1px"}} disabled={leave.status!==LeaveStatus.REQUESTED} onClick={()=>{handleApprove(leave._id)}}>Approve</Button>
                                    <Button variant="outlined" size="small" style={{margin:"1px"}} disabled={leave.status!==LeaveStatus.REQUESTED} onClick={()=>{handleOpenPopUp(leave._id)}}>Decline</Button>
                            </StyledTableCell>
                            : null}
                            <StyledTableCell align="center">{leave.reasonRejected}</StyledTableCell>
                        </StyledTableRow>
                    ))
                }

            </TableBody>
            <Dialog
                open={reasonPopUp}
                onClose={handleClosePopUp}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
              <form onSubmit={formik.handleSubmit}>
                  <DialogTitle id="alert-dialog-title">
                  Why you want to reject?
                  </DialogTitle>
                  <DialogContent>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="reasonToReject"
                          name="reasonToReject"
                          label="reasonToReject"
                          type="text"
                          fullWidth
                          variant="standard"
                          value = { formik.values.reasonToReject }
                          onChange = { formik.handleChange }
                          required
                      />
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={handleClosePopUp}>Cancel</Button>
                  <Button type="submit" autoFocus>
                      Reject Leave
                  </Button>
                  </DialogActions>
                </form>
            </Dialog>
            </Table>
        </TableContainer>
    )
}
