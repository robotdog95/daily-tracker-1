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

        this.innerHTML = await this.getHTML();
        const name= this.name;
        const totalNumber = this.dataset.maxvalue;
        const icon = this.dataset.icon;
        const color = this.dataset.icon;
        const wrapper = document.createElement("div");
        wrapper.id="ss-stars";
        const star=this.querySelector(".starsystem-star");

        
        /*make stars */
        for (let i=0; i<totalNumber; i++){
            console.log("hello");
            if(star){
                var starClone = star.cloneNode(true);
                starClone.classList.add("full");
                console.log("star clone: ", starClone);
                var number = i + 1;
                starClone.id = "ss-star-" + number;
                starClone.dataset.number = number;
                const iconEls = starClone.children;
                iconEls[0].classList.add(icon);
                iconEls[1].classList.add(icon);
                console.log("children: ", iconEls);
                this.append(starClone);
            }

    
        }
        
        this.addEventListener("click", (e) => {
            console.log("click");
            e.preventDefault;
            console.log(e.target.className);
            if (e.target.classList.contains("starsystem-star")){
                
                this.updateStars();
            }
        })
        this.appendChild(wrapper);

        
    }

    updateStars(){
        const stars=this.querySelectorAll(".starsystem-star");
        console.log("all stars: ",stars);


        for (let i=0; i<stars.length; i++){
            stars[i].className="starsystem-star";
            console.log("loop ", i , ": ", stars[i]);
        }
   

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