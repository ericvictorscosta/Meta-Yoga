
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Recipe } from '../types';
import { getDietCategoryIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex items-center justify-between text-left">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-100 p-2 rounded-full">
            {getDietCategoryIcon(recipe.category)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{recipe.name}</p>
            <p className="text-sm text-slate-500">{recipe.category}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-700 mb-2">Ingredientes:</h4>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold text-slate-700 mb-2">Modo de Preparo:</h4>
            <p className="text-slate-600">{recipe.instructions}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Informações Nutricionais:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <p>Calorias: {recipe.nutrition.calories}</p>
              <p>Proteínas: {recipe.nutrition.protein}</p>
              <p>Carboidratos: {recipe.nutrition.carbs}</p>
              <p>Gorduras: {recipe.nutrition.fat}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
