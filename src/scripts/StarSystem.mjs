import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class StarSystem extends AppComponent {

    constructor(inputEl) {
        super();
        if (inputEl) {
            this.inputEl = inputEl;
        }
        else {
            this.inputEl = document.createElement("input");
            this.inputEl.className = "input-hidden";
            this.inputEl.id="auto-generated-input"
        }

    
    }

    static htmlpath = "./views/starSystem.html";


    init() {
        this.innerHTML = this.getHTML();
        console.log("starsystem init");
    }

    async connectedCallback() {

        if (this.defaultValue) { this.currentValue = this.defaultValue; }
        else { this.currentValue = 0; }

        this.innerHTML = await this.getHTML();
        this.starPrototype = this.querySelector("#ss-original");
        if (this.dataset.maxvalue<=5){
            this.maxValue = this.dataset.maxvalue;
        }
        else {
            this.dataset.maxvalue = 5;
            this.maxValue = 5};

        for (let i = 0; i < this.dataset.maxvalue; i++) {

            if(this.starPrototype){
                var star = this.starPrototype.cloneNode(true);
                star.id = "ss-star-" + (i + 1);
                star.dataset.starid = (i + 1);


                const iconEls = star.children;
                iconEls[0].classList.add(this.dataset.icon);
                iconEls[1].classList.add(this.dataset.icon);

                this.append(star);
            }

        }

        this.addEventListener("click", (e) => {
            e.preventDefault;
            let prevValue = this.currentValue;
            this.currentValue = e.target.dataset.starid;


            if (this.currentValue == prevValue) {
                this.currentValue = this.currentValue - 1;

                this.updateStars();
            }
            else {
                this.updateStars();
            }
        })
    }

    updateStars() {
        var starstoshow = this.currentValue;
        console.log(this.inputEl, this.currentValue);
        this.inputEl.value = this.currentValue;
        const allStars = this.querySelectorAll(".starsystem-star");

        allStars.forEach(function (star, index, listObj) {
            if(index!=0){
                if(index<=starstoshow){
                    star.classList.toggle("on", true);
                }
                else{
                    star.classList.toggle("on", false);
                }
            } 

        },);
    }

    async getHTML() {
        return await loadHTML(StarSystem.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }
}


customElements.define("ac-starsystem", StarSystem);