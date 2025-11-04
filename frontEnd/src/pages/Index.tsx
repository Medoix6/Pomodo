import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('pomodo-user');
    if (user) {
      navigate('/app');
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return null;
};

export default Index;
