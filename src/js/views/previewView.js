import View from './View.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class PreviewView extends View {
  _parentElement = '';
  //   _generateMarkup() {
  //     return this._data
  //       .map(bookmark => this._generateMarkupPreview(bookmark))
  //       .join('');
  //   }
  _generateMarkup() {
    return `
         <li class="preview">
            <a class="preview__link  ${
              this._data.id === window.location.hash.slice(1)
                ? 'preview__link--active'
                : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
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

export default new PreviewView();
