var Interlude1 = (function () {
    function Interlude1 () {

        this.displayObjects = [];

        this.add = function (stage) {}
        this.remove = function () {
            // remove all added display objects
            this.displayObjects.forEach(function (displayObject) {
                stage.removeChild(displayObject);
            })
            returnFromInterlude();
        }
        this.i = 0;
        this.colour = '#'+Math.round(Math.random() * 0xFFFFFF).toString(16);
        this.update = function (stage) {
            this.i += 1;

            var shape = new Shape();
            shape.graphics.beginFill(this.colour).drawCircle(0, 0, 100 - Math.cos(this.i / 300 * Math.PI / 2) * 100);
            stage.addChild(shape);
            this.displayObjects.push(shape);

            shape.x = this.i * 2 + 30;
            shape.y = 360 + Math.sin(this.i / 100) * 100;

            if (this.i > 400) {
                this.remove();
            }
        }
    }
    return Interlude1;
})();