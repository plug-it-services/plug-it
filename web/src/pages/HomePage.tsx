import React, { useEffect } from 'react';
import {verify} from "../utils/api";

const HomePage = () => {

  useEffect(() => {
    verify().then((isConnected: boolean) => {
      if (isConnected) window.location.href = '/services';
      else window.location.href = '/login';
    })
  });

  return (
    <div>
    </div>
  );
};

export default HomePage;
