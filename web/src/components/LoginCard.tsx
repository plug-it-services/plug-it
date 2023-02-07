// Login Card
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import InputBar from './InputBar';
import Button from './Button';

export interface ILoginCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: (username: string, password: string) => void;
}

function LoginCard({ title, description, buttonLabel, onClick }: ILoginCardProps) {
  const [email, setEmail] = React.useState('');
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
          onChange={setEmail}
          placeholder="Email"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={false}
          autoComplete="username"
        />
        <br />
        <InputBar
          onChange={setPassword}
          placeholder="Password"
          textColor="black"
          backgroundColor="#EAF1FF"
          borderColor="#EAF1FF"
          isPassword={true}
          autoComplete="current-password"
        />
        <br />
        <Button
          color="primary"
          text={buttonLabel}
          onClick={() => {
            onClick(email, password);
          }}
        />
      </CardContent>
    </Card>
  );
}

export default LoginCard;
