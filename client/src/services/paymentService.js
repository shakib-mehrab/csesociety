import api from './api';

export const getAllPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};
