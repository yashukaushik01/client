import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';


export default function Header() {

  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{zIndex:9999}}>
        <Toolbar>
          <Grid justifyContent="space-between" container>
            <Grid item> 
              <Typography variant="h6" noWrap component="div">
                EMS
              </Typography>
            </Grid>
            <Grid item>
              <Button size="small" onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
                navigate('/login');
                }} variant="contained">Logout</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      
    </Box>

  );
}
