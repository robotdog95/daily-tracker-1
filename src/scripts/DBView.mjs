import { AppComponent, loadHTML } from "./AppComponent.mjs";

export class DBView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/dbView.html";

  init() {
    this.innerHTML = this.getHTML();
  }

  async getHTML() {
    this.innerHTML = await loadHTML(DBView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-db", DBView);
