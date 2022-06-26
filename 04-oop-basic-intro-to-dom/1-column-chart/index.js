export default class ColumnChart {
    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = data => data
    } ={}) {
        this.chartHeight = 50
        this.data = data
        this.label = label
        this.link = link
        this.value = formatHeading(value)
        this.getColumnProps(this.data)
        this.createTemplate()

    }

    createTemplate() {
        this.element = this.createElement(`
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
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

        if (this.columnProps.length == 0) {
            this.element.classList.add('column-chart_loading')
        } else {
            this.addColumn()
        }
    }

    addColumn() {
        let body = this.element.querySelector('.column-chart__chart')
        body.innerHTML = ""
        for (let obj of this.columnProps){
           body.append(this.createElement(`<div style="--value: ${obj.value}" data-tooltip="${obj.percent}"></div`))
        }
    }

    getColumnProps(data) {
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
        this.columnProps = data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }

    update(arr){
        this.getColumnProps(arr)
        this.addColumn()
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
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
