import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';


export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    url = '',
    isSortLocally = false
  } = {}) {
    this.isSortLocally =  isSortLocally
    this.itemsPerPage = 30
    this.page = 0
    this.headerConfig = headersConfig
    this.url = url
    this.data = data
    this.sorted = sorted
    this.render()
    this.initEventListeners()

  }

  render() {
    if (this.element) return
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
    this.update()
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

  async update() {
    this.data = await this.loadData(this.itemsPerPage * this.page, (this.itemsPerPage * this.page) + 30)
    this.subElements.body.innerHTML = ""
    this.fillBodyTemplate()
    this.addArrow()
  }

  async add() {
    this.data = await this.loadData(this.itemsPerPage * this.page, (this.itemsPerPage * this.page) + 30)
    this.fillBodyTemplate()
    this.addArrow()
  }

  async loadData(start, end) {
    const path = new URL(this.url, BACKEND_URL)
    path.searchParams.set('_embed', 'subcategory.category')
    path.searchParams.set('_sort', this.sorted.id)
    path.searchParams.set('_order', this.sorted.order)
    path.searchParams.set('_start', start)
    path.searchParams.set('_end', end)
    return await fetchJson(path)
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    }
    else {this.sortOnServer(this.sorted.id, this.sorted.order)}
  }

  fillBodyTemplate() {
    this.data.forEach(obj => {
      const link = this.createElement(`<a href="/products/3d-ochki-optoma-zd301" class="sortable-table__row">${this.getTableRow(obj)}</a>`)
      this.subElements.body.append(link)
    })
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', (event) => this.sortOnClick(event))
    document.addEventListener('scroll', (event) => this.scrollLoader(event));
  }

  sortOnClick(event) {
    const eventTarget = event.target.closest(`.sortable-table__cell[data-sortable="true"]`)
    if (!eventTarget) return

    this.sorted = {
      id: eventTarget.dataset.id,
      order: eventTarget.dataset.order == 'desc' ? 'asc' : 'desc'
    }
    this.sort()
  }

  sortOnServer(id, order) {
    let page = this.page

    if (page > 0) {
      page = 0
    }

    this.update(id, order)
  }

  scrollLoader() {
    let overallHeight = document.documentElement.scrollHeight
    let scrollByY = window.scrollY
    let heigthOfHtmlInWIndow = document.documentElement.clientHeight

    if (Math.round(scrollByY + heigthOfHtmlInWIndow) === overallHeight) {
      this.page = this.page + 1
      this.add()
    }
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


  sortOnClient(id, order) {
    this.addArrow()
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
          return direction * (a[id] - b[id])

      }
    }
    this.subElements.body.innerHTML = ""
    this.fillBodyTemplate()
  }

  addArrow() {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${this.sorted.id}"]`)

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = this.sorted.order
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

  removeListeners() {
    document.removeEventListener('scroll', this.scrollLoader);
  }

  destroy() {
    this.remove();
  }

}
