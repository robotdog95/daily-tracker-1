import { AppComponent, loadHTML } from "./AppComponent.mjs";

export class Timeline extends AppComponent{
    constructor(){
        super()
        console.log(this.timeStrGen());
        
    }
    timeStrGen = function (hourDivider, hourStart, hourEnd){
        this.hourstart = hourStart
        this.hourEnd = hourEnd
        this.containers = Array()
        for(let i = this.hourStart; i<this.hourEnd; i+=(1/hourDivider)){
            let cont = document.createElement("div")
            this.containers.push(cont)
        }
        console.log(this.containers);
        
    }
}

customElements.define("time-line", Timeline)