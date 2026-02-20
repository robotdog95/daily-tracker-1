import { AppComponent, loadHTML } from "./AppComp.mjs";

export class ConfigView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/configView.html";

  init() {
    this.innerHTML = this.getHTML();
  }

  async getHTML() {
    this.innerHTML = await loadHTML(ConfigView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-config", ConfigView);