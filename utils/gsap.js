import gsap from 'gsap'

export const triggerClickAnimation = (ref) => {
    gsap.fromTo(
        ref,
        { scale: 1 },
        { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1, overwrite: true }
    );
};