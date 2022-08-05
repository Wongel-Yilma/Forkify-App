import View from './View.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = '';
  _errorMessage = 'No recipes found for your query. Please try again.';

  _generateMarkup() {
    return this._data
      .map(result => this._generateMarkupPreview(result))
      .join('');
  }
  _generateMarkupPreview(result) {
    return `
         <li class="preview">
            <a class="preview__link  ${
              +result.id === window.location.hash.slice(1)
                ? 'preview__link--active'
                : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
         </li>
   `;
  }
}

export default new ResultsView();
