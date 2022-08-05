// import icons from '../img/icons.svg'; // For parcel 1

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 1. Load Recipe
    await model.loadRecipe(id);
    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
    console.log(model.state);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2. Load search results
    await model.loadSearchResults(query);
    // 3. Render the pages
    resultsView.render(model.getSearchResultsPage());

    // 4. Render the pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (btn) {
  if (btn.classList.contains('pagination__btn--prev')) {
    model.state.search.page -= 1;
  }
  if (btn.classList.contains('pagination__btn--next')) {
    model.state.search.page += 1;
  }
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);

  console.log('pag');
};
const controlServings = function (change) {
  // update recipe serving

  model.updateServings(change);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
};

init();
