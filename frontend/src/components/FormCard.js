import React from 'react';

const FormCard = ({
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 ${className}`}>
      {children}
    </div>
  );
};

export default FormCard;
