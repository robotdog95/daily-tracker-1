class Displacable extends HTMLElement {
  constructor() {
    super();
    this.setColorAtrribute();
    this.moveThreshold = 10;
  }

  setColorAtrribute() {
    this.setAttribute("custom-color", `hsl(0 0 ${Math.random() * 100}%)`);
  }

  setColorFromAttribute() {
    this.style.backgroundColor = this.getAttribute("custom-color");
  }

  //#region Event Handlers
  onmousedownhandler(e) {
    e.stopPropagation();
    this.mouseisdown = true;
    this.classList.add("dragging");
    this.layPos = { x: e.layerX, y: e.layerY };
  }

  onmouseuphandler = (e) => {
    this.mouseisdown = false;
    this.classList.remove("dragging");
  };

  onmousemovehandler = (e) => {
        e.stopPropagation();
    if (this.mouseisdown) {
      let mo = { x: e.clientX - this.layPos.x, y: e.clientY - this.layPos.y };
      this.style.top = mo.y + "px";
      this.style.left = mo.x + "px";

      let list = this.parentElement.querySelectorAll("cu-displace-fix");
      console.log(list);

      this.parentElement.querySelectorAll("cu-displace-fix").forEach((el) => {
        el.style.zIndex = "0";
      });
      this.style.zIndex = "2";
    }
  };
  //#endregion Event Handlers

  connectedCallback() {
    this.setColorFromAttribute();

    this.classList.add("draggable");
    //this.setAttribute("draggable", true);
    //this.styleStr = `translateX(${this.totalOffset.x + this.pos.x}px) translateY(${this.totalOffset.y + this.pos.y}px)`;

    document.addEventListener("mousemove", this.onmousemovehandler, {
      capture: true,
    });

    this.addEventListener("mousedown", this.onmousedownhandler, {
      capture: true,
    });

    this.addEventListener("mouseup", this.onmouseuphandler, { capture: false,  });
    document.addEventListener("mouseup", this.onmouseuphandler);

    this.setZones();
  }

  isIinside() {}
  setZones() {
    const dropZones = this.dataset.dropZones;
    const dropZonesElements = this.querySelectorAll(`#${dropZones}`);

    console.log(dropZonesElements);

    // TODO add events listener for theeses elements to make them behave for droppingaction dragover for styling and drop events.
  }

  getClosest(listOfElement = [HTMLElement]) {
    // TODO implementation... to replace on Array reduce function
    return;
  }
}

customElements.define("cu-displace", Displacable);