import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = 'No recipes found for your query. Please try again.';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  //   _generateMarkupPreview(result) {
  //     return `
  //          <li class="preview">
  //             <a class="preview__link  ${
  //               result.id === window.location.hash.slice(1)
  //                 ? 'preview__link--active'
  //                 : ''
  //             }" href="#${result.id}">
  //               <figure class="preview__fig">
  //                 <img src="${result.image}" alt="${result.title}" />
  //               </figure>
  //               <div class="preview__data">
  //                 <h4 class="preview__title">${result.title}</h4>
  //                 <p class="preview__publisher">${result.publisher}</p>
  //                 <div class="preview__user-generated">
  //                   <svg>
  //                     <use href="${icons}icon-user"></use>
  //                   </svg>
  //                 </div>
  //               </div>
  //             </a>
  //          </li>
  //    `;
  //   }
}

export default new BookmarksView();
