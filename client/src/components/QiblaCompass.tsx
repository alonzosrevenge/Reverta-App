import { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';

interface QiblaCompassProps {
  theme?: 'orange' | 'yellow' | 'amber' | 'purple' | 'indigo';
}

export function QiblaCompass({ theme = 'purple' }: QiblaCompassProps) {
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [compassSupported, setCompassSupported] = useState(true);

  // Theme color mappings
  const themeColors = {
    orange: 'from-orange-400 to-yellow-400',
    yellow: 'from-yellow-400 to-orange-400',
    amber: 'from-amber-400 to-orange-400',
    purple: 'from-purple-400 to-pink-400',
    indigo: 'from-indigo-400 to-blue-400'
  };

  const themeAccent = {
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400'
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Set timeout to handle stuck loading
    timeoutId = setTimeout(() => {
      if (!userLocation) {
        setPermissionDenied(true);
      }
    }, 10000); // 10 second timeout

    // Check if device orientation is supported
    if (!window.DeviceOrientationEvent) {
      setCompassSupported(false);
      clearTimeout(timeoutId);
      return;
    }

    // Request location for Qibla calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Calculate Qibla direction (Kaaba coordinates: 21.4225, 39.8262)
          const qibla = calculateQiblaDirection(latitude, longitude, 21.4225, 39.8262);
          setQiblaDirection(qibla);
          clearTimeout(timeoutId);
        },
        (error) => {
          console.error('Location error:', error);
          setPermissionDenied(true);
          clearTimeout(timeoutId);
        },
        { 
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    } else {
      setPermissionDenied(true);
      clearTimeout(timeoutId);
    }

    // Handle device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Convert to 0-360 degrees
        let heading = 360 - event.alpha;
        if (heading < 0) heading += 360;
        if (heading >= 360) heading -= 360;
        setCurrentHeading(heading);
      }
    };

    // For iOS 13+ devices, request permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          } else {
            console.log('Device orientation permission denied');
          }
        })
        .catch((error: any) => {
          console.log('Device orientation permission error:', error);
        });
    } else {
      // For non-iOS devices
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearTimeout(timeoutId);
    };
  }, []);

  // Calculate Qibla direction using spherical trigonometry
  const calculateQiblaDirection = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLngRad = toRadians(lng2 - lng1);

    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const getRelativeQiblaDirection = (): number => {
    if (qiblaDirection === null) return 0;
    let relative = qiblaDirection - currentHeading;
    if (relative < 0) relative += 360;
    if (relative >= 360) relative -= 360;
    return relative;
  };

  const isPointingToQibla = (): boolean => {
    if (qiblaDirection === null) return false;
    const relative = getRelativeQiblaDirection();
    return Math.abs(relative) < 15 || Math.abs(relative - 360) < 15;
  };

  if (!compassSupported) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 text-center">
        <Compass className={`w-8 h-8 mx-auto mb-3 ${themeAccent[theme]}`} />
        <p className="text-slate-300 font-medium mb-2">Compass Not Supported</p>
        <p className="text-slate-400 text-sm">
          Your device doesn't support compass functionality. Please use a physical compass or Qibla app.
        </p>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 text-center">
        <MapPin className={`w-8 h-8 mx-auto mb-3 ${themeAccent[theme]}`} />
        <p className="text-slate-300 font-medium mb-2">Location Access Needed</p>
        <p className="text-slate-400 text-sm mb-4">
          Please enable location permissions or use a manual compass. The Qibla direction is towards Mecca (southeast from most locations).
        </p>
        <div className="space-y-2">
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-full bg-gradient-to-r ${themeColors[theme]} text-black font-medium text-sm hover:scale-105 transition-transform mr-2`}
          >
            Retry
          </button>
          <button 
            onClick={() => {
              // Set a default location (New York) for demonstration
              setUserLocation({ lat: 40.7128, lng: -74.0060 });
              const qibla = calculateQiblaDirection(40.7128, -74.0060, 21.4225, 39.8262);
              setQiblaDirection(qibla);
              setPermissionDenied(false);
            }}
            className="px-4 py-2 rounded-full bg-slate-600 text-slate-200 font-medium text-sm hover:bg-slate-500 transition-colors"
          >
            Use Demo Mode
          </button>
        </div>
      </div>
    );
  }

  if (!userLocation || qiblaDirection === null) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-slate-600 border-t-purple-400 rounded-full mx-auto mb-3"></div>
        <p className="text-slate-300 font-medium">Finding Qibla Direction...</p>
        <p className="text-slate-400 text-sm mt-1">Getting your location</p>
      </div>
    );
  }

  const relativeQibla = getRelativeQiblaDirection();
  const isAligned = isPointingToQibla();

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-slate-200 mb-1">Qibla Compass</h3>
        <p className="text-slate-400 text-sm">Point your device towards Mecca</p>
      </div>

      {/* Compass */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        {/* Compass base */}
        <div className="absolute inset-0 rounded-full bg-slate-700/30 border-2 border-slate-600/50">
          {/* Direction markers */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs font-bold">N</div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs font-bold">E</div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs font-bold">S</div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs font-bold">W</div>
        </div>

        {/* Compass needle (current heading) */}
        <div 
          className="absolute inset-4 rounded-full border border-slate-500/30"
          style={{ transform: `rotate(${currentHeading}deg)` }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className="w-1 h-8 bg-red-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
            <div className="w-1 h-8 bg-slate-400 rounded-full"></div>
          </div>
        </div>

        {/* Qibla direction indicator */}
        <div 
          className="absolute inset-6 rounded-full"
          style={{ transform: `rotate(${relativeQibla}deg)` }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div className={`w-2 h-6 bg-gradient-to-b ${themeColors[theme]} rounded-full ${isAligned ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
      </div>

      {/* Status */}
      <div className="text-center">
        {isAligned ? (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${themeColors[theme]} text-black font-medium`}>
            <Navigation className="w-4 h-4" />
            <span>Aligned with Qibla!</span>
          </div>
        ) : (
          <div className="text-slate-300">
            <p className="font-medium">Qibla Direction: {Math.round(relativeQibla)}°</p>
            <p className="text-slate-400 text-sm mt-1">
              {relativeQibla < 180 ? 'Turn right' : 'Turn left'} to align
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
        <p className="text-slate-400 text-xs">
          Hold device flat and away from magnetic interference
        </p>
      </div>
    </div>
  );
}