import * as React from "react";
import { AppBar, Typography } from "@material-ui/core";


const NavBar = () => {
    return (
        <AppBar position="static" style={{ textAlign: 'center', padding: 20 }} >

            <Typography variant="h4" noWrap component="div" >
                Interview Test - User manager
            </Typography>
            
            <Typography variant="body2" noWrap component="div" style={{ marginTop: 10 }} >
                Developed by Aleksandr Ponomarev for Elvisolutions
            </Typography>

        </AppBar>
    );
};

export default React.memo(NavBar);
