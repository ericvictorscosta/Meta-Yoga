import { Recipe, YogaClass } from './types';

export const AUTHORIZED_EMAILS = new Set([
  'ativo@metayoga.com',
  'test@user.com',
  'pvmo.2004@gmail.com'
]);

export const YOGA_CLASSES: YogaClass[] = [
  { id: 1, title: 'Aula 1: Saudação ao Sol', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 2, title: 'Aula 2: Posturas de Equilíbrio', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: 3, title: 'Aula 3: Flexibilidade da Coluna', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: 4, title: 'Aula 4: Força do Core', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: 5, title: 'Aula 5: Relaxamento e Meditação', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
];

export const RECIPES: Recipe[] = [
  {
    name: 'Smoothie Verde Energizante',
    category: 'Café da Manhã',
    ingredients: ['1 xícara de espinafre', '1/2 banana congelada', '1/2 maçã verde', '1/4 de abacate', '1 colher de sopa de sementes de chia', '1 xícara de água de coco'],
    instructions: 'Bata todos os ingredientes no liquidificador até obter uma consistência cremosa. Sirva imediatamente.',
    nutrition: { calories: '250 kcal', protein: '5g', carbs: '30g', fat: '12g' },
  },
  {
    name: 'Ovos Mexidos com Abacate',
    category: 'Café da Manhã',
    ingredients: ['2 ovos', '1/4 de abacate fatiado', '1 fatia de pão integral', 'Sal e pimenta a gosto'],
    instructions: 'Bata os ovos e tempere. Cozinhe em uma frigideira antiaderente. Sirva sobre o pão tostado com as fatias de abacate.',
    nutrition: { calories: '320 kcal', protein: '18g', carbs: '20g', fat: '18g' },
  },
  {
    name: 'Salada de Quinoa com Grão de Bico',
    category: 'Almoço',
    ingredients: ['1 xícara de quinoa cozida', '1 lata de grão de bico, escorrido', '1 pepino picado', '1 tomate picado', '1/4 xícara de cebola roxa picada', 'Salsinha fresca a gosto', 'Molho de limão e azeite'],
    instructions: 'Em uma tigela grande, misture todos os ingredientes. Tempere com o molho de limão e azeite, sal e pimenta a gosto.',
    nutrition: { calories: '450 kcal', protein: '15g', carbs: '60g', fat: '18g' },
  },
   {
    name: 'Frango Grelhado com Brócolis',
    category: 'Almoço',
    ingredients: ['150g de filé de frango', '1 xícara de brócolis no vapor', '1/2 xícara de arroz integral', 'Temperos a gosto (alho, limão, ervas)'],
    instructions: 'Tempere e grelhe o frango. Sirva com o brócolis e o arroz integral.',
    nutrition: { calories: '480 kcal', protein: '40g', carbs: '45g', fat: '15g' },
  },
  {
    name: 'Mix de Nuts e Frutas Secas',
    category: 'Lanche',
    ingredients: ['1/4 xícara de amêndoas', '1/4 xícara de nozes', '2 colheres de sopa de uvas passas', '2 damascos secos picados'],
    instructions: 'Misture todos os ingredientes em um recipiente pequeno. Ideal para um lanche rápido e nutritivo.',
    nutrition: { calories: '300 kcal', protein: '8g', carbs: '25g', fat: '20g' },
  },
  {
    name: 'Iogurte Grego com Frutas Vermelhas',
    category: 'Lanche',
    ingredients: ['1 pote de iogurte grego natural', '1/2 xícara de frutas vermelhas (morangos, mirtilos)', '1 colher de chá de mel (opcional)'],
    instructions: 'Em uma tigela, coloque o iogurte e cubra com as frutas vermelhas. Adicione mel se desejar.',
    nutrition: { calories: '220 kcal', protein: '20g', carbs: '15g', fat: '10g' },
  },
  {
    name: 'Sopa de Lentilha com Legumes',
    category: 'Jantar',
    ingredients: ['1 xícara de lentilha', '1 cenoura picada', '1 talo de aipo picado', '1/2 cebola picada', '2 dentes de alho amassados', '4 xícaras de caldo de legumes', '1 folha de louro'],
    instructions: 'Refogue a cebola e o alho em uma panela grande. Adicione a cenoura, o aipo e cozinhe por 5 minutos. Adicione a lentilha, o caldo de legumes e a folha de louro. Cozinhe em fogo baixo por 30-40 minutos ou até a lentilha ficar macia.',
    nutrition: { calories: '350 kcal', protein: '18g', carbs: '50g', fat: '5g' },
  },
  {
    name: 'Salmão Assado com Aspargos',
    category: 'Jantar',
    ingredients: ['150g de filé de salmão', '1 maço de aspargos frescos', 'Azeite, sal, pimenta e limão a gosto'],
    instructions: 'Tempere o salmão e os aspargos. Asse em forno pré-aquecido a 200°C por 15-20 minutos.',
    nutrition: { calories: '400 kcal', protein: '35g', carbs: '10g', fat: '25g' },
  },
];