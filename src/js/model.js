import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, SERVING_STEP } from './config.js';
import { getJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: { query: '', results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    let { recipe } = data.data;
    console.log(recipe);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,

        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (change) {
  const newServings = state.recipe.servings + change * SERVING_STEP;
  console.log(state.recipe.servings);
  if (newServings === 0) return;
  //new q = old q *(new serving/ old serving)
  const factor = newServings / state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= factor;
  });
  state.recipe.servings = newServings;
};
