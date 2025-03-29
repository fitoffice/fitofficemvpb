import React from 'react';
import NuevoPaymentPlanPopup from '../components/Clients/NuevoPaymentPlanPopup';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { servicioId } = useParams();
  const isDarkMode = false; // You can implement dark mode logic here or pass it through context

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleAdd = (paymentPlan: any) => {
    // Implement your add logic here
    console.log('Adding payment plan:', paymentPlan);
    navigate(-1); // Go back after adding
  };

  return (
    <NuevoPaymentPlanPopup
      isOpen={true}
      onClose={handleClose}
      onAdd={handleAdd}
      isDarkMode={isDarkMode}
      servicioId={servicioId || ''}
    />
  );
};

export default PaymentPlanPage;
