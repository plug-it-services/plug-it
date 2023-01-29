import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import InputBar from './InputBar';
import Button from './Button';

export interface ISignupCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: (username: string, password: string, firstname: string, lastname: string) => void;
}

function SignupCard({ title, description, buttonLabel, onClick }: ISignupCardProps) {
  const [email, setEmail] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Card
      sx={{
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        // beautiful gradient based on 718CDE to a darker blue
        backgroundImage: 'linear-gradient(180deg, #2757C9 0%, #718CDE 100%)',
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" color="white">
          {title}
        </Typography>
        <Typography variant="body2" color={'white'}>
          {description}
        </Typography>
        <br />
        <InputBar
          onChange={setFirstname}
          defaultDummyValue="Firstname"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
        />
        <br />
        <InputBar
          onChange={setLastname}
          defaultDummyValue="Lastname"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
        />
        <br />
        <InputBar
          onChange={setEmail}
          defaultDummyValue="Email"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
        />
        <br />
        <InputBar
          onChange={setPassword}
          defaultDummyValue="Password"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={true}
        />
        <br />
        <Button
          color="primary"
          text={buttonLabel}
          onClick={() => {
            onClick(email, password, firstname, lastname);
          }}
        />
      </CardContent>
    </Card>
  );
}

export default SignupCard;
