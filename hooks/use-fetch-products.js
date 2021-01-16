import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    axios
      .get('/api/products')
      .then((res) => mounted && setProducts(res.data.products))
      .catch((error) => mounted && setError(true));

      return () => (mounted = false)
  },[]);

  return {products, error};
}