export const starCatalog = [
  { name: 'Polaris', az: 0, el: 85, mag: 1.98, type: 'F', constellation: 'Ursa Minor' },
  { name: 'Vega', az: 38, el: 86, mag: 0.03, type: 'A', constellation: 'Lyra' },
  { name: 'Capella', az: 50, el: 45, mag: 0.08, type: 'G', constellation: 'Auriga' },
  { name: 'Arcturus', az: 146, el: 64, mag: -0.05, type: 'K', constellation: 'Boötes' },
  { name: 'Sirius', az: 258, el: -29, mag: -1.46, type: 'A', constellation: 'Canis Major' },
  { name: 'Canopus', az: 300, el: -53, mag: -0.74, type: 'F', constellation: 'Carina' },
  { name: 'Rigel Kentaurus', az: 316, el: -60, mag: -0.27, type: 'G', constellation: 'Centaurus' },
  { name: 'Procyon', az: 245, el: 22, mag: 0.34, type: 'F', constellation: 'Canis Minor' },
  { name: 'Achernar', az: 335, el: -58, mag: 0.46, type: 'B', constellation: 'Eridanus' },
  { name: 'Betelgeuse', az: 90, el: 8, mag: 0.42, type: 'M', constellation: 'Orion' },
  { name: 'Hadar', az: 308, el: -60, mag: 0.61, type: 'B', constellation: 'Centaurus' },
  { name: 'Altair', az: 62, el: 52, mag: 0.76, type: 'A', constellation: 'Aquila' },
  { name: 'Acrux', az: 300, el: -63, mag: 0.77, type: 'B', constellation: 'Crux' },
  { name: 'Aldebaran', az: 69, el: 16, mag: 0.87, type: 'K', constellation: 'Taurus' },
  { name: 'Antares', az: 113, el: -26, mag: 0.96, type: 'M', constellation: 'Scorpius' },
  { name: 'Spica', az: 204, el: -11, mag: 0.98, type: 'B', constellation: 'Virgo' },
  { name: 'Pollux', az: 116, el: 28, mag: 1.14, type: 'K', constellation: 'Gemini' },
  { name: 'Fomalhaut', az: 16, el: -30, mag: 1.16, type: 'A', constellation: 'Piscis Austrinus' },
  { name: 'Deneb', az: 310, el: 45, mag: 1.25, type: 'A', constellation: 'Cygnus' },
  { name: 'Mimosa', az: 305, el: -60, mag: 1.25, type: 'B', constellation: 'Crux' },
  { name: 'Regulus', az: 152, el: 12, mag: 1.35, type: 'B', constellation: 'Leo' },
  { name: 'Adhara', az: 255, el: -29, mag: 1.50, type: 'B', constellation: 'Canis Major' },
  { name: 'Shaula', az: 97, el: -37, mag: 1.62, type: 'B', constellation: 'Scorpius' },
  { name: 'Castor', az: 113, el: 34, mag: 1.58, type: 'A', constellation: 'Gemini' },
  { name: 'Gacrux', az: 297, el: -57, mag: 1.63, type: 'M', constellation: 'Crux' },
  { name: 'Bellatrix', az: 97, el: 7, mag: 1.64, type: 'B', constellation: 'Orion' },
  { name: 'Elnath', az: 81, el: 18, mag: 1.65, type: 'B', constellation: 'Taurus' },
  { name: 'Miaplacidus', az: 284, el: -70, mag: 1.68, type: 'A', constellation: 'Carina' },
  { name: 'Alnulam', az: 96, el: -1, mag: 1.69, type: 'B', constellation: 'Orion' },
  { name: 'Polaris Australis', az: 327, el: -87, mag: 1.94, type: 'F', constellation: 'Octans' }
];

export const spectralColors = {
  'O': '#9bb0ff',
  'B': '#aabfff',
  'A': '#cad7ff',
  'F': '#f8f7ff',
  'G': '#fff4ea',
  'K': '#ffd2a1',
  'M': '#ffcc6f'
};

export function starToCartesian(azimuthDeg, elevationDeg, domeRadius = 2195) {
  const az = (azimuthDeg - 90) * (Math.PI / 180);
  const el = elevationDeg * (Math.PI / 180);
  
  const r = domeRadius * Math.cos(el);
  const x = r * Math.cos(az);
  const z = r * Math.sin(az);
  const y = domeRadius * Math.sin(el);
  
  return { x, y, z };
}

export function cartesianToStar(x, y, z, domeRadius = 2195) {
  const r = Math.sqrt(x * x + z * z);
  const elevation = Math.atan2(y, r) * (180 / Math.PI);
  const azimuth = (Math.atan2(x, z) * (180 / Math.PI) + 90 + 360) % 360;
  
  return { azimuth, elevation };
}

export function sunOrbitPosition(dayOfYear, hourOfDay = 12) {
  const dayAngle = (dayOfYear / 365) * 2 * Math.PI;
  const hourAngle = ((hourOfDay - 12) / 12) * Math.PI;
  
  const baseRadius = 1200;
  const seasonalVariation = Math.sin(dayAngle) * 400;
  const orbitalRadius = baseRadius + seasonalVariation;
  
  const x = orbitalRadius * Math.cos(hourAngle);
  const z = orbitalRadius * Math.sin(hourAngle);
  const y = 600 + Math.sin(dayAngle) * 200;
  
  return { x, y, z };
}

export function moonOrbitPosition(dayOfMonth, hourOfDay = 12) {
  const monthAngle = (dayOfMonth / 29.53) * 2 * Math.PI;
  const hourAngle = ((hourOfDay - 12) / 12) * Math.PI;
  
  const orbitalRadius = 900;
  
  const x = orbitalRadius * Math.cos(hourAngle + monthAngle * 0.5);
  const z = orbitalRadius * Math.sin(hourAngle + monthAngle * 0.5);
  const y = 450 + Math.sin(monthAngle) * 150;
  
  return { x, y, z };
}

export function moonPhase(date = new Date()) {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const daysSinceNewMoon = (date - knownNewMoon) / 86400000;
  const cyclePosition = (daysSinceNewMoon % 29.53) / 29.53;
  
  const phase = Math.round(cyclePosition * 8);
  const illumination = Math.round(50 * (1 - Math.cos(cyclePosition * 2 * Math.PI)));
  
  const names = ['Lua Nova', 'Lua Crescente', 'Quarto Crescente', 'Gibosa Crescente', 
                'Lua Cheia', 'Gibosa Minguante', 'Quarto Minguante', 'Lua Minguante'];
  
  return {
    phase,
    name: names[phase],
    illumination,
    cyclePosition
  };
}

export function sarosCycle() {
  const sarosPeriod = 223 * 29.530589;
  const now = Date.now();
  const lastEclipse = new Date('2009-07-22T00:00:00Z');
  const daysSince = (now - lastEclipse) / 86400000;
  const cyclesComplete = Math.floor(daysSince / sarosPeriod);
  const nextEclipse = new Date(lastEclipse.getTime() + (cyclesComplete + 1) * sarosPeriod * 86400000);
  
  return {
    periodDays: Math.round(sarosPeriod),
    periodYears: (sarosPeriod / 365.25).toFixed(2),
    nextEclipse: nextEclipse.toLocaleDateString('pt-BR'),
    cyclesSince2009: cyclesComplete
  };
}

export function geoToDisc(latitude, longitude, earthRadius = 1800) {
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);
  
  const r = earthRadius * (1 - Math.abs(latRad) / Math.PI);
  const x = r * Math.sin(lonRad);
  const z = r * Math.cos(lonRad);
  
  return { x, y: 60, z };
}

export function horizonDistance(observerHeightMeters, atmosphericRefraction = true) {
  const earthRadius = 6371000;
  const distance = Math.sqrt(2 * earthRadius * observerHeightMeters + observerHeightMeters * observerHeightMeters);
  
  if (atmosphericRefraction) {
    return distance * 1.333;
  }
  return distance;
}

export function horizonDistanceMiles(observerHeightFeet, atmosphericRefraction = true) {
  const earthRadius = 3959;
  const heightMiles = observerHeightFeet / 5280;
  const distance = Math.sqrt(2 * earthRadius * heightMiles + heightMiles * heightMiles);
  
  if (atmosphericRefraction) {
    return distance * 1.333;
  }
  return distance;
}

export function flatEarthSunHeight(shadowAngleDegrees, distanceToCityKm) {
  const angleRad = shadowAngleDegrees * (Math.PI / 180);
  const height = distanceToCityKm / Math.tan(angleRad);
  return height;
}

export function biblicalYearsSinceCreation() {
  const ussherDate = new Date('-4003-10-22T00:00:00Z');
  const now = new Date();
  const years = Math.floor((now - ussherDate) / (365.25 * 86400000 * 1000));
  return years;
}

export function daysSinceFlood() {
  const floodDate = new Date('-2348-11-06T00:00:00Z');
  const now = new Date();
  const days = Math.floor((now - floodDate) / 86400000);
  return days;
}

export function siderealTime(localTime = new Date(), longitude = -46.63) {
  const j2000 = new Date('2000-01-01T12:00:00Z');
  const days = (localTime - j2000) / 86400000;
  const gmst = 18.697374558 + 24.06570982441908 * days;
  const lst = (gmst + longitude / 15) % 24;
  return lst;
}

export function altitudeAzimuth(lat, dec, ha) {
  const latRad = lat * (Math.PI / 180);
  const decRad = dec * (Math.PI / 180);
  const haRad = ha * (Math.PI / 180);
  
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altitude = Math.asin(sinAlt);
  
  const cosAz = (Math.sin(decRad) - Math.sin(altitude) * Math.sin(latRad)) / (Math.cos(altitude) * Math.cos(latRad));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz)));
  
  if (Math.sin(haRad) > 0) {
    azimuth = 2 * Math.PI - azimuth;
  }
  
  return {
    altitude: altitude * (180 / Math.PI),
    azimuth: azimuth * (180 / Math.PI)
  };
}

export default {
  starCatalog,
  spectralColors,
  starToCartesian,
  cartesianToStar,
  sunOrbitPosition,
  moonOrbitPosition,
  moonPhase,
  sarosCycle,
  geoToDisc,
  horizonDistance,
  horizonDistanceMiles,
  flatEarthSunHeight,
  biblicalYearsSinceCreation,
  daysSinceFlood,
  siderealTime,
  altitudeAzimuth
};
