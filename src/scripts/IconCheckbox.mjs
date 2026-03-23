import { AppComponent, loadHTML } from "./AppComponent.mjs";
export class IconCheckbox extends AppComponent {
    constructor() {
        super();
        this.phosphorId = "ph-plant"
    }

    static htmlpath = "./views/iconCheckbox.html";


    init() {

        this.innerHTML = this.getHTML();
    }

    async connectedCallback() {
        this.innerHTML = await this.getHTML();

        if(this.dataset.icon){
            this.phosphorId = this.dataset.icon
        }

        
        const icon = this.querySelector("#icon-content");
        const contour= this.querySelector("#icon-contour");
        icon.classList="ph-fill "+this.phosphorId;
        contour.classList="ph "+this.phosphorId;
        if (icon) {

            this.addEventListener("click", (e) => {
                console.log("clicked. ", icon.classList);
                switch (icon.classList[2]) {
                    case "empty":
                        console.log("star was empty. make it half")

                        icon.classList.replace("empty", "half");
                        break;
                    case "half":
                        console.log("star was half. make it full")
                        icon.classList.replace("half", "full");


                        break;
                    case "full":
                        console.log("star was full. make it empty")
                        icon.classList.replace("full", "empty");
                        break;
                    default: 
                        console.log("star was nothing, make it half");
                        icon.classList.add("half");
                }

            });
        }

    }
    async getHTML() {
        return await loadHTML(IconCheckbox.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-iconcheckbox", IconCheckbox);