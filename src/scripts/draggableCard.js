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
    console.error("setting stuff");
    this.innerHTML = await this.getHTML();
    this.setAttribute("draggable", true);
    this.addEventListener("dragstart", (ev) => {
      // On ajoute l'identifiant de l'élément cible à l'objet de transfert
      ev.dataTransfer.setData("text/plain", ev.target.innerText);
      console.log(ev)
    });
    this.addEventListener("dragend", (ev) => {
      console.log(ev)
    });
    function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }
  }
}

customElements.define("ac-draggable", Draggable);
