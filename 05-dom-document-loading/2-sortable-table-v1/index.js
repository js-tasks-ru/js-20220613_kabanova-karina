export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data
    this.createTemplate()
    this.fillBodyTemplate()
  }

  createTemplate() {
    this.element = this.createElement(`
    <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.fillHeaderTemplate()}
      </div>
      <div data-element="body" class="sortable-table__body">
      </div>
      </div>
      </div>`)
  }

  fillHeaderTemplate() {
    return this.headerConfig
      .map(item => {
        return `<div class="sortable-table__cell" data-sortable="${item.sortable}">
        <span>${item.title}</span>
      </div>`
      })
      .join('')
  }

  fillBodyTemplate() {
    let bodyElem = this.element.querySelector('.sortable-table__body')
    bodyElem.innerHTML = ""

    let indexOfImages = this.returnTitleArr().findIndex(item => item === 'images')

    this.data.forEach(obj => {
      let link = this.createElement(`<a href="/products/3d-ochki-optoma-zd301" class="sortable-table__row"></a>`)

      for (let i = 0; i < this.returnTitleArr().length; i++) {

        let div = document.createElement('div')
        div.classList.add("sortable-table__cell")

        if (i === indexOfImages) {
          div.append(this.createElement(`<img class="sortable-table-image" alt="Image" src=${obj.images[0].url}>`))
        } else {
          div.innerHTML = obj[this.returnTitleArr()[i]]
        }

        link.append(div)
      }

      bodyElem.append(link)
      this.subElements = { body: bodyElem }
    })

  }

  sort(value, param) {
    function sortArray(a, b) {
      if (value === "title") {
        switch (param) {
          case 'asc':
            return a[value].localeCompare(b[value], 'ru', { caseFirst: 'upper', sensitivity: 'case' });
          case 'desc':
            return b[value].localeCompare(a[value], 'ru', { caseFirst: 'upper', sensitivity: 'case' });
        }
      } else {
        switch (param) {
          case 'asc':
            return a[value] - b[value];
          case 'desc':
            return b[value] - a[value];
        }
      }
    }

    this.data.sort(sortArray)
    this.fillBodyTemplate()
  }

  createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  }

  returnTitleArr() {
    return this.headerConfig.map(obj => obj.id)
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}

