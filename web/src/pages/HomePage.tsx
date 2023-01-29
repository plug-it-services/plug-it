import {Typography} from '@mui/material';
import React, {useState} from 'react';
import MessageBox from "../components/MessageBox";
import Button from "../components/Button";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Typography variant="h2" fontWeight="bold" color={'primary'}>
          Plug-It
        </Typography>
        <Typography variant="h4" fontWeight="bold" color={'primary'}>
          Join
        </Typography>
        <Button color="primary" text="cheh" onClick={() => setOpen(true)} />
        <MessageBox title={"Cheh"} description={"injinjfi"} buttons={[]} type={"error"} isOpen={open} onClose={onClose}/>
        <br/>
      </div>
    </div>
  );
};

export default HomePage;
