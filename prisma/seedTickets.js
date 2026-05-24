import { prisma } from './prisma.js';

async function seedTickets() {

  // очищаем таблицу
  await prisma.ticket.deleteMany();

  // берем реальные promotions из базы
  const promotions = await prisma.promotion.findMany();

  if (!promotions.length) {
    throw new Error('❌ Promotions пустые! Сначала запусти seedPromotions');
  }

  const titles = [
    'Cyber Cup',
    'Dota League',
    'Valorant Arena',
    'PUBG Masters',
    'Fortnite Battle',
    'League Clash',
    'Apex Tournament',
    'CS2 Major',
    'Rainbow Arena',
    'Rocket Masters',
    'Mobile Legends',
    'Warzone Series',
    'Tekken Championship',
    'Overwatch Open',
    'EA FC League',
    'Minecraft Battle',
    'StarCraft Legacy',
    'Street Fighter Cup',
  ];

  const descriptions = [
    'Крупный международный киберспортивный турнир.',
    'Открытый чемпионат для профессиональных игроков.',
    'Турнир с большим призовым фондом.',
    'Соревнование лучших команд Европы и СНГ.',
    'Командный турнир с прямыми трансляциями.',
    'Масштабный LAN-ивент для всех игроков.',
    'Турнир среди лучших игроков сезона.',
    'Большой финал киберспортивной серии.',
  ];

  const posters = [
    'https://images.unsplash.com/photo-1542751110-97427bbecf20',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    'https://images.unsplash.com/photo-1560253023-3ec5d502959f',
    'https://images.unsplash.com/photo-1507924538820-ede94a04019d',
  ];

  const tickets = [];

  // 🔥 200 записей ГАРАНТИРОВАННО
  for (let i = 1; i <= 200; i++) {

    const randomPromotion =
        promotions[Math.floor(Math.random() * promotions.length)];

    tickets.push({
      title: `${titles[Math.floor(Math.random() * titles.length)]} #${i}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price: Math.floor(Math.random() * 4500) + 500,
      eventDate: new Date(
          2026,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
          Math.floor(Math.random() * 24),
          0,
          0
      ),
      posterUrl: posters[Math.floor(Math.random() * posters.length)],
      quantity: Math.floor(Math.random() * 5000) + 100,

      // 💥 ВАЖНО: реальный FK из базы
      promotionId: randomPromotion.id,
    });
  }

  // вставка
  await prisma.ticket.createMany({
    data: tickets,
  });

  console.log(`✅ УСПЕШНО СОЗДАНО: ${tickets.length} турниров`);
}

seedTickets()
    .catch((e) => {
      console.error('❌ ERROR:', e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });