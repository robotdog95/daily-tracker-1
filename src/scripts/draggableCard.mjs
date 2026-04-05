import {
  AppComponent,
  loadHTML
} from "./AppComponent.mjs";

function random(min = 0, max = 1) {
  return Math.random() * max + min;
}

export class DragBase extends AppComponent {

  //#region -------- Shared drag state (one drag operation at a time) --------
  //Visual Copies Of DragBase Element:
  static mouseFollower = null; //when dragging a copy of the DragBase will follow the mouse, can change shape to match the preview clone:
  static previewClone = null; // the preview clone is shown inside a drop zone if it can accept it .
  //Handle to DragBase Elements:
  static hovered = null; //the DragBase hovered, when dragging, the dragged element can be reordered accordingly to the zone hovered.
  static dragging = null; //the actual element to be dragged.
  //Configuration variables:
  static zoneRatio = 0.2 //indicatethe ratio of space to trigger the side zones (for re-ordering element, if applicable.)
  static hoveredStyle = "hover-draggable"
  //Coordinate system for moving stuff around:
  static mousePos = {
    x: 0,
    y: 0
  }
  static mouseDownPos = {
    x: 0,
    y: 0
  }
  static offset = {
    x: 0,
    y: 0,
  }
  constructor() {
    super()
    if (!DragBase.once) {
      DragBase.once = true
      this._bindGlobalEvents()
    }
    this.style.userSelect = "none"
    this._bindEvents()
    this._currentZones = []
  }

  //#endregion ==================================================================
  //#region -------- Static Helpers --------
  static isInside = (position = {
    x: 0,
    y: 0
  }, rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }) => {
    let inside = position.x > rect.left &&
      position.x < rect.left + rect.width &&
      position.y > rect.top &&
      position.y < rect.top + rect.height
    if (inside) {
      return true
    }
    return false
  }
  /*getZone: return a rect representing the area for triggering the sorting of DragBase by hovering over.*/
  static getZoneRect(zone, rect) {
    const {
      left,
      top,
      width,
      height
    } = rect
    const rw = width * DragBase.zoneRatio
    const rh = height * DragBase.zoneRatio
    switch (zone) {
      case "top":
        return {
          left, top, width, height: rh
        };
      case "bottom":
        return {
          left, top: top + height - rh, width, height: rh
        };
      case "left":
        return {
          left, top, width: rw, height
        };
      case "right":
        return {
          left: left + width - rw, top, width: rw, height
        };
      default:
        throw new Error(`DragBase.getZone: unknown zone "${zone}"`);
    }
  }
  static resolveZone(position, rect) {
    let zones = Array()
    for (const zone of ["top", "bottom", "left", "right"]) {
      if (DragBase.isInside(position, DragBase.getZoneRect(zone, rect))) {
        zones.push(zone)
      }
    }
    if (DragBase.isInside(position, rect)) {
      if (!zones[0]) {
        return ["center"]
      }
      return zones
    } else {
      return ["outside"]
    }
  }
  static createShadow() {
    DragBase.mouseFollower = DragBase.dragging.cloneNode(true)
    DragBase.mouseFollower.innerHTML = DragBase.dragging.innerHTML
    DragBase.mouseFollower.style.left = `${DragBase.mousePos.x - DragBase.offset.x}px`
    DragBase.mouseFollower.style.top = `${DragBase.mousePos.y - DragBase.offset.y}px`
    DragBase.mouseFollower.style.width = `${DragBase.dragging.getBoundingClientRect().width}px`
    DragBase.mouseFollower.style.height = `${DragBase.dragging.getBoundingClientRect().height}px`
    DragBase.mouseFollower.style.opacity = "0.5"
    DragBase.mouseFollower.style.pointerEvents = 'none'
    DragBase.mouseFollower.classList.add("follow-mouse")

    document.querySelector("body").appendChild(DragBase.mouseFollower)
    DragBase.dragging.classList.add("has-shadow")
    DragBase.dragging.style.mouseEvents = "none"
  }
  static moveShadow() {
    if (DragBase.mouseFollower) {
      const rect = DragBase.dragging.getBoundingClientRect();
      const rect2 = DragBase.mouseFollower.getBoundingClientRect();

      const xfact = rect.width / rect2.width
      const yfact = rect.height / rect2.height
      //console.log(xfact, yfact);

      DragBase.mouseDownPos.x *= xfact
      DragBase.mouseDownPos.y *= yfact
      DragBase.mouseFollower.style.left = `${DragBase.mousePos.x - DragBase.offset.x}px`
      DragBase.mouseFollower.style.top = `${DragBase.mousePos.y - DragBase.offset.y}px`
      DragBase.mouseFollower.animate({
        height: rect.height + "px",
        width: rect.width + "px",
      }, {
        duration: 80,
        fill: "forwards"
      })
    }
  }
  static removeShadow() {
    if (DragBase.mouseFollower) {
      this.moveShadowBack().then(() => {
        DragBase.mouseFollower?.remove();
        DragBase.mouseFollower = null
      })

    }
    if (DragBase.dragging) {
      DragBase.dragging.style.visibility = "unset"
      DragBase.dragging.classList.remove("has-shadow")
      DragBase.dragging.style.mouseEvents = ""
    }
  }
  static async moveShadowBack() {
    let rect = DragBase.dragging.getBoundingClientRect();
    const snaptime = 40;

    // Start the animation
    const shadowElement = DragBase.mouseFollower;

    // Define the keyframes for the animation
    const animation = shadowElement.animate(
      [{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        height: `${rect.height}px`,
        width: `${rect.width}px`
      }], {
        duration: snaptime,
        fill: "forwards",
        timingFunction: "ease-in-out"
      }
    );

    // Wait for the animation to finish
    return new Promise((resolve) => {
      animation.onfinish = resolve;
      animation.onerror = resolve; // Ensure we handle any errors as well
    });
  }
  static _bindGenericDropZoneEvent(el) {
    el.addEventListener("dnd::dropped", (e) => {
      el.appendChild(e.detail.draggable)
    })
  }
  //#endregion
  //#region -------- Utils --------
  _dispatch(element = this, name, detail = {}) {
    console.log(element);
    
    element.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true, // crosses shadow DOM boundaries, unused for now...
      detail: {
        source: element,
        ...detail
      }
    }))
  }

  //#endregion

  //#region hooks //!\\ HOOKS TO OVERLOAD : positionnal hover behavior 
  onZoneHovered(e) {}
  onDragging(e) {}
  onDrop(e) {}
  //#endregion

  _bindEvents() {
    this.addEventListener("mousedown", (e) => this._handleMouseDown(e))
    this.addEventListener("mouseenter", (e) => this._handleMouseEnter(e))
    this.addEventListener("mouseleave", (e) => this._handleMouseLeave(e))
    this.addEventListener("mouseup", (e) => this._handleMouseUp(e))

    //* console.log("binding 'per instance' events ");

    //----------------- Hooks Default Behavior ------------------------

    this.addEventListener("zone-hovered", (e) => this.onZoneHovered(e))
    this.addEventListener("zone-hovered", (e) => this.onZoneHovered(e))

  }
  _bindGlobalEvents() {
    document.addEventListener("mousemove", (e) => this._handleMouseMove(e))
    document.addEventListener("mouseup", (e) => this._handleGlobalMouseUp(e))
    //* console.log("binding Global events, this should happen once");
  }
  _handleMouseDown(e) {
    DragBase.dragging = DragBase.hovered
    DragBase.mouseDownPos.x = e.clientX
    DragBase.mouseDownPos.y = e.clientY
    DragBase.offset = {
      x: e.offsetX,
      y: e.offsetY,
    }
  }
  _handleMouseEnter(e) {
    if (e.target !== this) return; // Ensure it's the same instance
    if (DragBase.dragging) {

    }
    DragBase.hovered = this
    DragBase.hovered?.classList.add(DragBase.hoveredStyle)
  }
  _handleMouseLeave(e) {
    if (DragBase.dragging == this) return
    DragBase.hovered.style.backgroundColor = ""
    DragBase.hovered.classList.remove(DragBase.hoveredStyle)
    DragBase.hovered = null
  }
  _handleMouseMove(e) {
    if (!DragBase.dragging) return
    DragBase.mousePos = {
      x: e.clientX,
      y: e.clientY
    }

    let distance = Math.sqrt((e.clientX - DragBase.mouseDownPos.x) ** 2 + (e.clientY - DragBase.mouseDownPos.y) ** 2).toFixed(0);
    //console.log(distance);

    if (!DragBase.mouseFollower && distance > 20) { //implique que DragBase.dragging != null
      DragBase.createShadow()
      this.onDragging(e)
      return
    }
    if (DragBase.mouseFollower && distance < 20) {
      DragBase.removeShadow()
      return
    }
    if (DragBase.mouseFollower) {
      DragBase.moveShadow()
      let zones = DragBase.resolveZone(DragBase.mousePos, e.target.getBoundingClientRect())
      if (e.target.tagName == "DRAG-BASE") {
        if (zones.every(item => this._currentZones.includes(item)) &&
          this._currentZones.every(item => zones.includes(item))) return
        e.target._dispatch("zone-hovered", {
          zones: zones,
          draggable: DragBase.dragging,
        })
        this._currentZones = zones
        console.log("hovering on zone(s) :", zones);
      }
      this._dispatch(e.target, "zone-hovered", {
          zones: zones,
          draggable: DragBase.dragging,
        })
    }


  }
  _handleMouseUp(e) {

  }
  _handleGlobalMouseUp(e) {
    if (!DragBase.dragging) return
    let zones = Array()
    zones = this._currentZones /*DragBase.resolveZone(DragBase.mousePos, e.target.getBoundingClientRect())*/
    /*if (e.target.tagName == "DRAG-BASE") {
      e.target._dispatch("zone-hovered", {
        zones: zones,
        dragging: DragBase.dragging
      })
      console.log("dropped on zone(s) :", zones);

    }*/
    if ( /*e.target.hasAttribute("drop-zone")*/ true) {
      console.log("Mouseup Event From DragBase Instance:", this, "Event :", e);

      this._dispatch(e.target, "dnd:dropped", {
        zones: zones,
        draggable: DragBase.dragging
      })
    }

    DragBase.removeShadow()
    DragBase.dragging?.classList.remove(DragBase.hoveredStyle)
    DragBase.dragging = null
  }
}

export class DraggablePlannerTasks extends DragBase {
  constructor(dataObject = {}) {
    super()
    if (dataObject == {}) {
      console.warn("no data specified !");
    } else {
      this.date = dataObject.date
    }
  }
  connectedCallback() {
    console.log("task created");
  }
}

customElements.define("draggable-task", DraggablePlannerTasks)

class Timeline extends AppComponent {
  constructor() {
    super()
    this.startTime = this.getAttribute("data-start-time")
    this.startHour = Math.trunc(this.startTime / 100)
    this.startMinutes = this.startTime % 100

    this.endTime = this.getAttribute("data-end-time")
    this.endHour = Math.trunc(this.endTime / 100)
    this.endMinutes = this.endTime % 100
    let duration = 0


    duration = (2400 - (this.startTime - this.endTime)) % 2400
    this.increments = parseInt(this.getAttribute("data-increments"))
    console.log(this.increments);

    this.cellnumber = (Math.trunc(duration / 100) * 60 / this.increments) //duration using hours
    this.cellnumber += Math.trunc((duration % 100) / this.increments) //add cells for end of the day minutes

    console.log(this.cellnumber);

    let cellstr = `repeat(${this.cellnumber}, 1fr)`
    Object.assign(this.style, {
      display: "grid",
      gridAutoFlow: "row",
      gridTemplateRows: cellstr,
    })
  }

  connectedCallback() {
    this.createTimelineGraduations()
    this.createCells()
    //this.populateCells() //TODO: Get data from db API and place tasks accordingly 
    this.resolveCells()
  }

  createCells() {
    this.cells = Array()
    for (let cellIdx = 1; cellIdx <= this.cellnumber; cellIdx++) {
      let cellDiv = document.createElement("div")
      cellDiv.setAttribute("free", "")
      cellDiv.setAttribute("order", cellIdx)
      cellDiv.setAttribute("cellSize", this.increments)

      this.styleCell(cellDiv)

      this.cells.push(cellDiv)
    }
  }

  styleCell(cellElement) {

    console.log("cell stylised :", cellElement);


    let colStart = 2
    let colEnd = 2
    let rowStart = parseInt(cellElement.getAttribute("order"))
    let rowEnd = rowStart + (parseInt(cellElement.getAttribute("cellsize")) / this.increments)
    console.log("row end style :", rowEnd, cellElement.getAttribute("cellsize"), cellElement, this.increments);

    Object.assign(cellElement.style, {
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    })
  }

  resolveCells() {
    this.cells.forEach(cell => {
      if (cell.hasAttribute("free")) {
        this.appendChild(cell)
        this.addListener(cell)
      }
    });
  }

  addListener(cell) {
    console.log("adding event listener to ", cell)

    cell.addEventListener("dnd:dropped", (e) => {
      let dropped = e.detail.draggable;
      let rowspan = parseInt(e.detail.draggable.getAttribute("data-time-length")) / this.increments
      dropped.dataset.row = cell.getAttribute("order")
      dropped.dataset.rowspan = rowspan
      dropped.classList.add("row-attr")
      dropped.classList.add("scheduled")
      this.appendChild(dropped)
    });
    cell.addEventListener("zone-hovered", (e) => {
      console.log(e);
    });
    "zone-hovered"
  }

  createTimelineGraduations() {

    console.log("creating timestamps column ... ");


    let hourstr = this.startHour
    let separator = ":"
    let minstr = this.startMinutes
    for (let i = 0; i <= this.cellnumber; i++) {
      let timeLineDiv = document.createElement("div");

      if (parseInt(minstr) >= 60) {
        minstr = minstr % 60
        hourstr = (hourstr + 1) % 24
      }
      timeLineDiv.textContent = `${String(hourstr).padStart(2,'0')}${separator}${String(minstr).padStart(2,'0')} to ${String((minstr + this.increments) >= 60 ? (hourstr + 1)%24 : hourstr).padStart(2,'0')}${separator}${String((minstr + this.increments) % 60).padStart(2,'0')}`
      this.appendChild(timeLineDiv)
      timeLineDiv.classList.add("timeline-time")
      minstr += parseInt(this.increments)
    }
  }

}
customElements.define("time-line-scheduler", Timeline)