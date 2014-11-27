///<reference path="RenderObject.ts" />
///<reference path="RenderSystem.ts" />
class Renderable {
    constructor() {
        RenderSystem.getInstance().addRenderable(this);
    }
    public collectDrawData(deltaTime : number) : RenderObject {
        throw new Error("This abstract method has not been implemented");
    }
    public dispose() {
        RenderSystem.getInstance().removeRenderable(this);
    }
}