import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class StarSystem extends AppComponent {

    constructor() {
        super();
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
        this.maxValue = this.dataset.maxvalue;
        for (let i = 0; i < this.dataset.maxvalue; i++) {

            var star = this.starPrototype.cloneNode(true);
            star.id = "ss-star-" + (i + 1);
            star.dataset.starid = (i + 1);


            const iconEls = star.children;
            iconEls[0].classList.add(this.dataset.icon);
            iconEls[1].classList.add(this.dataset.icon);
            console.log("loop", i, " star: ", star);
            this.append(star);
        }

        this.addEventListener("click", (e) => {
            e.preventDefault;
            let prevValue = this.currentValue;
            this.currentValue = e.target.dataset.starid;
            console.log("new starsys value: ", this.currentValue, ", old value:", prevValue);

            if (this.currentValue == prevValue) {
                this.currentValue = this.currentValue - 1;
                console.log("new value: ", this.currentValue);
                this.updateStars();
            }
            else {
                this.updateStars();
            }
        })
    }

    updateStars() {
        var starstoshow = this.currentValue;
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