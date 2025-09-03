import React from 'react';

interface BeautifulMotorcycleAnimationProps {
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BeautifulMotorcycleAnimation: React.FC<BeautifulMotorcycleAnimationProps> = ({
  isActive = true,
  size = 'medium',
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 50 },
    medium: { width: 160, height: 100 },
    large: { width: 240, height: 150 }
  };

  const currentSize = sizeConfig[size];

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: currentSize.width,
        height: currentSize.height
      }}
    >
      <style jsx>{`
        @keyframes motorcycle-bounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1deg); }
          75% { transform: translateY(3px) rotate(1deg); }
        }

        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes exhaust-smoke {
          0% { opacity: 0.8; transform: scale(0.5) translateX(0px); }
          50% { opacity: 0.4; transform: scale(1) translateX(-10px); }
          100% { opacity: 0; transform: scale(1.5) translateX(-20px); }
        }

        @keyframes speed-lines {
          0% { opacity: 0; transform: translateX(20px); }
          50% { opacity: 1; transform: translateX(0px); }
          100% { opacity: 0; transform: translateX(-20px); }
        }

        @keyframes headlight-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .motorcycle-body {
          animation: ${isActive ? 'motorcycle-bounce 1.5s ease-in-out infinite' : 'none'};
        }

        .wheel-rotation {
          animation: ${isActive ? 'wheel-spin 0.3s linear infinite' : 'none'};
          transform-origin: center;
        }

        .exhaust-puff {
          animation: ${isActive ? 'exhaust-smoke 1s ease-out infinite' : 'none'};
        }

        .speed-line {
          animation: ${isActive ? 'speed-lines 0.8s ease-out infinite' : 'none'};
        }

        .headlight {
          animation: ${isActive ? 'headlight-glow 2s ease-in-out infinite' : 'none'};
        }
      `}</style>

      {/* Beautiful Professional Motorcycle */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 240 150"
        className="drop-shadow-2xl"
      >
        <defs>
          {/* Gradients for realistic effects */}
          <linearGradient id="bikeBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="30%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <linearGradient id="riderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Road shadow */}
        <ellipse cx="120" cy="140" rx="80" ry="6" fill="rgba(0,0,0,0.2)" />

        {/* Speed lines (when active) */}
        {isActive && (
          <g className="speed-line" opacity="0.7">
            <line x1="30" y1="90" x2="10" y2="90" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <line x1="35" y1="100" x2="15" y2="100" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="110" x2="20" y2="110" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
            <line x1="25" y1="80" x2="5" y2="80" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        <g className="motorcycle-body">
          {/* Front Wheel */}
          <g className="wheel-rotation">
            <circle cx="60" cy="115" r="20" fill="url(#wheelGradient)" stroke="#000" strokeWidth="2"/>
            <circle cx="60" cy="115" r="15" fill="#4b5563" stroke="#374151" strokeWidth="1"/>
            <circle cx="60" cy="115" r="8" fill="#6b7280"/>
            <circle cx="60" cy="115" r="3" fill="#9ca3af"/>
            {/* Spokes */}
            <g stroke="#d1d5db" strokeWidth="1.5" opacity="0.8">
              <line x1="60" y1="95" x2="60" y2="135"/>
              <line x1="40" y1="115" x2="80" y2="115"/>
              <line x1="46" y1="101" x2="74" y2="129"/>
              <line x1="74" y1="101" x2="46" y2="129"/>
            </g>
          </g>

          {/* Rear Wheel */}
          <g className="wheel-rotation">
            <circle cx="180" cy="115" r="20" fill="url(#wheelGradient)" stroke="#000" strokeWidth="2"/>
            <circle cx="180" cy="115" r="15" fill="#4b5563" stroke="#374151" strokeWidth="1"/>
            <circle cx="180" cy="115" r="8" fill="#6b7280"/>
            <circle cx="180" cy="115" r="3" fill="#9ca3af"/>
            {/* Spokes */}
            <g stroke="#d1d5db" strokeWidth="1.5" opacity="0.8">
              <line x1="180" y1="95" x2="180" y2="135"/>
              <line x1="160" y1="115" x2="200" y2="115"/>
              <line x1="166" y1="101" x2="194" y2="129"/>
              <line x1="194" y1="101" x2="166" y2="129"/>
            </g>
          </g>

          {/* Main bike frame */}
          <path d="M80 115 L160 115 L150 75 L90 75 Z" fill="url(#bikeBodyGradient)" stroke="#1e40af" strokeWidth="2"/>
          <path d="M80 115 L60 95 L70 75 L90 75" fill="url(#bikeBodyGradient)" stroke="#1e40af" strokeWidth="1"/>
          <path d="M160 115 L180 95 L170 75 L150 75" fill="url(#bikeBodyGradient)" stroke="#1e40af" strokeWidth="1"/>

          {/* Fuel tank */}
          <ellipse cx="120" cy="85" rx="25" ry="12" fill="url(#bikeBodyGradient)" stroke="#1e40af" strokeWidth="1"/>

          {/* Seat */}
          <ellipse cx="140" cy="70" rx="20" ry="8" fill="#374151" stroke="#1f2937" strokeWidth="1"/>

          {/* Handlebars */}
          <path d="M75 80 L45 65 M75 80 L45 95" stroke="#4b5563" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="45" cy="65" r="3" fill="#9ca3af"/>
          <circle cx="45" cy="95" r="3" fill="#9ca3af"/>

          {/* Headlight with glow effect */}
          <circle cx="35" cy="80" r="8" fill="url(#headlightGlow)" className="headlight" filter="url(#glow)"/>
          <circle cx="35" cy="80" r="5" fill="#fef3c7"/>

          {/* Rider */}
          <circle cx="115" cy="55" r="12" fill="url(#riderGradient)"/>
          <ellipse cx="115" cy="70" rx="8" ry="15" fill="#3b82f6"/>
          <ellipse cx="110" cy="85" rx="4" ry="10" fill="#1d4ed8"/>
          <ellipse cx="120" cy="85" rx="4" ry="10" fill="#1d4ed8"/>

          {/* Helmet with visor */}
          <circle cx="115" cy="55" r="15" fill="url(#helmetGradient)" stroke="#7f1d1d" strokeWidth="1"/>
          <ellipse cx="115" cy="50" rx="10" ry="5" fill="rgba(255,255,255,0.3)"/>
          <ellipse cx="115" cy="50" rx="8" ry="3" fill="rgba(59, 130, 246, 0.4)"/>

          {/* Pizza delivery box */}
          <rect x="165" y="65" width="20" height="15" fill="#dc2626" stroke="#991b1b" strokeWidth="1" rx="2"/>
          <rect x="167" y="67" width="16" height="11" fill="#fbbf24" rx="1"/>
          <text x="175" y="75" fontSize="8" fill="#dc2626" textAnchor="middle" fontWeight="bold">🍕</text>

          {/* Exhaust pipe */}
          <ellipse cx="200" cy="105" rx="8" ry="3" fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
          <ellipse cx="208" cy="105" rx="3" ry="1.5" fill="#9ca3af"/>

          {/* Exhaust smoke (when active) */}
          {isActive && (
            <>
              <g className="exhaust-puff">
                <circle cx="215" cy="103" r="2" fill="#d1d5db" opacity="0.6"/>
                <circle cx="218" cy="101" r="1.5" fill="#e5e7eb" opacity="0.4"/>
                <circle cx="221" cy="99" r="1" fill="#f3f4f6" opacity="0.3"/>
              </g>
              <g className="exhaust-puff" style={{ animationDelay: '0.3s' }}>
                <circle cx="213" cy="107" r="1.8" fill="#d1d5db" opacity="0.5"/>
                <circle cx="216" cy="105" r="1.2" fill="#e5e7eb" opacity="0.3"/>
              </g>
              <g className="exhaust-puff" style={{ animationDelay: '0.6s' }}>
                <circle cx="217" cy="104" r="1.5" fill="#e5e7eb" opacity="0.4"/>
              </g>
            </>
          )}
        </g>
      </svg>

      {/* Enhanced glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 via-indigo-400/20 to-purple-400/10 blur-xl animate-pulse"></div>
      )}
    </div>
  );
};

export default BeautifulMotorcycleAnimation;
