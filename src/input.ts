export default class InputHandler {

    constructor(player) {
        document.addEventListener("keydown", (event) => {
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