import { useLocation } from 'react-router-dom';

export const useMatchPath = (path) => {
  const location = useLocation();
  return location.pathname.startsWith(path);
};