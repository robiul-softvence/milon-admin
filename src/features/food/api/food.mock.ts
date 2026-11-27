import appleAlmondButter from '@/assets/food/apple-almond-butter.jpg'
import chickenQuinoaStirfry from '@/assets/food/chicken-quinoa-stirfry.jpg'
import chickpeaQuinoaBowl from '@/assets/food/chickpea-quinoa-bowl.jpg'
import greekYogurtBowl from '@/assets/food/greek-yogurt-bowl.jpg'
import salmonRiceBowl from '@/assets/food/salmon-rice-bowl.jpg'
import tofuEggSalad from '@/assets/food/tofu-egg-salad.jpg'
import type { FoodData } from '../types'

/**
 * In-memory "database". The list holds the page currently shown in Figma;
 * the stats describe the full catalogue (1,248 recipes) and are kept in sync
 * by the mock mutations in `food.api.ts`.
 */
export const foodMock: FoodData = {
  stats: {
    recipes: 1248,
    foodItems: 8930,
    avgCostPerMeal: 2.35,
    pendingReview: 14,
    translatedFr: 1180,
  },
  recipes: [
    {
      id: 'rcp_001',
      name: { en: 'Greek Yogurt Power Bowl', fr: 'Bol protéiné au yaourt grec' },
      category: 'breakfast',
      photo: greekYogurtBowl,
      kcal: 380,
      protein: 28,
      carbs: 42,
      fat: 10,
      cost: 1.9,
      tags: ['vegetarian', 'glutenFree'],
      activeMealPlans: 518,
    },
    {
      id: 'rcp_002',
      name: { en: 'Grilled Tofu & Hard-Boiled Egg Salad', fr: 'Salade de tofu grillé et œuf dur' },
      category: 'lunch',
      photo: tofuEggSalad,
      kcal: 423,
      protein: 32,
      carbs: 28,
      fat: 19,
      cost: 2.4,
      tags: ['vegetarian'],
      activeMealPlans: 276,
    },
    {
      id: 'rcp_003',
      name: { en: 'Chickpea Quinoa Bowl', fr: 'Bol de quinoa aux pois chiches' },
      category: 'lunch',
      photo: chickpeaQuinoaBowl,
      kcal: 410,
      protein: 21,
      carbs: 52,
      fat: 12,
      cost: 2.0,
      tags: ['vegan', 'halal', 'glutenFree'],
      activeMealPlans: 389,
    },
    {
      id: 'rcp_004',
      name: { en: 'Apple & Almond Butter', fr: "Pomme et purée d'amande" },
      category: 'snack',
      photo: appleAlmondButter,
      kcal: 190,
      protein: 5,
      carbs: 22,
      fat: 10,
      cost: 0.8,
      tags: ['vegan', 'glutenFree'],
      activeMealPlans: 731,
    },
    {
      id: 'rcp_005',
      name: { en: 'Chicken Quinoa Stir-fry', fr: 'Sauté de poulet au quinoa' },
      category: 'dinner',
      photo: chickenQuinoaStirfry,
      kcal: 492,
      protein: 41,
      carbs: 48,
      fat: 13,
      cost: 3.1,
      tags: ['halal', 'lactoseFree'],
      activeMealPlans: 455,
    },
    {
      id: 'rcp_006',
      name: { en: 'Salmon Rice Bowl', fr: 'Bol de riz au saumon' },
      category: 'dinner',
      photo: salmonRiceBowl,
      kcal: 452,
      protein: 31,
      carbs: 46,
      fat: 15,
      cost: 3.4,
      tags: ['glutenFree', 'lactoseFree'],
      activeMealPlans: 342,
    },
  ],
}
