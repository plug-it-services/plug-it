import { Typography } from "@mui/material";
import React from "react";

const HomePage = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" fontWeight="bold" color={'primary'}>
        Plug-It
      </Typography>
      <Typography variant="h4" fontWeight="bold" color={'primary'}>
        Join
      </Typography>

      <br />
    </div>
  </div>
);

export default HomePage;
