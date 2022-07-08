import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    constructor({ url = 'api/dashboard/orders',
        range = {},
        label = '',
        link = '',
        formatHeading = data => data
    } = {}) {
        this.formatHeading = formatHeading
        this.chartHeight = 50
        this.url = url
        this.range = range
        this.from = this.range.from
        this.to = this.range.to
        this.label = label
        this.link = link
        this.value = ""
        this.render()
        this.update(this.from, this.to)
    }

    render() {
        this.element = this.createElement(`
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">Total ${this.label}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart"></div>
            </div>
            </div>`)

        if (this.link != "") {
            this.element.querySelector(".column-chart__title").insertAdjacentHTML("beforeend", `<a href="${this.link}" class="column-chart__link">View all</a>`)
        }
        this.subElements = this.getSubElements(this.element)
    }

    async update(from, to) {
        this.data = await this.loadData(from, to)
        this.getColumnProps(this.data)
        this.addColumn()
        return this.data
    }

    async loadData( from = new Date(), to = new Date()) {
        const path = new URL(this.url, BACKEND_URL)
        path.searchParams.set('from', from.toISOString().split('T')[0]);
        path.searchParams.set('to', to.toISOString().split('T')[0])

        return fetchJson(path)
    }

    addColumn() {
        this.element.classList.remove('column-chart_loading')
        this.subElements.body.innerHTML = ""
        this.subElements.header.innerHTML = this.totalSum
        for (let obj of this.columnProps) {
            this.subElements.body.append(this.createElement(`<div style="--value: ${obj.value}" data-tooltip="${obj.percent}"></div`))
        }
    }

    getColumnProps(data) {
        let valuesOfData = Object.values(data)
        const maxValue = Math.max(...valuesOfData);
        const scale = 50 / maxValue;
        this.columnProps = valuesOfData.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
        let sum = valuesOfData.reduce((partialSum, a) => partialSum + a, 0);
        this.totalSum = this.formatHeading(sum)
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
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

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }



}
