import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import PlugCard from '../components/PlugCard';
import {getPlugs, setPlugEnable, Plug, Service} from '../utils/api';
import MessageBox from '../components/MessageBox';

const PlugsPage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Can't login");
  const navigate = useNavigate();
  const [plugs, setPlugs] = useState<Plug[]>([]);
  const [searchedPlugs, setSearchedPlugs] = useState<Plug[]>([]);

  const initPlugs = (plugList: Plug[]) => {
    setPlugs(plugList);
    setSearchedPlugs(plugList);
  };

  useEffect(() => {
    getPlugs()
      .then(initPlugs)
      .catch((err) => {
        setError('Cannot retrieve plugs');
        setMessage(err.message);
        setOpen(true);
      });
  }, []);

  const filterResearchedPlugs = (searchedPlug: string) => {
    if (searchedPlug === '' || searchedPlug === undefined) {
      setSearchedPlugs(plugs);
    } else {
      const filtered = plugs.filter((plug) => plug.name.toLowerCase().includes(searchedPlug.toLowerCase()));
      setSearchedPlugs(filtered);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <Header title="Plug-It" area="Areas" />
      <br />
      <Typography variant="h4" fontWeight="bold" color={'primary'} style={{ paddingTop: '20px' }}>
        Plugs
      </Typography>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingTop: '20px' }}>
        <SearchBar
          onChange={(value) => filterResearchedPlugs(value)}
          onSearch={(value) => filterResearchedPlugs(value)}
          placeholder="Search a plug"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
        />
        <Button
          color="primary"
          text={'Add Plug'}
          onClick={() => {
            navigate('/plugs/create');
          }}
        />
      </div>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Grid container spacing={2} columns={3} style={{ paddingTop: '20px' }}>
          {searchedPlugs.map((plug) => (
            <Grid item key={plug.id}>
              <PlugCard plug={plug} onClickButton={() => setPlugEnable(!plug.enabled, plug.id)} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default PlugsPage;
