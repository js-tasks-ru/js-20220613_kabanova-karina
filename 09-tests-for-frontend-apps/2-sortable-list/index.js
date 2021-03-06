export default class SortableList {
    constructor(obj = { items: '' }, elem = '') {
        this.items = obj.items
        this.elem = elem
        this.element
        this.render()
        this.initEventListeners()
    }

    render() {
        if (this.elem === '') {
            this.element = this.createElement(`<ul class = "sortable-list" data-element="imageListContainer"></ul>`)
            for (const li of this.items) {
                li.classList.add('sortable-list__item')
                this.element.append(li)
            }
            for (const span of this.element.querySelectorAll('span')) {
                span.classList.add('sortable-list__item-title')
            }
        }
        else {
            this.element = this.elem
        }
    }

    initEventListeners() {
        document.addEventListener('pointerdown', this.addEventPointerDown)
        document.ondragstart = function () {
            return false;
        };
        document.addEventListener('pointerup', this.addEventPointerUp)
    }

    addEventPointerDown = event => {
        if (event.target.dataset.deleteHandle != undefined) this.deleteElem(event)
        if (event.target.dataset.grabHandle != "") return

        this.parentNode = event.target.closest('.sortable-list__item')


        this.placeHolder = this.parentNode.cloneNode(false) // создаем клон 
        this.placeHolder.classList.add('sortable-list__placeholder')
        if (this.element) this.element.insertBefore(this.placeHolder, this.parentNode) // вставляем клон

        this.parentNode.classList.add('sortable-list__item_dragging')

        this.shiftX = event.clientX - this.placeHolder.getBoundingClientRect().left;
        this.shiftY = event.clientY - this.placeHolder.getBoundingClientRect().top;

        this.move(event.clientX, event.clientY, this.parentNode)

        document.addEventListener('pointermove', this.onPointerMove)
    }

    move = (clientX, clientY, node) => {
        node.style.left = clientX - this.shiftX + 'px';
        node.style.top = clientY - this.shiftY + 'px';
    }

    onPointerMove = event => {
        this.move(event.clientX, event.clientY, this.parentNode);

        this.parentNode.style.display = 'none';
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
        this.parentNode.style.display = '';

        if (elemBelow && elemBelow.closest('.sortable-list__item')) {

            const liBelow = elemBelow.closest('.sortable-list__item')
            const topLiBelow = liBelow.getBoundingClientRect().top
            const halfHeightLiBelow = liBelow.getBoundingClientRect().height / 2

            if (event.clientY >= (topLiBelow + halfHeightLiBelow)) {
                this.element.insertBefore(liBelow, this.placeHolder)
            } else {
                this.element.insertBefore(this.placeHolder, liBelow)
            }
        }
    }

    addEventPointerUp = event => {
        const li = event.target.closest('.sortable-list__item')

        if (this.element.querySelector('.sortable-list__placeholder')) {
            this.element.querySelector('.sortable-list__placeholder').remove()
        }

        li.classList.remove('sortable-list__item_dragging')

        li.style.display = 'none';
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY)
        li.style.display = '';

        li.style.left = 0
        li.style.top = 0

        if (elemBelow.closest('.sortable-list__item')) {
            this.element.insertBefore(li, elemBelow.closest('.sortable-list__item'))
        }
        document.removeEventListener('pointermove', this.onPointerMove)
    }

    deleteElem = event => {
        const parentNode = event.target.closest('.sortable-list__item')
        parentNode.remove()
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }

    destroy() {
        this.remove();
        this.element = null;
    }

    remove() {
        this.element.remove();
    }
}