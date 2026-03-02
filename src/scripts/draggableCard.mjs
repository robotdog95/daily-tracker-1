import { AppComponent, loadHTML } from "./AppComponent.mjs";

function random(min = 0, max = 1) {
  return Math.random() * max + min;
}

export class Draggable extends AppComponent {
  constructor() {
    super();
    this.moveThreshold = 10;
    this.setColor()
  }

  setColor() {
    this.colorstr = `hsl(0 0 ${Math.random() * 100}%)`;
  }

  renderColor() {
    this.querySelector(".dc-wrapper").style.backgroundColor = this.colorstr
  }
  static htmlpath = "./views/draggableCard.html";

  async getHTML() {
    this.innerHTML = await loadHTML(Draggable.htmlpath);
    return this.innerHTML;
  }

  randomColor() {
    return `background-color: hsl(${random(90, 300)} 50% 50%);`;
  }

  async connectedCallback() {
    this.innerHTML = await this.getHTML();
    this.renderColor()

    this.setAttribute("draggable", true);
    this.setAttribute("dnd-group", "planner");

    this.addEventListener("dragstart", (e) => {
      this.classList.add("dragged");
    });
    this.addEventListener("dragend", (e) => {
      this.classList.remove("dragged");
      e.preventDefault();
    });
    this.addEventListener("dragover", (e) =>{
      e.preventDefault()
    })
  }
}

export class DragContainer extends AppComponent {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.innerHTML = await this.getHTML();

    this.addEventListener("dragover", (event) => {
      const overItem = event.target;
      const dragged = document.querySelector(".dragged");

      if (
        overItem.getAttribute("dnd-group") == dragged.getAttribute("dnd-group")
      ) {
        event.preventDefault();
        const afterElement = this.getAfterElement(event.clientY);
        console.log(afterElement);

        if (afterElement == null) {
          this.appendChild(dragged);
        } else {
          this.insertBefore(dragged, afterElement);
        }
      }
    });
  }
  getAfterElement(y) {
    const draggables = [...this.querySelectorAll("ac-drag-card:not(.dragged)")];

    return draggables.reduce(
      (closest, child) => {
        const boundingBox = child.getBoundingClientRect();
        const offset = y - boundingBox.top - boundingBox.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }
}

customElements.define("ac-drag-card", Draggable);
customElements.define("ac-drag-cont", DragContainer);
