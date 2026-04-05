export const earthMeasurements = {
  circumference: {
    value: 25000,
    unit: 'milhas',
    source: 'Flat Earth Society',
    description: 'Circunferência do disco terrestre medida a partir do Equador até a muralha de gelo'
  },
  radius: {
    value: 3982,
    unit: 'milhas',
    source: 'Cálculo',
    description: 'Raio do disco = Circumferência / (2 × π)'
  },
  altitudeSun: {
    value: 3000,
    unit: 'milhas',
    source: 'Estimativa',
    description: 'Altitude estimada do Sol acima do plano terrestre'
  },
  altitudeMoon: {
    value: 2500,
    unit: 'milhas',
    source: 'Estimativa',
    description: 'Altitude estimada da Lua acima do plano terrestre'
  },
  altitudeStars: {
    value: 3500,
    unit: 'milhas',
    source: 'Estimativa',
    description: 'Altitude das estrelas fixas no firmamento'
  },
  altitudeFirmament: {
    value: 4000,
    unit: 'milhas',
    source: 'Interpretação bíblica',
    description: 'Altitude do firmamento sólido (raqia) acima do plano terrestre'
  }
};

export const orbitalCalculations = {
  sunOrbit: (hours) => {
    const angularSpeed = (2 * Math.PI) / 24;
    const angle = hours * angularSpeed;
    const radius = 1000;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      y: 600,
      angle: angle
    };
  },
  
  moonOrbit: (hours) => {
    const angularSpeed = (2 * Math.PI) / 24.8;
    const angle = hours * angularSpeed;
    const radius = 800;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      y: 500,
      angle: angle
    };
  },
  
  siderealDay: 23.93,
  solarDay: 24.0,
  lunarMonth: 24.8
};

export const celestialPositions = {
  calculateAzimuthalPosition: (ra, dec, observerLat) => {
    const latRad = observerLat * (Math.PI / 180);
    const raRad = ra * (Math.PI / 180);
    const decRad = dec * (Math.PI / 180);
    
    const hourAngle = (Date.now() / 3600000) * 15 * (Math.PI / 180);
    const ha = hourAngle - raRad;
    
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha);
    const altitude = Math.asin(sinAlt);
    
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * Math.sin(altitude)) / (Math.cos(latRad) * Math.cos(altitude));
    let azimuth = Math.acos(cosAz);
    
    if (Math.sin(ha) > 0) {
      azimuth = 2 * Math.PI - azimuth;
    }
    
    return {
      altitude: altitude * (180 / Math.PI),
      azimuth: azimuth * (180 / Math.PI)
    };
  },
  
  sunPosition: (date = new Date()) => {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const declination = 23.45 * Math.sin((360/365) * (dayOfYear - 81) * (Math.PI / 180));
    
    const hour = date.getHours() + date.getMinutes() / 60;
    const hourAngle = (hour - 12) * 15;
    
    return {
      declination: declination,
      hourAngle: hourAngle,
      altitude: 90 - observerLat + declination - Math.abs(hourAngle) * 0.1
    };
  },
  
  moonPhase: (date = new Date()) => {
    const synodicMonth = 29.53;
    const knownNewMoon = new Date('2000-01-06T18:14:00Z');
    const daysSinceNewMoon = (date - knownNewMoon) / 86400000;
    const cyclePosition = (daysSinceNewMoon % synodicMonth) / synodicMonth;
    const phase = Math.round(cyclePosition * 8);
    
    const phaseNames = ['Lua Nova', 'Lua Crescente', 'Quarto Crescente', 'Gibosa Crescente', 
                       'Lua Cheia', 'Gibosa Minguante', 'Quarto Minguante', 'Lua Minguante'];
    
    return {
      phase: phase,
      name: phaseNames[phase],
      illumination: Math.round(50 * (1 - Math.cos(cyclePosition * 2 * Math.PI)))
    };
  }
};

export const biblicalDimensions = {
  cubitToMeters: 0.45,
  cubitToFeet: 1.48,
  
  measurements: {
    noahsArk: {
      length: 300,
      unit: 'côvados',
      meters: 135,
      feet: 443,
      description: 'Em Gênesis 6:15, a arca tinha 300 côvados de comprimento'
    },
    templeSolomon: {
      length: 60,
      width: 20,
      height: 30,
      unit: 'côvados',
      description: 'O templo de Salomão em 1 Reis 6:2'
    },
    golias: {
      height: 6,
      unit: 'côvados',
      feet: 9,
      description: 'A altura de Golias em 1 Samuel 17:4'
    },
    muralOfJericho: {
      thickness: 10,
      unit: 'côvados',
      feet: 15,
      description: 'Espessura estimada das muralhas de Jericó'
    }
  }
};

export const flatEarthMath = {
  distanceToHorizon: (heightInMeters) => {
    const earthRadius = 6371000;
    return Math.sqrt(2 * earthRadius * heightInMeters + heightInMeters * heightInMeters);
  },
  
  distanceToHorizonMiles: (heightInFeet) => {
    const earthRadius = 3959;
    return Math.sqrt(2 * earthRadius * (heightInFeet / 5280)) * 1.15;
  },
  
  sunVisibility: (observerHeight, sunAltitude) => {
    const horizonDistance = flatEarthMath.distanceToHorizon(observerHeight);
    const sunDistance = sunAltitude * 1.15;
    return sunDistance > horizonDistance;
  },
  
  calculateSunPath: (latitude, dayOfYear) => {
    const declination = 23.45 * Math.sin((360/365) * (dayOfYear - 81) * (Math.PI / 180));
    const paths = [];
    
    for (let hour = 0; hour <= 24; hour += 1) {
      const hourAngle = (hour - 12) * 15;
      const altitude = 90 - latitude + declination - Math.abs(hourAngle) * 0.1;
      
      if (altitude > 0) {
        paths.push({ hour, altitude: Math.max(0, altitude), azimuth: hour * 15 });
      }
    }
    
    return paths;
  }
};

export default { 
  earthMeasurements, 
  orbitalCalculations, 
  celestialPositions, 
  biblicalDimensions, 
  flatEarthMath 
};
