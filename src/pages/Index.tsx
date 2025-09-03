
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header';
import HeroNew from '../components/HeroNew';


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
// Efes Kebap Torino - Complete transformation


const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <BusinessHoursBanner />
      <ErrorBoundary componentName="Hero">
        <HeroNew />
      </ErrorBoundary>

      <div className="overflow-x-hidden" style={{ marginTop: 0, paddingTop: 0 }}>
        <ErrorBoundary componentName="WhyChooseUsSection">
          <div className="animate-fade-in-up animate-stagger-2">
            <WhyChooseUsSection />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="FlegreaPizzaSection">
          <div className="animate-fade-in-up animate-stagger-3">
            <FlegreaPizzaSection />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="Products">
          <div className="animate-fade-in-up animate-stagger-4">
            <Products />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="Gallery">
          <div className="animate-fade-in-up animate-stagger-5">
            <Gallery />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="About">
          <div className="animate-slide-in-up animate-stagger-6">
            <About />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="ServicesSection">
          <div className="animate-fade-in-up animate-stagger-7">
            <ServicesSection />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="ContactSection">
          <div className="animate-fade-in-up animate-stagger-8">
            <ContactSection />
          </div>
        </ErrorBoundary>

        <ErrorBoundary componentName="Footer">
          <div className="animate-fade-in-up animate-stagger-10">
            <Footer />
          </div>
        </ErrorBoundary>
      </div>

      {/* Website Popup - Global popup system */}
      <ErrorBoundary componentName="WebsitePopup">
        <WebsitePopup />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
