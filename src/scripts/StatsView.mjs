import { AppComponent, loadHTML } from "./AppComp.mjs";

export class StatsView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/statsView.html";

  init() {
    this.innerHTML = this.getHTML();
  }

  async getHTML() {
    this.innerHTML = await loadHTML(StatsView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-stats", StatsView);