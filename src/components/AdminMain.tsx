import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Outlet } from 'react-router-dom'


export default function AdminMain() {
    return (
        <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
            <Outlet />
        </Grid>
    )
}
