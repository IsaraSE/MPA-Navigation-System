import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  icon,
  className = ''
}) => {
  return (
    <div className={`text-center ${className}`}>
      {icon && (
        <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
      )}
      <h2 className="mt-8 text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-gray-600">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
        <span className="text-blue-500 text-sm font-medium">Maritime Navigation</span>
        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400"></div>
      </div>
    </div>
  );
};

export default PageHeader;
