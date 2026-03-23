import { icons } from "../assets/icons/icons.mjs";
import { AppComponent, loadHTML } from "./AppComponent.mjs";

export class IconSelector extends AppComponent{

    constructor() {
        super();

    }
    static htmlpath = "./views/iconSelector.html";
    static iconList = icons;

    init() {

        this.innerHTML = this.getHTML();

    }

    async connectedCallback() {
        this.innerHTML = await this.getHTML();

        const wrapper = this.querySelector("#is-wrapper");


        const tabwrapper = document.createElement("div");
        tabwrapper.id = "tabwrapper";

        Object.entries(icons).forEach(([category, iconlist]) => { //loop twice : 1. palette containers 2. populate containers

            const catButton = document.createElement("button");
            catButton.type="button";

            catButton.classList="is-tab-button button-inactive";
            catButton.id=category
            catButton.innerText=category;

            tabwrapper.append(catButton);

            const catDiv = document.createElement("div");
            catDiv.id = "is-cat-" + category;
            catDiv.classList.add("hidden");
            catDiv.classList.add("is-category")

            for (let i = 0; i < iconlist.length; i++) {
                const el = document.createElement("i");
                el.className = "ph-bold "+iconlist[i];
                el.addEventListener("click", (e) => {
                    e.preventDefault;
                    document.querySelector("#icon-input").value=iconlist[i];
                    document.dispatchEvent(new Event('icon-change'));
                })
                catDiv.append(el);
            }

            wrapper.append(catDiv);
        });
        wrapper.append(tabwrapper);
        tabwrapper.addEventListener("click", (e) =>{
            e.preventDefault;

            console.log(e.target);
            this.dataset.currentcat = e.target.id;
            this.openTab();


        })

        if (!this.dataset.currentcat) {
            this.dataset.currentcat = "home";
        }

        this.openTab();
        console.log(this.dataset.currentcat);
    }

    openTab() {

        const allButtons = this.querySelectorAll(".is-tab-button");
        console.log(allButtons)
        Object.entries(allButtons).forEach(([key, button]) => {

            button.classList.replace("button-active", "button-inactive");
            if (button.id == this.dataset.currentcat) {
                button.classList.replace("button-inactive", "button-active");
            }

        })


        const allTabs=this.querySelectorAll(".is-category")

        Object.entries(allTabs).forEach(([key , tab]) => {
            tab.classList.replace("shown","hidden");
            if(tab.id=="is-cat-"+this.dataset.currentcat){
                tab.classList.replace("hidden","shown");
            }

        })
        
    }

    async getHTML() {
        return await loadHTML(IconSelector.htmlpath);
    }
    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-iconselector", IconSelector);