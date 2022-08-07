// import icons from '../img/icons.svg'; // For parcel 1

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

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
    // 0 Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1. Load Recipe
    await model.loadRecipe(id);
    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
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
};
const controlServings = function (change) {
  // update recipe serving

  model.updateServings(change);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1. Add/remove bookmark
  if (
    model.state.bookmarks.some(
      bookmark => bookmark.id === model.state.recipe.id
    )
  ) {
    model.removeBookmark(model.state.recipe);
  } else {
    model.addBookmark(model.state.recipe);
  }
  // 2. Update recipe bookmarks
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    // Show the loading spinner
    addRecipeView.renderSpinner();
    // Upload the recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    // Display success Message
    addRecipeView.renderMessage();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change id in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
