/// <reference path="../Particle-System/Emitter.ts" />
class EmitterCustomizer {
    constructor(private emitters : Emitter[]) {
        this.init();
    }
    private selection : number = 0;
    private rangeInputs = [
        "pitch",
        "yaw",
        "pitchVar",
        "yawVar",
        "life",
        "lifeVar",
        "speed",
        "speedVar"
    ];
    private vectorInputs = [
        "position",
        "force"
    ];
    private init() {
        var es = <HTMLSelectElement> document.getElementById("emitter-selector");
        this.emitters.forEach((e,i) => {
            var option = document.createElement("option");
            option.text = "Emitter #"+i;
            option.value = i.toString();
            es.add(option);
        });
        es.onchange = (e : Event) => {
            this.selection = parseInt(es.value);
            this.rangeInputs.forEach(id => {
                this.setRangeValue(id);
                this.setValue(id);
            });
            this.vectorInputs.forEach(id => {
                this.setVectorValue(id);
            });
        };

        //Init input ranges
        this.rangeInputs.forEach(id => {
            this.bindRange(id);
            this.setRangeValue(id);
            this.setValue(id);
        });
        //init input vectors
        this.vectorInputs.forEach(id => {
            this.bindVector(id);
            this.setVectorValue(id);
        });
        //Options panel toggle
        document.getElementById("options-toggle").onclick = (e : Event) => {
            var toggle = <HTMLImageElement>e.srcElement;
            var panel = <HTMLElement> document.getElementById("options");
            if(toggle.classList.contains("options-open")) {
                toggle.classList.remove("options-open");
                panel.classList.remove("options-open");
            } else {
                toggle.classList.add("options-open");
                panel.classList.add("options-open");
            }
        }
    }
    private bindRange(id) {
        document.getElementById(id).oninput = (e : Event) => {
            var elem = <HTMLInputElement> e.srcElement;
            this.emitters[this.selection][id] = parseFloat(elem.value);
            this.setValue(id);
        };
    }
    private setRangeValue(id) {
        var e = <HTMLInputElement> document.getElementById(id);
        e.value = this.emitters[this.selection][id];
    }
    private bindVector(id) {
        var vector = document.querySelectorAll("#"+id+" input");
        var eVector = <Vector> this.emitters[this.selection][id];
        function bindVectorField(input : HTMLInputElement, property) {
            input.oninput = e => eVector[property] = parseFloat(input.value);
        }
        bindVectorField(<HTMLInputElement>vector[0],"x");
        bindVectorField(<HTMLInputElement>vector[1],"y");
        bindVectorField(<HTMLInputElement>vector[2],"z");
    }
    private setVectorValue(id) {
        var vector = document.querySelectorAll("#"+id+" input");
        var eVector = <Vector> this.emitters[this.selection][id];
        function setVectorField(input : HTMLInputElement, property) {
            input.value = eVector[property].toString();
        }
        setVectorField(<HTMLInputElement>vector[0],"x");
        setVectorField(<HTMLInputElement>vector[1],"y");
        setVectorField(<HTMLInputElement>vector[2],"z");
    }
    private setValue(id) {
        var e = <HTMLElement> document.querySelector("#"+id+"-container .value");
        e.innerText = this.emitters[this.selection][id];
    }
}