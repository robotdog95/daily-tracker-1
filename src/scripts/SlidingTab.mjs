import { AppComponent, loadHTML } from "./AppComponent.mjs";
export class SlidingTab extends AppComponent {
    constructor() {
        super();
        this.invokerId = this.dataset.invokerid;

    }

    //take the invoker attribute that is used to instantiate this
    static htmlpath = "./views/slidingTab.html";
    static id = this.id;
  

    handleInvoker(invoker) {
        invoker.addEventListener("click", (e) => {
            e.preventDefault;
            console.log ("invoker clicked: ", invoker.id)
            if (this.classList.contains("unslided")) {
                this.classList.replace("unslided", "sliding");

                setTimeout(function () {
                    let el = document.getElementsByClassName("sliding");
                    el[0].className = "slided";

                }, 10);
            }

            else if (this.classList.contains("slided")) {
                this.classList.replace("slided", "unsliding");
                setTimeout(function () {
                    let el = document.getElementsByClassName("unsliding");
                    el[0].className = "unslided";


                }, 10);
            }

            else {
                this.className = "unslided";
            }
            //make an animation with waiting and stuff
        })
    }
    init() {
        this.innerHTML = this.getHTML();

    }

    async connectedCallback() {
        this.classList.add("unslided");
        const content = this.innerHTML;
        console.log("content: ", content);
        this.innerHTML = await this.getHTML();
        //listen to invoker

        const invoker = await this.getInvoker();
        this.handleInvoker(invoker);
        const slidingBoi= document.getElementById("slidinboi");
        slidingBoi.id = this.id;
        slidingBoi.innerHTML = content;

    }

    async getInvoker(){
        return document.getElementById(this.invokerId);
    }
    async getHTML() {
        return await loadHTML(SlidingTab.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-slidingtab", SlidingTab);