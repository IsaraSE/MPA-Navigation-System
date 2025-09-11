// __tests__/Home.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/Home';



// Mock child components to avoid rendering complexity
jest.mock('../components/Header', () => () => <div data-testid="header" />);
jest.mock('../components/Footer', () => () => <div data-testid="footer" />);
jest.mock('../components/ShipMap', () => () => <div data-testid="shipmap" />);
jest.mock('../components/StatsCards', () => () => <div data-testid="statscards" />);
jest.mock('../components/FeaturesGrid', () => () => <div data-testid="featuresgrid" />);
jest.mock('../components/TechnologyStack', () => () => <div data-testid="technologystack" />);

describe('Home Component', () => {
  test('renders main page title', () => {
    render(<Home />);
    expect(
      screen.getByText(/Smart Maritime Navigator For Ships/i)
    ).toBeInTheDocument();
  });

  test('renders subtitle correctly', () => {
    render(<Home />);
    expect(
      screen.getByText(/Real-time vessel tracking and sustainable route optimization/i)
    ).toBeInTheDocument();
  });

  test('renders Header and Footer', () => {
    render(<Home />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders ShipMap inside the map container', () => {
    render(<Home />);
    expect(screen.getByTestId('shipmap')).toBeInTheDocument();
  });

  test('renders live status indicators', () => {
    render(<Home />);
    expect(screen.getByText(/System Status/i)).toBeInTheDocument();
    expect(screen.getByText(/GPS Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Update/i)).toBeInTheDocument();
  });

  test('renders stats section values', () => {
    render(<Home />);
    expect(screen.getByText(/2,847 nm/i)).toBeInTheDocument();
    expect(screen.getByText(/4 major routes/i)).toBeInTheDocument();
    expect(screen.getByText(/15.2 knots/i)).toBeInTheDocument();
    expect(screen.getByText(/3 monitored/i)).toBeInTheDocument();
  });
});

// Mock child components to avoid rendering complexity
jest.mock('../components/Header', () => () => <div data-testid="header" />);
jest.mock('../components/Footer', () => () => <div data-testid="footer" />);
jest.mock('../components/ShipMap', () => () => <div data-testid="shipmap" />);
jest.mock('../components/StatsCards', () => () => <div data-testid="statscards" />);
jest.mock('../components/FeaturesGrid', () => () => <div data-testid="featuresgrid" />);
jest.mock('../components/TechnologyStack', () => () => <div data-testid="technologystack" />);

describe('Home Component', () => {
  test('renders main page title', () => {
    render(<Home />);
    expect(
      screen.getByText(/Smart Maritime Navigator For Ships/i)
    ).toBeInTheDocument();
  });

  test('renders subtitle correctly', () => {
    render(<Home />);
    expect(
      screen.getByText(/Real-time vessel tracking and sustainable route optimization/i)
    ).toBeInTheDocument();
  });

  test('renders Header and Footer', () => {
    render(<Home />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders ShipMap inside the map container', () => {
    render(<Home />);
    expect(screen.getByTestId('shipmap')).toBeInTheDocument();
  });

  test('renders live status indicators', () => {
    render(<Home />);
    expect(screen.getByText(/System Status/i)).toBeInTheDocument();
    expect(screen.getByText(/GPS Accuracy/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Update/i)).toBeInTheDocument();
  });

  test('renders stats section values', () => {
    render(<Home />);
    expect(screen.getByText(/2,847 nm/i)).toBeInTheDocument();
    expect(screen.getByText(/4 major routes/i)).toBeInTheDocument();
    expect(screen.getByText(/15.2 knots/i)).toBeInTheDocument();
    expect(screen.getByText(/3 monitored/i)).toBeInTheDocument();
  });
});

