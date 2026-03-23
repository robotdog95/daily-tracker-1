import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class TimeSlider extends AppComponent {

    constructor() {
        super();
    }

    static htmlpath = "./views/timeSlider.html";


    init() {
        this.innerHTML = this.getHTML();
        console.log(" init");
    }

    async connectedCallback() {

        this.innerHTML = await this.getHTML();
    
        this.mode ="hours"; //later, in ct2 add dataset of time mode if asked.

        const slider = this.querySelector("input");
        slider.max= this.dataset.maxvalue;
        slider.value = this.dataset.defvalue;
        
        const output = this.querySelector("#output");



        slider.oninput = function() {
            output.innerHTML = this.value;
        }

    }

    

    async getHTML() {
        return await loadHTML(TimeSlider.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }
}


customElements.define("ac-timeslider", TimeSlider);