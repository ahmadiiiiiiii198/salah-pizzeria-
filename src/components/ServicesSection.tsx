import React from 'react';
import { 
  Calendar, 
  Thermometer, 
  Truck, 
  Users, 
  ShoppingBag, 
  Wifi, 
  Heart 
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Calendar className="w-12 h-12 text-pizza-red" />,
      title: "Disponibilità eventi business",
      description: "Organizziamo eventi aziendali e business con menu personalizzati"
    },
    {
      icon: <Thermometer className="w-12 h-12 text-pizza-orange" />,
      title: "Aria condizionata",
      description: "Ambiente climatizzato per il massimo comfort durante la tua visita"
    },
    {
      icon: <Truck className="w-12 h-12 text-pizza-green" />,
      title: "Consegna a domicilio",
      description: "Consegniamo le nostre pizze direttamente a casa tua"
    },
    {
      icon: <Users className="w-12 h-12 text-pizza-red" />,
      title: "Eventi privati",
      description: "Organizziamo feste private e celebrazioni speciali"
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-pizza-orange" />,
      title: "Take away",
      description: "Ordina e ritira le tue pizze preferite da asporto"
    },
    {
      icon: <Wifi className="w-12 h-12 text-pizza-green" />,
      title: "Wi-Fi gratuito",
      description: "Connessione internet gratuita per tutti i nostri clienti"
    },
    {
      icon: <Heart className="w-12 h-12 text-pizza-red" />,
      title: "Accettiamo animali domestici",
      description: "I tuoi amici a quattro zampe sono i benvenuti"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-4 font-fredoka">
            <span className="text-pizza-red italic">I Nostri Servizi</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pizza-red to-pizza-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-roboto">
            Scopri tutti i servizi che offriamo per rendere la tua esperienza indimenticabile
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl group-hover:from-pizza-red/10 group-hover:to-pizza-orange/10 transition-all duration-300">
                  {service.icon}
                </div>
              </div>

              {/* Service Title */}
              <h3 className="text-lg font-semibold text-pizza-dark text-center mb-3 font-fredoka leading-tight">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-gray-600 text-center text-sm leading-relaxed font-roboto">
                {service.description}
              </p>

              {/* Decorative Element */}
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-pizza-red to-pizza-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-pizza-red text-2xl">🍕</span>
            <span className="text-gray-700 font-medium font-roboto">
              Vieni a scoprire tutti i nostri servizi!
            </span>
            <span className="text-pizza-orange text-2xl">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
