import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class TimeSlider extends AppComponent {

    constructor(inputEl) {
        super();
        if (inputEl) {
            this.inputEl = inputEl;
        }
        else {
            this.inputEl = document.createElement("input");
            this.inputEl.className = "input-hidden";
            this.inputEl.id = "auto-generated-input"
        }


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

        const output = document.querySelector("#"+this.inputEl.id);
        if(output){
            slider.oninput = function () {

                console.log("slider value: ", slider.value)
                console.log("output el: ", output)
                output.value = slider.value;
            }
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