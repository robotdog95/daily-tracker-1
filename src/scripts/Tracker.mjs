export class Tracker {
    constructor(name, mode, color, icon, maxValue, defValue, options, category) {
        this.name = name;
        this.mode = mode;
        this.color = color;
        this.icon = icon;
        this.category = category;
        this.maxValue = maxValue;
        this.defValue = defValue;
        this.options = options;
        this.entries = [];

        this.makeElId();


    }

    makeElId(){
        if (this.name) {
            console.log("making id for tracker: ", this.name);

            let a = this.name.replaceAll(" ", "");
            const b = a.toLowerCase();
            const id = b.replace(/[^a-zA-Z0-9 ]/g, '');

            this.elId=id;

        }
        else {
            console.log("no name: ", this.name);
            this.elId="new-tracker";
        }
        console.log("elId output: ", this.elId);
    }


    recieveEntry(entry) {
        isValid = true;
        if (isValid) {
            //check if entry is valid
            this.entries.push(entry);
        }
        else {
            console.error("entry ", entry, "is not in valid format.");
        }
    }

    removeEntry(entryId){
        var entryToRemove = this.entries.entryId;
        console.log("entry to remove: ", entryToRemove);
        //doesnt actually remove anything because I'm not sure how it works yet
    }

    displayData(){
        const data = this.name + " " + this.mode + " " + this.maxValue + " " + this.defValue + " " + this.options;
        return data;
    }
}

export class Category {
    constructor(name, color){
        this.name=name;
        this.color=color;
        this.trackerPointers=[];


    }



    updatePointers(trackers){
        console.log(trackers);
        if(trackers){
            trackers.forEach(tracker => {
                if (tracker.category == this.name) {
                    this.trackerPointers.push(tracker);
                }
            });
            console.log(this.trackerPointers)
            return this.trackerPointers;

        }

    }

}
