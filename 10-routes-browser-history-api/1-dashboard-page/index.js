
import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    constructor() {
        this.update()

    }

    async render() {
        this.element = this.getTemplate()
        this.subElements = this.getSubElements(this.element)
        this.initialize()
        return this.element
    }

    loadBestsellers() {
        const { from, to } = this.getRange();

        const startInput = from.toISOString();
        const endInput = to.toISOString();

        const path = new URL('api/dashboard/bestsellers', BACKEND_URL)
        path.searchParams.set('from', startInput)
        path.searchParams.set('to', endInput)
        path.searchParams.set('_sort', 'title')
        path.searchParams.set('_order', 'asc')
        path.searchParams.set('_start', 0)
        path.searchParams.set('_end', 30)

        return fetchJson(path)
    }


    initialize() {
        const { from, to } = this.getRange();

        const table = this.getSortableTable(from, to)
        this.subElements.sortableTable.append(table)

        const rangePicker = this.getRangePicker(from, to)
        this.subElements.rangePicker.append(rangePicker)

        this.ordersChart = new ColumnChart({
            url: 'api/dashboard/orders',
            range: {
                from,
                to
            },
            label: 'orders',
            link: '#'
        });
        this.salesChart = new ColumnChart({
            url: 'api/dashboard/sales',
            range: {
                from,
                to
            },
            label: 'sales',
            formatHeading: data => `$${data}`
        });

        this.customersChart = new ColumnChart({
            url: 'api/dashboard/customers',
            range: {
                from,
                to
            },
            label: 'customers',
        });

        this.subElements.customersChart.append(this.customersChart.element)
        this.subElements.ordersChart.append(this.ordersChart.element)
        this.subElements.salesChart.append(this.salesChart.element)
    }

    getSortableTable(from, to) {
        const sortableTable = new SortableTable(header, {
            url: 'api/dashboard/bestsellers',
            isSortLocally: true,
            from: from,
            to: to

        });
        return sortableTable.element

    }

    getRangePicker(from, to) {
        const rangePicker = new RangePicker({
            from: from,
            to: to
        })

        rangePicker.element.addEventListener('date-select', event => {
            this.range = event.detail
            this.update()
        });

        return rangePicker.element
    }


    getRange() {
        const now = new Date();
        const to = new Date();
        const from = new Date(now.setMonth(now.getMonth() - 1));

        return { from, to };
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

    update() {
        if (!this.range) return
        this.ordersChart.update(this.range.from, this.range.to)
        this.customersChart.update(this.range.from, this.range.to)
        this.salesChart.update(this.range.from, this.range.to)
        const sortableTable = new SortableTable(header, {
            url: 'api/dashboard/bestsellers',
            isSortLocally: true,
            from: this.range.from,
            to: this.range.to

        });
        this.subElements.sortableTable.innerHTML = ''
        this.subElements.sortableTable.append(sortableTable.element)
    }

    getTemplate() {
        return this.createElement(`<div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>
        <h3 class="block-title">Best sellers</h3>
        <div data-element="sortableTable">
        </div>
      </div>`)
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }

    destroy() {
        this.element.remove();
    }

    remove() {
        this.element.remove();
    }

}
