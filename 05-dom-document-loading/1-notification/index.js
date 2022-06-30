export default class NotificationMessage {
    static notificationMessage = null
    constructor(message = "", { duration = 0, type = "" } = {}) {
        this.message = message
        this.duration = duration
        this.type = type
        this.createMessage()
    }

    createMessage() {
        this.element = this.createElement(`
        <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
            ${this.message}
            </div>
          </div>
        </div>`)
    }

    show(targetElem) {
        if (NotificationMessage.notificationMessage) {
            NotificationMessage.notificationMessage.remove()
        }

        NotificationMessage.notificationMessage = this;
        
        if (targetElem) {
            targetElem.append(this.element)
        } else { document.body.append(this.element) }

        this.timerId = setTimeout(() => this.remove(), this.duration);
    }

    remove() {
        clearTimeout(this.timerId)
        NotificationMessage.notificationMessage = null
        this.element.remove();
    }

    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }

    destroy() {
        this.remove();
    }
}

