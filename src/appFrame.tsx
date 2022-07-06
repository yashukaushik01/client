import { Box, createStyles, Grid, makeStyles, Paper, Snackbar, Theme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useContext } from "react";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import SideBar from "./components/SideBar";
import { SnackBarContext } from "./Context";



export interface IAppFrameProps{
    isAuthenticated: boolean;
    children: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const AppFrame = (props: IAppFrameProps) => {

    const {frameSnackbarMessage, setFrameSnackbarMessage} = useContext(SnackBarContext);

    const classes = useStyles();

    if (!(props.isAuthenticated)){
        return <LoginForm />
    }

    return (
        <div className={classes.root}> 
            <Grid container spacing={3}>
                
                <Grid item xs={12}>
                    <Header />
                </Grid>
                
                <Grid item xs={2}>
                    <SideBar />
                </Grid>
                <Grid item xs={9}>
                    <Box mt={8}>
                        {props.children}
                    </Box>
                </Grid>
                
            </Grid>

            <Snackbar
                open = {frameSnackbarMessage !== ''}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => {    
                    setFrameSnackbarMessage('');
                }}
            >
                <Alert severity="success" onClose={() => {setFrameSnackbarMessage('')}}>{frameSnackbarMessage}</Alert>
            </Snackbar>
        </div>
    )
}

export {AppFrame};