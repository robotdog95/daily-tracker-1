/*=======================================================
behavior of DnD base class :

default behavior : 
    To create a visual cue a "mouse follower" is created and follow the mouse around 
    To keep stuff customizable, several css classes are needed ann several behaviors can be set
    to create the perfect drag and drop experience, definitions :
    -   shadow : marks the original position of the dragged object, is really just 
                the original element with a opacity styling by default.
                The shadow style is applied only when preview in place is set true,
                if so, the Draggable will be replaced with a placeholder with  
    parameters to configure :
        - lockedCSSClass 
            Default : none
        - mousseFollowerCSSClass
            Default : css class .mouse-follower (absolute position etc...)
        - shadowCSSClass 
            Default : opacity 0.5
        - previewCSSClass
            Default : opacity 0.5
        - acceptedPreviewSSClass : when hovering a dropZone will check dropZone's 'drop-zone' and 'full' attributes (if in WL and if not in BL and if has not Attr 'full') 
            Default : css class .accepted 
        - refusedPreviewCSSClass : when hovering a dropZone will check dropZone's 'drop-zone' and 'full' attributes (if not in WL or if in BL or if has Attr 'full')
            Default : css class .refused

        - thresholdDistance before dragging
            Default : 20px
        - snapBackFollower
            Default : false
        - reorderZonesRatio 
            Default : 0.2 (20% of w and h)
        - whiteList : filters in drop zone via theyr attribute (drop-zone) eg: ↓
            Default : drop-zone : "permit"
        - blackList : filters out drop zone via theyr attribute (drop-zone) 
            eg: Draggable.blacklist="scheduled" <div drop-zone="tasks scheduled"> draggable won't dispatch dnd:dropped CustomEvent
            Default : drop-zone : "forbidden"

=======================================================*/


class DragBase extends HTMLElement {
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
    //Default Configuration:
    static thresholdDistance = 10;
    static whiteList = "default";
    static blackList = "forbidden";
    static reorderZonesRatio = 0.2;
    static willReturnBack = false;
    static styleCSSClasses = {
        HoveredClass:"dnd-hover-draggable",
        FollowerClass:"dnd-follower",
        previewClass:"dnd-preview",
        shadowClass:"dnd-shadow"
    };
    constructor(
            thresholdDistance = DragBase.thresholdDistance, 
            whiteList = DragBase.whiteList, 
            blackList = DragBase.blackList,
            reorderZonesRatio = DragBase.zoneRatio,
            willReturnBack = DragBase.willReturnBack,
            styleCSSClasses = DragBase.styleCSSClasses
        ) {
        super()
        DragBase
        if (!DragBase.once) {
            DragBase.once = true
            this._bindGlobalEvents()
        }
        this._bindEvents()
        this._currentZones = []
    }
    connectedCallback() {
        //this.style.userSelect = "none"
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
        DragBase.mouseFollower.style.pointerEvents = 'none'
        DragBase.mouseFollower.classList.add(DragBase.styleCSSClasses.FollowerClass)

        document.querySelector("body").appendChild(DragBase.mouseFollower)
        DragBase.dragging.classList.add(DragBase.styleCSSClasses.shadowClass)
        DragBase.dragging.style.pointerEvents = ''
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
            DragBase.dragging.classList.remove(DragBase.styleCSSClasses.shadowClass)
            DragBase.dragging.style.pointerEvents = ""
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
        console.log(e);
        if(e.buttons != 1)return
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
        DragBase.hovered?.classList.add(DragBase.styleCSSClasses.HoveredClass)
    }
    _handleMouseLeave(e) {
        if (DragBase.dragging == this) return
        DragBase.hovered.classList.remove(DragBase.styleCSSClasses.HoveredClass)
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

        if (!DragBase.mouseFollower && distance > DragBase.thresholdDistance) { //implique que DragBase.dragging != null
            DragBase.createShadow()
            this.onDragging(e)
            return
        }
        if (DragBase.mouseFollower && distance < DragBase.thresholdDistance && DragBase.willReturnBack) {
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
        if ( /*e.target.hasAttribute("drop-zone")*/ true) { //TODO Check the whitelist and blacklist >here<
            console.log("Mouseup Event From DragBase Instance:", this, "Event :", e);

            this._dispatch(e.target, "dnd:dropped", {
                zones: zones,
                draggable: DragBase.dragging
            })
        }

        DragBase.removeShadow()
        DragBase.dragging?.classList.remove(DragBase.styleCSSClasses.HoveredClass)
        DragBase.dragging = null
    }
}
customElements.define("test-dnd", DragBase)

/* ==========================================================
Order of events or state in the following scenario : 

-   user press mouse btn while hovering in a draggable,
    ->   store mouse position on click; store draggable object; 
    show "locked:active" style if locked.
-   user keeps mouse pressed and start moving
-   user leave the threshold zone
    ->   dispatch zone hovered on the dragable (since user didn't left the draggalbe rect yet)
-   user reenter the threshold zone
    ->  remove the shadow if 
-   (user leave the zone again and) leave it's original container
-   user enter another container that refuse the draggable
-   user leave the forbiden zone then enters another zone that accept the draggable
-   user unpress the mouse to drop the object





-   apply preview style if preview in place is set true;
    else apply style shadow to dragged element;
    create mouseFollower clone;
    if preview in place true, replace element with placeholder;
-   remove style to restore dragged element;
    remove mouseFollower

-   remove placeholder if used

=============================================================*/
const style = {
    display: "block",
    width: "100px",
    height: "100px",
    backgroundColor: "#555",
    borderRadius: "10px",
    userSelect: "none,"
}
const Body = document.querySelector("body")
console.log(Body);
let dnd1 = document.createElement("test-dnd")
let dnd2 = new DragBase()

Body.appendChild(dnd1)
Body.appendChild(dnd2)