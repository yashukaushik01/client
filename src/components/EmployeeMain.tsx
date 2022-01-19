import { Grid } from '@material-ui/core'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function EmployeeMain() {
    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Outlet />
            </Grid>
        </div>
    )
}
