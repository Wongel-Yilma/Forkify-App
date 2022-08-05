import View from './View.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    return this._generateMarkupButton(curPage, numPages);
  }
  _generateMarkupButton(curPage, numPages) {
    const next = ` <button class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    const prev = `  <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
         </button>`;
    if (curPage === 1 && numPages > 1) {
      return next;
    }
    if (curPage === numPages && numPages && numPages !== 1) {
      return prev;
    }
    if (curPage < numPages) {
      return prev + next;
    }
    return '';
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(btn);
    });
  }
}

export default new PaginationView();
