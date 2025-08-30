
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header';
import HeroNew from '../components/HeroNew';
import OrderTrackingSection from '../components/OrderTrackingSection';


import WhyChooseUsSection from '../components/WhyChooseUsSection';
import FlegreaPizzaSection from '../components/FlegreaPizzaSection';
import Products from '../components/Products';
import Gallery from '../components/Gallery';

import About from '../components/About';
import ServicesSection from '../components/ServicesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import BusinessHoursBanner from '../components/BusinessHoursBanner';
import WebsitePopup from '../components/WebsitePopup';
// Pizzeria Regina 2000 Torino - Complete transformation


const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      {/* Header with elegant entrance */}
      <div className="animate-elegant-fade-in-down">
        <Header />
      </div>

      {/* Business Hours Banner with subtle animation */}
      <div className="animate-elegant-fade-in-up animate-stagger-1">
        <BusinessHoursBanner />
      </div>

      {/* Hero Section with dramatic entrance */}
      <ErrorBoundary componentName="Hero">
        <div className="animate-elegant-scale-in animate-stagger-2">
          <HeroNew />
        </div>
      </ErrorBoundary>

      <div className="overflow-x-hidden" style={{ marginTop: 0, paddingTop: 0 }}>
        {/* Order Tracking with smooth entrance */}
        <ErrorBoundary componentName="OrderTrackingSection">
          <div className="animate-elegant-fade-in-up animate-stagger-3 hover-card-lift" style={{ marginTop: 0, paddingTop: 0 }}>
            <OrderTrackingSection />
          </div>
        </ErrorBoundary>

        {/* Why Choose Us with left slide */}
        <ErrorBoundary componentName="WhyChooseUsSection">
          <div className="animate-elegant-fade-in-left animate-stagger-4 hover-gentle-scale">
            <WhyChooseUsSection />
          </div>
        </ErrorBoundary>

        {/* Flegrea Pizza with right slide */}
        <ErrorBoundary componentName="FlegreaPizzaSection">
          <div className="animate-elegant-fade-in-right animate-stagger-5 hover-card-lift">
            <FlegreaPizzaSection />
          </div>
        </ErrorBoundary>

        {/* Products with scale entrance */}
        <ErrorBoundary componentName="Products">
          <div className="animate-elegant-scale-in animate-stagger-6 hover-elegant-glow">
            <Products />
          </div>
        </ErrorBoundary>

        {/* Gallery with elegant fade */}
        <ErrorBoundary componentName="Gallery">
          <div className="animate-elegant-fade-in-up animate-stagger-7 hover-card-lift">
            <Gallery />
          </div>
        </ErrorBoundary>

        {/* About with slide up */}
        <ErrorBoundary componentName="About">
          <div className="animate-slide-in-up animate-stagger-8 hover-gentle-scale">
            <About />
          </div>
        </ErrorBoundary>

        {/* Services with left entrance */}
        <ErrorBoundary componentName="ServicesSection">
          <div className="animate-elegant-fade-in-left animate-stagger-9 hover-card-lift">
            <ServicesSection />
          </div>
        </ErrorBoundary>

        {/* Contact with elegant entrance */}
        <ErrorBoundary componentName="ContactSection">
          <div className="animate-elegant-fade-in-up animate-stagger-10 hover-elegant-glow">
            <ContactSection />
          </div>
        </ErrorBoundary>

        {/* Footer with final fade */}
        <ErrorBoundary componentName="Footer">
          <div className="animate-elegant-fade-in-up animate-stagger-10">
            <Footer />
          </div>
        </ErrorBoundary>
      </div>

      {/* Website Popup - Global popup system with elegant entrance */}
      <ErrorBoundary componentName="WebsitePopup">
        <div className="animate-elegant-scale-in">
          <WebsitePopup />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
