import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { TrackerCard } from "./TrackerCard.mjs";
import { Category, Tracker } from "./Tracker.mjs";

/* ok so i think i need to rewrite the whole thing.
    problem is, i need to control the order of execution of stuff to be able to smoothly refresh and right now it's just a bandage over bandage etc so better redo it all */

export class TrackerManagerView extends AppComponent {
    constructor() {
        super();

    }

    static htmlpath = "./views/trackerManagerView.html";


    init() {

        this.innerHTML = this.getHTML();
    }


    async connectedCallback() {
        this.isReady=false;
        this.innerHTML = await this.getHTML();
        this.trackerCardsDiv = this.querySelector("#tm-trackers");
        this.allTrackers = await (window.db.findByPrefix("tracker"));
        this.categories = await (window.db.findByPrefix("cat"));

        console.warn("trackers fetched: ", this.allTrackers);

        this.renderTrackers();
        this.renderCategories();
        this.createCategory();

        
        this.addEventListener('update:trackers', (e) => {
            if (this.isReady) {
                this.refetch();
            }
            console.log("recieved prompt to refresh trackers");

        })
        const resetCatButt = this.querySelector("#reset-categories");
        resetCatButt.addEventListener("click", (e) => {
            e.preventDefault;
            console.log("reset cat clicked");


            this.categories.forEach(category => {
                let id = category._id;
                let rev = category._rev;
                console.log("working on cat: ", category);
                console.log("removing: ", id, rev);

                window.db.remove(id, rev);
            })


        })

        const resetTrackerButt = this.querySelector("#reset-trackers");
        resetTrackerButt.addEventListener("click", (e) => {
            e.preventDefault;
            console.log("reset tracker clicked");

            this.allTrackers.forEach(tracker => {
                let id = tracker._id;
                let rev = tracker._rev;
                console.log("working on tracker: ", tracker);
                console.log("removing: ", id, rev);

                window.db.remove(id, rev);
            })
        })

    }

    createCategory() {

        this.catForm = this.querySelector("#create-category");
        const submitButton = this.querySelector("#submit-cat");
        submitButton.addEventListener("click", (e) => {
            e.preventDefault;
            const formData = new FormData(this.catForm);
            const name = formData.get("name");
            const color = formData.get("color");
            const cat = new Category(name, color);
            window.api.sendData(cat, "new-category");
            //later add confirm screen and reset

        });


    }

    renderCategories() {

        this.categories.forEach(category => {
            const thisCat = new Category(category.name, category.color);
            let el;
            let id = "cat" + thisCat.name;
            const catExists = this.querySelector("#" + id);
            if (!catExists) {
                console.log("category doesn't exist. Making one...")
                el = document.createElement("div");
                el.id = id
                el.className = "category";
                el.style = "--color: " + thisCat.color;
            }
            else {
                el = catExists;
            }

            const trackersToDisplayHere = thisCat.updatePointers(this.allTrackers);
            console.log("trackers to display in ", el.id, ": ", trackersToDisplayHere);

            for (let i = 0; i < trackersToDisplayHere.length; i++) {

                const tracker = trackersToDisplayHere[i];
                console.log("looking to place ", tracker, "in cat: ", el.id);

                const id = "#" + tracker.elId;
                console.log("looking for element with id: ", id)
                const trackerEl = this.querySelector("#" + tracker.elId);

                if (trackerEl !== null && trackerEl !== undefined && trackerEl && el) {
                    console.log("tracker in cat: ", tracker.elId, ". Tracker Element: ", trackerEl);
                    if (el) {
                        el.append(trackerEl);
                        console.log("success appending");
                        this.isReady=true;
                    }

                    else { console.log("something went wrong: ", trackerEl, el) }
                }

            }
            const title = document.createElement("h3");
            title.innerText = category.name;

            el.append(title);
            this.append(el);

        })
    }

    async refetch() {
this.isReady=false;
        this.innerHTML = await this.getHTML();
        this.allTrackers = await (window.db.findByPrefix("tracker"));
        this.categories = await (window.db.findByPrefix("cat"));

        this.renderTrackers();
        this.renderCategories();
        this.createCategory();
        console.log("ready");

    }

    async renderTrackers() {
        console.log("rendering trackers...");

        this.allTrackers.forEach(tracker => {
            if (tracker.name) {

                let el;
                const elExists = this.querySelector("#" + tracker.elId);

                if (elExists) {
                    console.log("element: ", elExists);
                    elExists.update();
                    this.isReady=true;
                } else {
                    el = new TrackerCard(tracker, true);
                    el.id = tracker.elId;
                    console.log("appending tracker ", el.id, "to ", this.trackerCardsDiv.id);
                    this.trackerCardsDiv.append(el);
                    this.isReady=true;
                }


            }

        });
        
    }

    async getHTML() {
        return await loadHTML(TrackerManagerView.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-trackermanager", TrackerManagerView);