import { useState } from 'react';
import { Typography } from '@mui/material';
import { MDBCard, MDBCardBody, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import InputBar from './InputBar';
import Button from './Button';

export interface ILoginCardProps {
  title: string;
  description: string;
  onClick: (username: string, password: string) => void;
}

function LoginCard({ title, description, onClick }: ILoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <MDBCard
      className={'login-card text-reset col-xs-12 col-md-6 col-lg-3'}
      style={{
        backgroundImage: 'linear-gradient(180deg, #2757C9 0%, #718CDE 100%)',
      }}
    >
      <MDBCardBody>
        <MDBTypography tag="div" variant={'h3'} color="white">
          {title}
        </MDBTypography>
        <MDBTypography tag="p" color="white">
          <a className={'text-white text-decoration-underline'} href={'/signup'}>
            Create account
          </a>
        </MDBTypography>
        <MDBRow className={'py-3'}>
          <InputBar
            onChange={setEmail}
            placeholder="Email"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            autoComplete="username"
            onSubmit={() => {}}
          />
        </MDBRow>
        <MDBRow className={'pb-3'}>
          <InputBar
            onChange={setPassword}
            placeholder="Password"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={true}
            autoComplete="current-password"
            onSubmit={() => onClick(email, password)}
          />
        </MDBRow>
        <Button
          color="primary"
          text={'Login'}
          onClick={() => {
            onClick(email, password);
          }}
        />
      </MDBCardBody>
    </MDBCard>
  );
}

export default LoginCard;
