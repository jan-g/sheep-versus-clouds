export default class InputHandler {

    constructor(player) {
        document.addEventListener("keydown", (event) => {
            console.log("keydown");
            switch (event.key) {
                case "ArrowLeft":
                    player.left();
                    break;
                case "ArrowRight":
                    player.right();
                    break;
                case "Shift":
                    player.fire();
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            console.log("keyup");
            switch (event.key) {
                case "ArrowLeft":
                    player.left_up();
                    break;
                case "ArrowRight":
                    player.right_up();
                    break;
            }
        });

    }
}