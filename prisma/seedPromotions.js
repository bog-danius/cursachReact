import { prisma } from './prisma.js';

async function seedPromotions() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "promotions" RESTART IDENTITY CASCADE;
  `);

  await prisma.promotion.createMany({
    data: [
      {
        title: 'Кибер-лето 2026',
        description: 'Скидка 15% на все турниры лета',
        discount: 15,
      },
      {
        title: 'Командный пакет',
        description: 'Скидка 20% для команд',
        discount: 20,
      },
      {
        title: 'VIP доступ',
        description: 'Скидка 10% + лаунж зона',
        discount: 10,
      },
      {
        title: 'Студенческий пакет',
        description: 'Скидка 25% для студентов',
        discount: 25,
      },
    ],
  });

  console.log('✅ Promotions успешно созданы');
}

seedPromotions()
    .catch((e) => {
      console.error('❌ ERROR:', e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });