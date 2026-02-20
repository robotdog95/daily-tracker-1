import { AppComponent, loadHTML } from "./AppComp.mjs";

export class Draggable extends AppComponent {
  constructor() {
    super();
  }

  static htmlpath = "./views/draggableCard.html";

  async getHTML() {
    this.innerHTML = await loadHTML(Draggable.htmlpath);
    return this.innerHTML;
  }

  async connectedCallback() {
    console.error("setting stuff")
    this.innerHTML = await this.getHTML();
    this.setAttribute("draggable", true);
  }
}

customElements.define("ac-draggable", Draggable);