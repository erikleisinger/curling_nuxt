import svg from "../assets/badges/fingerpoint.svg?raw";
import gsap from "gsap";
export default defineNuxtPlugin((app) => {
    app.vueApp.directive("touchable", {
        mounted: (el, mods) => {
            const { value } = mods ?? {};
            console.log(value);
            if (!value) return;

            const { height, delay = 0 } = value ?? {};
            setTimeout(() => {
                el.style.position = "relative";
                const parent = document.createElement("div");
                Object.assign(parent.style, {
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: "auto",
                });
                const num = Math.floor(Math.random() * 10000000000);
                const id = `A${num}`;
                const svgEl = document.createElement("div");
                const wrap = document.createElement("div");
                wrap.id = id;
                Object.assign(wrap.style, {
                    height: `${height}px` ?? `100%`,
                    width: `${height}px` ?? "100%",
                });
                wrap.appendChild(svgEl);
                svgEl.outerHTML = svg;

                parent.appendChild(wrap);

                el.appendChild(parent);

                if (delay) {
                    gsap.from(`#${id}`, {
                        opacity: 0,
                        duration: 0.5,
                    })
                }

                const timeline = gsap.timeline({ repeat: -1, yoyo: true, delay: delay ? 0.5 : 0 });

               

                // Define the tapping animation
                timeline.to(`#${id}`, {
                    rotationX: 20,
                    y: -5,
                    duration: 0.5,
                    ease: "power2.inOut",
                    yoyo: true,
                });
                timeline.to({}, { duration: 0.5 });
                timeline.play();
                el.addEventListener("click", function eventHandler(e) {
                    e.stopPropagation();
                    const svg = document.querySelector(`#${id}`);
                    svg.remove();
                    el.removeEventListener("click", eventHandler);
                });
            }, delay);
        },
    });
});
