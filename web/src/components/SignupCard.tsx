import { useState } from 'react';
import { MDBCard, MDBCardBody, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import InputBar from './InputBar';
import Button from './Button';

export interface ISignupCardProps {
  title: string;
  description: string;
  onClick: (username: string, password: string, firstname: string, lastname: string) => void;
}

function SignupCard({ title, description, onClick }: ISignupCardProps) {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
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
          <a className={'text-white text-decoration-underline'} href={'/login'}>
            Login
          </a>
        </MDBTypography>
        <MDBRow className={'py-3'}>
          <InputBar
            onChange={setFirstname}
            placeholder="Firstname"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            autoComplete="given-name"
            onSubmit={() => {}}
          />
        </MDBRow>
        <MDBRow className={'pb-3'}>
          <InputBar
            onChange={setLastname}
            placeholder="Lastname"
            textColor="black"
            backgroundColor="#EAF1FF"
            borderColor="#EAF1FF"
            isPassword={false}
            autoComplete="family-name"
            onSubmit={() => {}}
          />
        </MDBRow>
        <MDBRow className={'pb-3'}>
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
            autoComplete="new-password"
            onSubmit={() => {}}
          />
        </MDBRow>
        <Button
          color="primary"
          text={'Signup'}
          onClick={() => {
            onClick(email, password, firstname, lastname);
          }}
        />
      </MDBCardBody>
    </MDBCard>
  );
}

export default SignupCard;
