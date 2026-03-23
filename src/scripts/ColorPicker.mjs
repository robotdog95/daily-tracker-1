import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class ColorPicker extends AppComponent {

    constructor() {
        super();
    }

    static htmlpath = "./views/colorPicker.html";


    init() {
        this.innerHTML = this.getHTML();
        console.log(" init");
    }

    async connectedCallback() {

        /* how this will work:
            the colorpicker will provide a color range based on the "parents" (ex: category of the tracker) main colors . 

            1. know your 2 (or 3? ) colors
            2. generate gradient from those colors and apply eventual effects
            3. ???
            4. profit

            paul dit set image data
            se renseigner sur canvas

              */
        this.innerHTML = await this.getHTML();
    
        const background = makeBackground();
    }
    async getHTML() {
        return await loadHTML(ColorPicker.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }
}


customElements.define("ac-colorpicker", ColorPicker);
