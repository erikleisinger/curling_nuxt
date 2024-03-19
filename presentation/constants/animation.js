export const STAR_ANIMATION = {
  fullScreen: false,
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 15
    },
    color: {
      value: ["#ffc107"]
    },
    shape: {
        type: ['star']
    },
     opacity: {
      value: 0.4,
      random: true,
      anim: {
        enable: true,
        speed: 0.1,
        opacity_min: 0,
        opacity_max: 0.3,
        sync: true,
        
      }
    },
    
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "size_min": 0,
        "sync": false
      }
    },
     life: {
      duration: {
        value: -1,
      },
      count: 1,
    },
     move: {
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
      bounce: false,
      direction: "none",
      enable: true,
      out_mode: "out",
      random: true,
      speed: 0.2,
      straight: false
    },
    rotate: {
      value: {
        min: 0,
        max: 360
      },
      direction: "random",
      animation: {
        enable: true,
        speed: 0
      }
    },
    tilt: {
      direction: "random",
      enable: true,
      value: {
        min: 0,
        max: 360
      },
      animation: {
        enable: true,
        speed: 60
      }
    },
    roll: {
      darken: {
        enable: true,
        value: 25
      },
      enable: true,
      speed: {
        min: 15,
        max: 25
      }
    },
    wobble: {
      distance: 20,
      enable: true,
      speed: {
        min: -15,
        max: 15
      }
    }

  },


}