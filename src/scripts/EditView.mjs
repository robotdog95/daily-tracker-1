import { AppComponent, loadHTML } from "./AppComp.mjs";

export class EditView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/editView.html";

  init() {
    this.innerHTML = this.getHTML();
  }

  async getHTML() {
    this.innerHTML = await loadHTML(EditView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-edit", EditView);
