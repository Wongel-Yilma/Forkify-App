import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, SERVING_STEP, KEY } from './config.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: { query: '', results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    state.search.page = 1;
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key${KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,

        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
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
  if (newServings === 0) return;
  //new q = old q *(new serving/ old serving)
  const factor = newServings / state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= factor;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (recipe) {
  const index = state.bookmarks.findIndex(
    bookmark => bookmark.id === recipe.id
  );
  state.bookmarks.splice(index, 1);
  // Mark the current recipe as NOT bookmarked

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (!storage) return;

  state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(newRecipe);
    console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};
