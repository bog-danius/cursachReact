// prisma/seedTickets.js

import { prisma } from './prisma.js';

async function seed() {
  await prisma.ticket.createMany({
    data: [
      {
        title: 'Cyber Cup 2026',
        description:
            'Крупнейший киберспортивный турнир по CS2 с призовым фондом 5 000 000 ₽. Участвуют топ-команды из Европы и СНГ.',
        price: 4500,
        eventDate: new Date('2026-06-12T19:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751110-97427bbecf20',
        quantity: 2500,
        promotionId: 1,
      },

      {
        title: 'Dota 2 Champions League',
        description:
            'Еженедельный турнир по Dota 2. Открытая регистрация для всех желающих. Прямые трансляции на главной сцене.',
        price: 1200,
        eventDate: new Date('2026-06-18T18:30:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        quantity: 500,
        promotionId: 1,
      },

      {
        title: 'Valorant Invitational',
        description:
            'Закрытый пригласительный турнир по Valorant. Лучшие команды региона сразятся за главный трофей.',
        price: 3200,
        eventDate: new Date('2026-06-25T19:30:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751371-6533d444ac3f',
        quantity: 1800,
        promotionId: 2,
      },

      {
        title: 'FIFA World Championship',
        description:
            'Официальный турнир по FIFA 26. Соревнуйтесь за звание лучшего футбольного киберспортсмена.',
        price: 2800,
        eventDate: new Date('2026-07-02T20:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
        quantity: 1200,
        promotionId: 2,
      },

      {
        title: 'League of Legends Clash',
        description:
            'Командный турнир по League of Legends. Формат double elimination. Призовой фонд 2 500 000 ₽.',
        price: 3500,
        eventDate: new Date('2026-07-09T19:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1560253023-3ec5d502959f',
        quantity: 3200,
        promotionId: 1,
      },

      {
        title: 'Street Fighter 6 Showdown',
        description:
            'Турнир по файтингам Street Fighter 6. Индивидуальный зачёт, лучшие игроки из 16 стран.',
        price: 1500,
        eventDate: new Date('2026-07-15T19:30:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
        quantity: 800,
        promotionId: 3,
      },

      {
        title: 'PUBG Global Series',
        description:
            'Королевская битва в формате 4x4. Топовые команды мира борются за слот на мировой финал.',
        price: 3900,
        eventDate: new Date('2026-07-21T18:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751371-6533d444ac3f',
        quantity: 2200,
        promotionId: 2,
      },

      {
        title: 'Mobile Legends Cup',
        description:
            'Турнир по мобильному MOBA. Призовой фонд 1 000 000 ₽. Онлайн и офлайн участие.',
        price: 900,
        eventDate: new Date('2026-08-03T20:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
        quantity: 4000,
        promotionId: 3,
      },

      {
        title: 'Rocket League Masters',
        description:
            'Аркадный футбол на реактивных автомобилях. Командный турнир с крутыми призами.',
        price: 2200,
        eventDate: new Date('2026-08-10T18:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        quantity: 950,
        promotionId: 1,
      },

      {
        title: 'StarCraft II Legacy',
        description:
            'Легендарная стратегия в реальном времени. Индивидуальный турнир для опытных игроков.',
        price: 1800,
        eventDate: new Date('2026-08-18T17:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1507924538820-ede94a04019d',
        quantity: 600,
        promotionId: 2,
      },

      {
        title: 'Rainbow Six Siege Cup',
        description:
            'Тактический шутер. Командный турнир с призовым фондом 3 000 000 ₽.',
        price: 3000,
        eventDate: new Date('2026-08-25T19:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
        quantity: 1500,
        promotionId: 3,
      },

      {
        title: 'Apex Legends Tournament',
        description:
            'Королевская битва в командах по 3 человека. Открытый турнир для всех рангов.',
        price: 1700,
        eventDate: new Date('2026-09-01T20:00:00'),
        posterUrl:
            'https://images.unsplash.com/photo-1542751371-6533d444ac3f',
        quantity: 2800,
        promotionId: 1,
      },
    ],
  });

  console.log('Турниры успешно добавлены');
}

seed()
    .catch((e) => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });