// prisma/seedPromotions.js

import { prisma } from './prisma.js';

async function seedPromotions() {
  await prisma.promotion.createMany({
    data: [
      {
        title: 'Кибер-лето 2026',
        description:
            'Скидка 15% на все турниры июня при ранней регистрации',
        discount: 15,
      },

      {
        title: 'Командный пакет',
        description:
            'Специальная скидка 20% для команд из 5 и более участников',
        discount: 20,
      },

      {
        title: 'VIP турнирный доступ',
        description:
            'Скидка 10% на VIP билеты с доступом в лаунж-зону и питанием',
        discount: 10,
      },

      {
        title: 'Студенческий киберспорт',
        description:
            'Скидка 25% для студентов при предъявлении студенческого билета',
        discount: 25,
      },

      {
        title: 'Ранний вход',
        description:
            'Скидка 12% при покупке билетов за 30 дней до начала турнира',
        discount: 12,
      },

      {
        title: 'Стримерский пакет',
        description:
            'Скидка 30% для стримеров и медийных личностей',
        discount: 30,
      },

      {
        title: 'Матч-реванш',
        description:
            'Скидка 18% при повторной покупке билетов на турниры серии',
        discount: 18,
      },

      {
        title: 'Групповая поддержка',
        description:
            'Скидка 22% для организованных групп болельщиков',
        discount: 22,
      },

      {
        title: 'Флеш-турнир',
        description:
            'Мгновенная скидка 35% на билеты в первые 24 часа продаж',
        discount: 35,
      },

      {
        title: 'Лояльность фанатов',
        description:
            'Скидка 5% постоянным зрителям (от 3 посещённых турниров)',
        discount: 5,
      },
    ],
  });

  console.log('Акции для турниров успешно добавлены');
}

seedPromotions()
    .catch((error) => {
      console.error(error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });