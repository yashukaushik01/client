import { ThemeProvider, Container, CssBaseline, Box, Typography, TextField, Button, Grid, createTheme, makeStyles, Card, CardContent, Snackbar } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import { useFormik } from 'formik'
import axios from 'axios';
import { UserContext } from '../Context';
import { LoginFormSchema } from '../app.interface';
import { constants } from '../app.constants';
import { Role } from '../app.enums';
import { Alert } from '@material-ui/lab';

const theme = createTheme();
const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
});

export default function LoginForm() {

    const classes = useStyles();

    const url = constants.employeeUrl;
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext)

    const [loginFormSnackbarMessage, setLoginFormSnackbarMessage] = useState('');

    const loginFormValidationSchema = Yup.object({
        email: Yup
          .string()
          .email('Invalid email address')
          .required('Job Title is required'),
        password: Yup
          .string()
          .required('Password is required'),
    })

    let initialValues = {
        email: '',
        password: ''
    }

    async function verifyUser(values: LoginFormSchema){
        const response = await axios.post(`${url}${values.email}`, {"password": values.password});
        setLoginFormSnackbarMessage(response.data.message);
        
        let user = {
            "email": response.data.model.address.email,
            "password": response.data.model.password,
            "role": response.data.model.role
        }
        localStorage.setItem("user", JSON.stringify(user));
        user.role === Role.ADMIN
        ? navigate(`/${response.data.model.role}/view-employees`)
        : navigate(`/${response.data.model.role}/home`);
        setUser(JSON.parse(localStorage.user));
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginFormValidationSchema,
        onSubmit: values => {       
            verifyUser(values);
        },
      });

    return (
        <ThemeProvider theme={theme}>
            <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Card className = {classes.root}>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <CardContent>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    autoFocus
                                    value = { formik.values.email }
                                    onChange = { formik.handleChange }
                                    error = { formik.touched.email && Boolean(formik.errors.email) }
                                    helperText = { formik.touched.email && formik.errors.email}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value = { formik.values.password }
                                    onChange = { formik.handleChange }
                                    error = { formik.touched.password && Boolean(formik.errors.password) }
                                    helperText = { formik.touched.password && formik.errors.password}
                                />
                                <Button color="primary" variant="contained" type="submit">
                                    Submit
                                </Button>
                            </Box> 
                        </form>
                        </CardContent>
                    </Box>
                    </Card>
                </Container>

                <Snackbar
                    open = {loginFormSnackbarMessage !== ''}
                    autoHideDuration={2000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    // message={loginFormSnackbarMessage}
                    onClose={() => {setLoginFormSnackbarMessage('')}}
                >
                    <Alert severity={loginFormSnackbarMessage !== 'User Verified' ? "error" : "success"} onClose={() => {setLoginFormSnackbarMessage('')}}>{loginFormSnackbarMessage}</Alert>
                </Snackbar>
            </Grid>
        </ThemeProvider>
    )
}
