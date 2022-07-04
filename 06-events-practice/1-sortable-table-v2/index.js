export default class SortableTable {
  subElements = {};
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig
    this.isSortLocally = true;
    this.data = data
    this.sorted = sorted
    this.createTemplate()
    this.fillBodyTemplate()
    this.sort()
    this.initEventListeners()
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
      this.subElements = this.getSubElements(this.element)
  }

  fillHeaderTemplate() {
    return this.headerConfig
      .map(item => {
        return `<div class="sortable-table__cell" data-id=${item.id} data-sortable="${item.sortable}">
        <span>${item.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </div>`
      })
      .join('')
  }

  fillBodyTemplate() {
    this.subElements.body.innerHTML = ""

    this.data.forEach(obj => {
      const link = this.createElement(`<a href="/products/3d-ochki-optoma-zd301" class="sortable-table__row">${this.getTableRow(obj)}</a>`)
      this.subElements.body.append(link)
    })

  }

  getTableRow(obj) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return { id, template }
    });

    return cells.map(({ id, template }) => {
      return template
        ? template(obj[id]) // id === "images"
        : `<div class="sortable-table__cell">${obj[id]}</div>`;
    }).join('');
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted);
    } else {
      this.sortOnServer();
    }
  }
 
  sortOnClient({ id, order }) { 
    this.addArrow(id, order)
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order] // 1 или -1
    this.data.sort(sortArray)

    function sortArray(a, b) {
      switch (id) {
        case 'title':
          return direction * a[id].localeCompare(b[id], 'ru', { caseFirst: 'upper', sensitivity: 'case' });
        default:
          return  direction *( a[id] - b[id])

      }
    }
    this.fillBodyTemplate()
  }

  addArrow(id, field) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${id}"]`)

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = field
  }

  initEventListeners() {

    this.element.querySelector(".sortable-table__header").addEventListener('pointerdown', (event) => {
      if (!event.target.closest(`.sortable-table__cell[data-sortable="true"]`)) return

      const eventTarget = event.target.closest(`.sortable-table__cell[data-sortable="true"]`)

      this.sortOnClient({
        id: eventTarget.dataset.id,
        order: eventTarget.dataset.order == 'desc' ? 'asc': 'desc'
      })

    })
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }

  createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  }

  remove() {
    this.element.remove();
}

destroy() {
    this.remove();
}

}
