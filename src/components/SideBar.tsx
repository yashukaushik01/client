import { Box, Divider, Drawer, List, ListItem, ListItemText, Toolbar } from '@material-ui/core'
import React, { createContext, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../Context';
import { Role } from '../app.enums';

export default function SideBar() {

    const {user, setUser} = useContext<any>(UserContext);
    // console.log(typeof user);
    // console.log(`${user}`);
    // if (typeof user === "object"){
    //     console.log(user)
    // }

    let userParsed;
    typeof user === "string" 
    ? userParsed = JSON.parse(user)
    : userParsed = user

    const [navBarOptions, setNavBarOptions] = useState(
        userParsed?.role === Role.ADMIN
        ?   [
                {
                    text: "View Employees",
                    path: "admin/view-employees"
                },
                {
                    text: "Add Employee",
                    path: "admin/add-employee"
                },
                {
                    text: "View Leaves",
                    path: "admin/view-leaves"
                }
            ]
        :   [
                {
                    text: "Home",
                    path: "employee/home"
                },
                {
                    text: "Add leave",
                    path: "employee/add-leave"
                },
                {
                    text: "View leaves",
                    path: "/employee/view-leaves"
                }
            ]
        )

    return (
        <div>
            <Drawer
                variant="permanent"
                style={{color:'rgb(240,240,240'}}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    
                    <List>
                            {
                                navBarOptions.map( ({text, path}) => {
                                    return (<ListItem button  key={text}>
                                        <NavLink to={path}
                                        style={({ isActive }) => ({
                                            color: isActive ? '#fff' : '#545e6f',
                                            background: isActive ? '#3f51b5' : '#f0f0f0',
                                            border: '1px solid #3f51b5',
                                            borderRadius: '40px', textDecoration:'none', height:'50px', width:'150px', textAlign:'center'
                                        })}
                                        > 
                                            <ListItemText primary={text} style={{padding:'8px'}} /> 
                                        </NavLink>
                                    </ListItem>)        
                                })
                            }
                    </List>                    
                
                <Divider />
                </Box>
            </Drawer>
        </div>
    )
}
