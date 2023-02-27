import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBCol, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import PlugCard from '../components/PlugCard';
import { getPlugs, setPlugEnable, Plug } from '../utils/api';
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
    <>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={() => setOpen(false)} />
      <br />
      <MDBTypography tag="h4" variant="h1" color={'primary'} className="text-center fw-bold pt-3">
        Plugs
      </MDBTypography>
      <MDBRow className="d-flex justify-content-center px-2 py-lg-3">
        <MDBCol xs="12" lg="6" className={'py-3 py-lg-0'}>
          <SearchBar
            onChange={(value) => filterResearchedPlugs(value)}
            onSearch={(value) => filterResearchedPlugs(value)}
            placeholder="Search a plug"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
          />
        </MDBCol>
        <MDBCol xs="12" lg="2" className={'text-center'}>
          <Button
            color="primary"
            text={'Add Plug'}
            onClick={() => {
              navigate('/plugs/create');
            }}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow className={'d-flex justify-content-center'}>
        {searchedPlugs.map((plug, index) => (
          <MDBCol xs="12" md="4" lg="3" key={index} className={'py-3 d-flex'}>
            <PlugCard
              plug={plug}
              onStateClickButton={() => setPlugEnable(!plug.enabled, plug.id)}
              onEditClickButton={() => {
                navigate(`/plugs/edit/${plug.id}`);
              }}
            />
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
};

export default PlugsPage;
