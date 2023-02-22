import { useEffect, useState } from 'react';
import { AppBar, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import Button from './Button';
import AccountTile from './AccountTile';
import { getUserInfos, logout, UserInfos } from '../utils/api';

export interface IHeaderProps {
  title: string;
  area: string;
}

function Header({ title }: IHeaderProps) {
  const [showBasic, setShowBasic] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfos | null>(null);

  function onDisconnect() {
    logout().finally(() => {
      localStorage.removeItem('crsf-token');
      navigate('/login');
    });
  }

  useEffect(() => {
    getUserInfos().then((userInfos) => {
      setUser(userInfos);
    });
  }, []);

  /* return (
    <AppBar position="static" style={{ backgroundColor: '#EAF1FF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '80px', verticalAlign: 'middle' }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={'primary'}
          style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}
        >
          <Link href="/">{title}</Link>
        </Typography>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button
            color="primary"
            text={'Services'}
            onClick={() => {
              window.location.href = '/services';
            }}
          />
          <Button
            color="primary"
            text={'PLUGS'}
            onClick={() => {
              window.location.href = '/plugs';
            }}
          />
          <AccountTile
            name={user?.lastname || ''}
            firstName={user?.firstname || ''}
            id={user?.id || -1}
            email={user?.email || ''}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </AppBar>
  ); */
  return (
    <MDBNavbar expand="lg" light style={{ backgroundColor: '#EAF1FF' }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href="#">
          <Typography
            variant="h4"
            fontWeight="bold"
            color={'primary'}
            style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}
          >
            <Link href="/">{title}</Link>
          </Typography>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" color={'primary'} fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className="justify-content-end mr-auto mb-2 mb-lg-0">
            <MDBNavbarItem className={'d-lg-none'}>
              <MDBNavbarLink tabIndex={-1} href={'/services'} aria-disabled="true" color="primary">
                Services
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className={'me-2 d-none d-lg-block'}>
              <Button
                color="primary"
                text={'Services'}
                onClick={() => {
                  window.location.href = '/services';
                }}
              />
            </MDBNavbarItem>
            <MDBNavbarItem className={'d-lg-none'}>
              <MDBNavbarLink tabIndex={-1} href={'/plugs'} aria-disabled="true" color="primary">
                Plugs
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className={'me-2 d-none d-lg-block'}>
              <Button
                color="primary"
                text={'PLUGS'}
                onClick={() => {
                  window.location.href = '/plugs';
                }}
              />
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Header;
