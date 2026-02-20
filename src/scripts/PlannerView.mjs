import { AppComponent, loadHTML } from "./AppComp.mjs";

export class PlannerView extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/plannerView.html";

  init() {
    this.today = Date(Date.now());
    console.log(this.today.toString());
    this.innerHTML = this.getHTML();
  }

  async connectedCallback() {
    this.innerHTML = await this.getHTML();
  }
  async getHTML() {
    this.innerHTML = await loadHTML(PlannerView.htmlpath);
    console.warn(this.innerHTML);

    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
    console.warn(el, this);
  }
}

customElements.define("ac-planner", PlannerView);