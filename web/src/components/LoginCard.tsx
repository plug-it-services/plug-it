// Login Card
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import InputBar from './InputBar';
import Button from './Button';
import LoginWithCard from './LoginWithCard';

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
        width: 500,
        height: 550,
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
      </CardContent>
      <Button
        color="primary"
        text={buttonLabel}
        onClick={() => {
          onClick(email, password);
        }}
      />
      <br />
      <Typography variant="body1" color={'white'}>
        Or
      </Typography>
      <br />
      <LoginWithCard
        title="External Login"
        description="Login with any of the following services!"
        iconList={[
          { service: 'Google', icon: 'https://img.icons8.com/color/48/000000/google-logo.png' },
          { service: 'Facebook', icon: 'https://img.icons8.com/color/48/000000/facebook-new.png' },
          { service: 'Twitter', icon: 'https://img.icons8.com/color/48/000000/twitter--v1.png' },
          { service: 'Github', icon: 'https://img.icons8.com/color/48/000000/github--v1.png' },
          { service: 'Discord', icon: 'https://img.icons8.com/color/48/000000/discord-logo.png' },
        ]}
        onClick={(service) => {
          alert(`Login with ${service}!`);
        }}
      />
    </Card>
  );
}

export default LoginCard;
