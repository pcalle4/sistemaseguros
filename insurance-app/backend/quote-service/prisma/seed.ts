import { createPrismaClient } from '../src/infrastructure/prisma/prisma-client';

const prisma = createPrismaClient();

async function seedInsuranceTypes() {
  const insuranceTypes = [
    { code: 'AUTO', name: 'Seguro de Auto' },
    { code: 'SALUD', name: 'Seguro de Salud' },
    { code: 'HOGAR', name: 'Seguro de Hogar' },
  ];

  for (const insuranceType of insuranceTypes) {
    await prisma.insuranceType.upsert({
      where: { code: insuranceType.code },
      update: { name: insuranceType.name },
      create: insuranceType,
    });
  }
}

async function seedLocations() {
  const locations = [
    { code: 'EC-AZUAY', name: 'Azuay' },
    { code: 'EC-GUAYAS', name: 'Guayas' },
    { code: 'EC-PICHINCHA', name: 'Pichincha' },
  ];

  for (const location of locations) {
    await prisma.location.upsert({
      where: { code: location.code },
      update: { name: location.name },
      create: location,
    });
  }
}

async function seedCoverages() {
  const coverageCodes = [
    { code: 'BASICA', name: 'Básica' },
    { code: 'ESTANDAR', name: 'Estándar' },
    { code: 'PREMIUM', name: 'Premium' },
  ];

  const insuranceTypeCodes = ['AUTO', 'SALUD', 'HOGAR'];

  for (const insuranceTypeCode of insuranceTypeCodes) {
    for (const coverage of coverageCodes) {
      await prisma.coverage.upsert({
        where: {
          insuranceTypeCode_code: {
            insuranceTypeCode,
            code: coverage.code,
          },
        },
        update: { name: coverage.name },
        create: {
          insuranceTypeCode,
          code: coverage.code,
          name: coverage.name,
        },
      });
    }
  }
}

async function main() {
  await seedInsuranceTypes();
  await seedLocations();
  await seedCoverages();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Quote service seed completed');
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    console.error('Quote service seed failed', error);
    process.exit(1);
  });
