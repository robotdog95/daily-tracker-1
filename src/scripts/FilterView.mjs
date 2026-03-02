import { AppComponent, loadHTML } from "./AppComponent.mjs";

export class FilterView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/filterView.html";

  init() {
    this.innerHTML = this.getHTML();
  }

  async getHTML() {
    this.innerHTML = await loadHTML(FilterView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-filter", FilterView);
