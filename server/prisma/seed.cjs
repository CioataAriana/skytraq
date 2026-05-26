const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('✈️ Seeding airlines to database...');

  await prisma.airline.createMany({
    data: [
      // --- ROMANIAN & REGIONAL AIRLINES ---
      { name: 'TAROM', iata: 'RO', icao: 'ROT' },
      { name: 'Carpatair', iata: 'V3', icao: 'KRP' },
      { name: 'HiSky Europe', iata: 'H4', icao: 'HYM' },
      { name: 'Animawings', iata: 'A2', icao: 'AWG' },
      { name: 'Dan Air', iata: 'DN', icao: 'JOC' },
      { name: 'Fly Lili', iata: 'FL', icao: 'LIL' },
      
      // --- MAJOR LOW-COST CARRIERS (Huge in RO) ---
      { name: 'Wizz Air', iata: 'W6', icao: 'WZZ' },
      { name: 'Ryanair', iata: 'FR', icao: 'RYR' },
      { name: 'EasyJet', iata: 'U2', icao: 'EZY' },
      { name: 'Pegasus Airlines', iata: 'PC', icao: 'PGT' },

      // --- MAJOR EUROPEAN AIRLINES ---
      { name: 'Lufthansa', iata: 'LH', icao: 'DLH' },
      { name: 'Air France', iata: 'AF', icao: 'AFR' },
      { name: 'KLM Royal Dutch Airlines', iata: 'KL', icao: 'KLM' },
      { name: 'British Airways', iata: 'BA', icao: 'BAW' },
      { name: 'Turkish Airlines', iata: 'TK', icao: 'THY' },
      { name: 'LOT Polish Airlines', iata: 'LO', icao: 'LOT' },
      { name: 'Austrian Airlines', iata: 'OS', icao: 'AUA' },
      { name: 'Swiss International Air Lines', iata: 'LX', icao: 'SWR' },
      { name: 'Iberia', iata: 'IB', icao: 'IBE' },

      // --- MAJOR GLOBAL AIRLINES ---
      { name: 'Emirates', iata: 'EK', icao: 'UAE' },
      { name: 'Qatar Airways', iata: 'QR', icao: 'QTR' },
      { name: 'Delta Air Lines', iata: 'DL', icao: 'DAL' },
      { name: 'American Airlines', iata: 'AA', icao: 'AAL' },
      { name: 'United Airlines', iata: 'UA', icao: 'UAL' },
      { name: 'Singapore Airlines', iata: 'SQ', icao: 'SIA' },
    ],
    skipDuplicates: true, 
  });

  console.log('✅ All airlines added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });