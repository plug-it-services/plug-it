import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
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
    <Card
      className={'login-card'}
      sx={{
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
          placeholder="Firstname"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
          autoComplete="given-name"
          onSubmit={() => {}}
        />
        <br />
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
        <br />
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
        <br />
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
        <br />
        <Button
          color="primary"
          text={'Sign Up'}
          onClick={() => {
            onClick(email, password, firstname, lastname);
          }}
        />
      </CardContent>
    </Card>
  );
}

export default SignupCard;
