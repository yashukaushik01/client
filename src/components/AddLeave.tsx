import { Grid, TextField, Button, TextareaAutosize } from '@material-ui/core';
import axios from 'axios';
import { getIn, useFormik } from 'formik';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { leaveAddValidationSchema } from '../schema/leave.schema';
import { UserContext, SnackBarContext } from '../Context';
import { constants } from '../app.constants';

export default function AddLeave() {

    const {frameSnackbarMessage, setFrameSnackbarMessage} = useContext(SnackBarContext);

    const navigate = useNavigate();
    const {user, setUser} = useContext<any>(UserContext); //loggedIn user
    let userParsed: any;
    typeof user === "string" 
    ? userParsed = JSON.parse(user)
    : userParsed = user

    const url = constants.leaveUrl;

      //Posts leave data to database for creating leave and navigates back to /employee/view-leaves
      async function postLeave(values:{}){
          const response = await axios.post(url, values);
          setFrameSnackbarMessage(response.data.message);
          navigate('/employee/view-leaves');
      }

      //Gets the number of days between the fromDate and toDate selected by employee
      function getNosOfDays(): number{
          let fromdate:any = new Date(formik.values.fromDate);
          let todate:any = new Date(formik.values.toDate);
          let diff:any = (todate - fromdate);
          let ms = 1000*3600*24;
          let days = (diff/ms) + 1;
          return days;
      }

      //Checks if employee's remaining leaves are less than leaves requested, if not, calls postLeave
      async function handleLeaves(values: any){
        const response = await axios.get(`${constants.employeeUrl}${userParsed.email}`)
        let employeeLeaves = response.data.model.allotedLeaves;
        let nosOfDays = getNosOfDays();
        if (employeeLeaves < nosOfDays){
            setFrameSnackbarMessage(`Your remaining leaves are ${employeeLeaves}`);
        } else {
            values.nosOfDays = nosOfDays;
            postLeave(values);
        }
      }

      const formik = useFormik({
        initialValues: {
            email: userParsed?.email,
            fromDate: '',
            toDate: '',
            reason: '',
        },
        validationSchema: leaveAddValidationSchema,
        onSubmit: values => {handleLeaves(values);},
      });

      //Get today's date to set min value of fromDate and toDate in form
      const getTodayDate = () => {
            let today = new Date();
            return `${today.getFullYear()}-${String((today.getMonth()+1)).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      }


    return (
        <form onSubmit={formik.handleSubmit}>
            <h3>Apply for leave</h3>
            <Grid container spacing={2}>

                <Grid item xs={12} md={12}>
                <TextField 
                    autoFocus
                    fullWidth
                    InputProps={{inputProps: { min: getTodayDate()}}}
                    style={{width:"400px"}}
                    type = "date"
                    id = "fromDate"
                    name = "fromDate"
                    label = "From"
                    value = { formik.values.fromDate }
                    onChange = { formik.handleChange }
                    error = { formik.touched.fromDate && Boolean(formik.errors.fromDate) }
                    helperText = { formik.touched.fromDate && formik.errors.fromDate}
                />
                </Grid>
                
                <Grid item xs={12} md={12}>
                <TextField
                    fullWidth
                    //Sets min value to fromDate or today's date 
                    InputProps={{inputProps: { min: formik.values.fromDate || getTodayDate()}}}
                    style={{width:"400px"}}
                    type = "date"
                    id = "toDate"
                    name = "toDate"
                    label = "To"
                    value = { formik.values.toDate }
                    onChange = { formik.handleChange }
                    error = { formik.touched.toDate && Boolean(formik.errors.toDate) }
                    helperText = { formik.touched.toDate && formik.errors.toDate}
                />
                </Grid>


                <Grid item xs={12} md={12}>
                <TextareaAutosize
                    minRows={4}
                    placeholder = 'Type your reason here!'
                    style = {{width:"400px"}}
                    id = "reason"
                    name = "reason"
                    required
                    value = { formik.values.reason }
                    onChange = { formik.handleChange }
                />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Button color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}
