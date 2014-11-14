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
    private init() {
        var es = <HTMLSelectElement> document.getElementById("emitter-selector");
        this.emitters.forEach((e,i) => {
            var option = document.createElement("option");
            option.text = "Emitter #"+i;
            option.value = i.toString();
            es.add(option);
        });

        //Init input ranges
        this.rangeInputs.forEach(id => {
            this.bindRange(id);
            this.setRangeValue(id);
            this.setValue(id);
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
    private setValue(id) {
        var e = <HTMLElement> document.querySelector("#"+id+"-container .value");
        e.innerText = this.emitters[this.selection][id];
    }
}