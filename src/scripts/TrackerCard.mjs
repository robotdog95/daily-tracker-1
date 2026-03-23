import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class TrackerCard extends AppComponent {
    constructor() {
        super();
    }

    static htmlpath = "./views/trackerCard.html";


    init() {
        this.today = Date(Date.now());
        console.log(this.today.toString());
        this.innerHTML = this.getHTML();

    }

    async connectedCallback() {



        this.innerHTML = await this.getHTML();
        this.tracker = new Tracker();

        if (this.id = "ct-preview") {
            this.addEventListener('updatepreview', (e) => {
                e.preventDefault;
                console.log("received updatepreview");
                this.update();
            })

            this.querySelector(".trackercard-nav").style.display="none";
        }


    }

    update() {
        if (this.dataset.name) { this.tracker.name = this.dataset.name; }
        else { this.tracker.name = "new tracker"; }
        if (this.dataset.mode) { this.tracker.mode = this.dataset.mode; }
        else { this.tracker.mode = "none"; }
        if (this.dataset.icon) { this.tracker.icon = this.dataset.icon; }
        else { this.tracker.icon = "ph-star"; }
        if (this.dataset.color) { this.tracker.color = this.dataset.color; }
        else { this.tracker.color = "var(--color-shade-1)"; }
        if (this.dataset.maxvalue) {
            this.tracker.maxValue=this.dataset.maxvalue;
        }
        else{
            this.tracker.maxValue="10";
        }
        if(this.dataset.defvalue) {
            this.tracker.defValue = this.dataset.defvalue;
        }
        else{
            this.tracker.defValue=1;
        }

        const nameField = this.querySelector("#tracker-name");
        const iconField = this.querySelector("#tracker-icon");
        const inputField = this.querySelector("#tracker-input");
        
        iconField.classList.replace("ph-star", this.tracker.icon);
        
        console.log("input field: ", inputField)
        


        let el;
        switch (this.tracker.mode) {

            case "starsys":
                console.log("case starsys: ", this.tracker.mode);
                el = document.createElement("ac-starsystem");

                ;
                inputField.replaceChildren(el);
                break;

            case "checkbox":
                console.log("case checkbox: ", this.tracker.mode);
                const wrapper=document.createElement("div");
                wrapper.className="flex-row"
                el = document.createElement("ac-iconcheckbox");


                const title=document.createElement("span");
                title.innerText=this.tracker.name;
                wrapper.append(el, title);

                inputField.replaceChildren(wrapper);
                break;

            case "time":
                console.log("case  time: ", this.tracker.mode);
                el = document.createElement("ac-timeslider");
  

                inputField.replaceChildren(el);
                break;
            case "freetext":
                console.log("case freetext: ", this.tracker.mode);
                el = document.createElement("ac-freetextinput");

                inputField.replaceChildren(el);
                break;
            default: 
                console.log("case default: ", this.tracker.mode);
                el = document.createElement("span");
 
                el.innerText="Select a tracking mode to preview it."
                inputField.replaceChildren(el);
                break;
        }

        el.id="tracker-mode";
        el.name = this.tracker.name;
        el.dataset.maxvalue = this.tracker.maxValue;
        el.dataset.defvalue = this.tracker.defValue;
        el.dataset.icon = this.tracker.icon;
        el.dataset.color = this.tracker.color;
        this.style = "--tracker-color: " + this.tracker.color;
        nameField.innerText = this.tracker.name;
    }
    async getHTML() {
        return await loadHTML(TrackerCard.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-trackercard", TrackerCard);