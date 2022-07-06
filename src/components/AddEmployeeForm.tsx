import React, { useContext, useEffect, useState } from 'react';
import { useFormik, getIn } from 'formik';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Grid, Snackbar } from '@material-ui/core';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackBarContext, UserContext } from '../Context';
import { employeeAddValidationSchema, IEmployeeInitialValues } from '../schema/employee.schema';
import { constants } from '../app.constants';
import { Role } from '../app.enums';

export default function AddEmployeeForm(){

  const {frameSnackbarMessage, setFrameSnackbarMessage} = useContext(SnackBarContext);

  const {user, setUser} = useContext<any>(UserContext); //loggedIn user
  let userParsed: any;
  typeof user === "string" 
  ? userParsed = JSON.parse(user)
  : userParsed = user

  const [disableForm, setDisableForm] = useState(false);  //For initially disabling the form fields when came to edit details
  const url = constants.employeeUrl;
  const params = useParams();
  const [userToUpdate, setUserToUpdate] = useState(null); //User for pre-filling form when coming from /admin/
  const [employee, setEmployee] = useState(null); //User(Employee) for pre-filling form when coming from /employee/
  const navigate = useNavigate();

  //Posts user data to database for creating user and navigates back to admin/view-employees
  async function postData(values:{}){
    try {
      const response = await axios.post(url, values);
      setFrameSnackbarMessage(response.data.message)
      // setOpenSnackBar(true);
      navigate('/admin/view-employees')
    } catch(Errors) {
      throw Errors;
    }
  }

  //Sends updated user data to backend for details updation and navigates back to client or employee home respecttively
  async function updateUser(){
    try {
      let urlForUpdatingUser = url;
      userParsed.role === Role.ADMIN
      ? urlForUpdatingUser += params.email
      : urlForUpdatingUser += userParsed.email

      const response = await axios.put(urlForUpdatingUser, {
          "name": formik.values.name,
          "jobTitle": formik.values.jobTitle,
          "dateOfBirth": formik.values.dateOfBirth,
          "address": {
              "houseNo": formik.values.address.houseNo,
              "area": formik.values.address.area,
              "city": formik.values.address.city,
              "state": formik.values.address.state,
              "country": formik.values.address.country,
              "phone": formik.values.address.phone,
              "email": formik.values.address.email
          },
          "password": formik.values.password,
          "allotedLeaves": formik.values.allotedLeaves
      })
      setFrameSnackbarMessage(response.data.message);
      userParsed.role === Role.ADMIN
      ? navigate('/admin/view-employees')
      : navigate('/employee/home')
      setDisableForm(true)
    } catch (Errors){
      throw Errors;
    }
  }

  //Gets the user details to be pre-filled in form when requested by admin and sets userToUpdate
  async function getUser(){
    try {
      const response = await axios.get(`${url}${params.email}`);
      setUserToUpdate(response.data.model);
      if(response.data.model !== null){
        setDisableForm(true);
      }
    } catch (Errors) {
      throw Errors;
    }
  }

  //Gets the user details to be pre-filled in form when requested by employee and sets employee
  async function getEmployee(){
    try {
      const response = await axios.get(`${url}${userParsed.email}`);
      setEmployee(response.data.model);
      setDisableForm(true);
    } catch (Errors) {
      throw Errors;
    }
  }

  //Checks if loggedIn user is admin or employee and runs the respective functions
  useEffect(() => {
      if(userParsed?.role === Role.ADMIN){
        getUser();
      } else if(userParsed?.role === Role.EMPLOYEE){
        getEmployee();
      }
  }, [])

  //Initial values for form when admin comes to ADDING employee(user)
  let employeeInitialValues: IEmployeeInitialValues = {
    jobTitle: ``,
    deptId: ``,
    name: ``,
    role: ``,
    dateOfBirth: ``,
    address: {
        houseNo: '',
        area: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        email: ''
    },
    password: '',
    allotedLeaves: ''
  }

  const formik = useFormik({
    initialValues: employee || userToUpdate || employeeInitialValues,
    validationSchema: employeeAddValidationSchema,
    onSubmit: values => {
      postData(values);
    },
    enableReinitialize: true
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3>Employee</h3>
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <TextField
            autoFocus
            //Disables field PERMANENTLY for EMPLOYEE and TEMPORARILY for ADMIN (when came to edit)
            disabled = {(disableForm)||(userParsed?.role === Role.EMPLOYEE ? true : false)}
            id = "jobTitle"
            name = "jobTitle"
            label = "Job Title"
            value = { formik.values.jobTitle }
            onChange = { formik.handleChange }
            error = { formik.touched.jobTitle && Boolean(formik.errors.jobTitle) }
            helperText = { formik.touched.jobTitle && formik.errors.jobTitle}
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <FormControl fullWidth style={{width:"200px"}}>
            <InputLabel id='deptIdLabel'>Department ID</InputLabel>
            <Select 
              labelId = "deptIdLabel"
              //Disables field PERMANENTLY for EMPLOYEE and PERMANENTLY for ADMIN (when came to edit)
              disabled = {(userToUpdate)||(userParsed?.role === Role.EMPLOYEE ? true : false)}
              id = "deptId"
              name = "deptId"
              label = "Department ID"
              value = { formik.values.deptId }
              onChange = { formik.handleChange }
              error = { formik.touched.deptId && Boolean(formik.errors.deptId) }
            >
              <MenuItem value={"IT"}>IT</MenuItem>
              <MenuItem value={"Sales"}>Sales</MenuItem>
              <MenuItem value={"Finance"}>Finance</MenuItem>
              <MenuItem value={"HR"}>HR</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={6}>      
          <TextField
            //Disables field TEMPORARILY for ADMIN and EMPLOYEE both (when came to edit)
            disabled = {disableForm}
            id = "name"
            name = "name"
            label = "Name"
            value = { formik.values.name }
            onChange = { formik.handleChange }
            error = { formik.touched.name && Boolean(formik.errors.name) }
            helperText = { formik.touched.name && formik.errors.name}
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <FormControl fullWidth style={{width:"200px"}}>
            <InputLabel id='roleLabel'>Role</InputLabel>
            <Select 
              disabled = {(userToUpdate)||(userParsed?.role === Role.EMPLOYEE ? true : false)}
              labelId = "roleLabel"
              id = "role"
              name = "role"
              label = "Role"
              value = { formik.values.role }
              onChange = { formik.handleChange }
              error = { formik.touched.role && Boolean(formik.errors.role) }
            >
              <MenuItem value={"employee"}>Employee</MenuItem>
              <MenuItem value={"admin"}>Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            fullWidth
            disabled = {disableForm}
            style={{width:"200px"}}
            type = "date"
            id = "dateOfBirth"
            name = "dateOfBirth"
            label = "Date of Birth"
            value = { formik.values.dateOfBirth }
            onChange = { formik.handleChange }
            error = { formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth) }
            helperText = { formik.touched.dateOfBirth && formik.errors.dateOfBirth}
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "address.houseNo"
            name = "address.houseNo"
            label = "House No"
            value = { formik.values.address.houseNo }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.hosueNo') && Boolean(getIn(formik.errors, 'address.hosueNo')) }
            helperText = { getIn(formik.touched, 'address.hosueNo') && getIn(formik.errors, 'address.hosueNo') }      
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "address.area"
            name = "address.area"
            label = "Area"
            value = { formik.values.address.area }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.area') && Boolean(getIn(formik.errors, 'address.area')) }
            helperText = { getIn(formik.touched, 'address.area') && getIn(formik.errors, 'address.area') }      
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "address.city"
            name = "address.city"
            label = "City"
            value = { formik.values.address.city }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.city') && Boolean(getIn(formik.errors, 'address.city')) }
            helperText = { getIn(formik.touched, 'address.city') && getIn(formik.errors, 'address.city') }      
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "address.state"
            name = "address.state"
            label = "State"
            value = { formik.values.address.state }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.state') && Boolean(getIn(formik.errors, 'address.state')) }
            helperText = { getIn(formik.touched, 'address.state') && getIn(formik.errors, 'address.state') }      
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "address.country"
            name = "address.country"
            label = "Country"
            value = { formik.values.address.country }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.country') && Boolean(getIn(formik.errors, 'address.country')) }
            helperText = { getIn(formik.touched, 'address.country') && getIn(formik.errors, 'address.country') }      
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            type = "number"
            id = "address.phone"
            name = "address.phone"
            label = "Phone Number"
            value = { formik.values.address.phone }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.phone') && Boolean(getIn(formik.errors, 'address.phone')) }
            helperText = { getIn(formik.touched, 'address.phone') && getIn(formik.errors, 'address.phone') }
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {(userToUpdate)||(userParsed?.role === Role.EMPLOYEE ? true : false)}
            id = "address.email"
            name = "address.email"
            label = "Email Address"
            value = { formik.values.address.email }
            onChange = { formik.handleChange }
            error = { getIn(formik.touched, 'address.email') && Boolean(getIn(formik.errors, 'address.email')) }
            helperText = { getIn(formik.touched, 'address.email') && getIn(formik.errors, 'address.email') }
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {disableForm}
            id = "password"
            name = "password"
            label = "Password"
            value = { formik.values.password }
            onChange = { formik.handleChange }
            error = { formik.touched.password && Boolean(formik.errors.password) }
            helperText = { formik.touched.password && formik.errors.password }
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <TextField 
            disabled = {(disableForm)||(userParsed?.role === Role.EMPLOYEE ? true : false)}
            type = "number"
            id = "allotedLeaves"
            name = "allotedLeaves"
            label = "Alloted Leaves"
            value = { formik.values.allotedLeaves }
            onChange = { formik.handleChange }
            error = { formik.touched.allotedLeaves && Boolean(formik.errors.allotedLeaves) }
            helperText = { formik.touched.allotedLeaves && formik.errors.allotedLeaves }
          />
        </Grid>

        <Grid item md={12}>
        {disableForm 
        ? <Button onClick={()=>{setDisableForm(false)}} color="primary" variant="outlined" type="button" style={{margin:'4px'}}>Edit</Button> 
        : null}

        {
          userParsed.role === Role.ADMIN
          ? userToUpdate 
            ? <Button color="primary" disabled={disableForm} onClick={() => updateUser()} variant="contained" type="button" style={{margin:'4px'}}>Update Employee</Button>
            : <Button disabled={userParsed?.role === Role.EMPLOYEE} color="primary" variant="contained" type="submit">Add Employee</Button>
          : <Button color="primary" disabled={disableForm} onClick={() => updateUser()} variant="contained" type="button" style={{margin:'4px'}}>Update Profile</Button>
        }
        </Grid>

      </Grid>
    </form>
  );
};