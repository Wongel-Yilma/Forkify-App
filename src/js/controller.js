// import icons from '../img/icons.svg'; // For parcel 1

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 1. Load Recipe
    await model.loadRecipe(id);
    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log('Error caught in the controller');
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    console.log(query);
    if (!query) return;
    // 2. Load search results
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    //
  } catch (err) {
    console.error(err);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
