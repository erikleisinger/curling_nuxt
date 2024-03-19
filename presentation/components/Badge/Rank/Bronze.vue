<template>
    <div class="bronze__container">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            :width="size"
            :height="size"
            viewBox="0 0 24 24"
            class="behind"
        >
            <defs>
                <!-- Define the linear gradient -->
                <linearGradient
                    id="customGradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                   <stop offset="0%" stop-color="rgba(70,42,28,1)" />
                    <stop offset="50%" stop-color="rgba(70,42,28,1)" />
                    <stop offset="50%" stop-color="rgba(55,36,27,1)" />
                    <stop offset="100%" stop-color="rgba(55,36,27,1)" />

                    
                

                </linearGradient>
            </defs>

            <path
                fill="url(#customGradient2)"
                d="M10.557.472c.859-.628 2.026-.628 2.886 0 2.059 1.506 1.616 1.362 4.166 1.354 1.065-.003 2.009.683 2.334 1.696.78 2.427.507 2.052 2.575 3.544.863.623 1.224 1.733.892 2.745-.794 2.417-.798 1.953 0 4.38.333 1.011-.028 2.122-.892 2.745-2.068 1.491-1.794 1.116-2.575 3.544-.325 1.014-1.27 1.7-2.334 1.696-2.551-.008-2.108-.152-4.166 1.354-.859.628-2.026.628-2.886 0-2.059-1.505-1.616-1.363-4.166-1.354-1.065.003-2.009-.683-2.334-1.696-.78-2.43-.511-2.055-2.575-3.544-.863-.623-1.224-1.733-.892-2.745.795-2.417.798-1.953 0-4.38-.333-1.013.028-2.123.891-2.746 2.062-1.489 1.795-1.111 2.575-3.544.325-1.014 1.27-1.7 2.334-1.696 2.545.008 2.096.161 4.167-1.353z"
            />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :width="size * 0.95"
            :height="size * 0.95"
            viewBox="0 0 24 24"
            class="bronze-badge behind"
        >
            <defs>
                <!-- Define the linear gradient -->
                <linearGradient
                    id="customGradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="rgba(154,84,36,1)" />
                    <stop offset="50%" stop-color="rgba(154,84,36,1)" />
                    <stop offset="50%" stop-color="rgba(124,69,33,1)" />
                    <stop offset="100%" stop-color="rgba(124,69,33,1)" />

                    
                

                </linearGradient>
            </defs>

            <path
                fill="url(#customGradient1)"
                d="M10.557.472c.859-.628 2.026-.628 2.886 0 2.059 1.506 1.616 1.362 4.166 1.354 1.065-.003 2.009.683 2.334 1.696.78 2.427.507 2.052 2.575 3.544.863.623 1.224 1.733.892 2.745-.794 2.417-.798 1.953 0 4.38.333 1.011-.028 2.122-.892 2.745-2.068 1.491-1.794 1.116-2.575 3.544-.325 1.014-1.27 1.7-2.334 1.696-2.551-.008-2.108-.152-4.166 1.354-.859.628-2.026.628-2.886 0-2.059-1.505-1.616-1.363-4.166-1.354-1.065.003-2.009-.683-2.334-1.696-.78-2.43-.511-2.055-2.575-3.544-.863-.623-1.224-1.733-.892-2.745.795-2.417.798-1.953 0-4.38-.333-1.013.028-2.123.891-2.746 2.062-1.489 1.795-1.111 2.575-3.544.325-1.014 1.27-1.7 2.334-1.696 2.545.008 2.096.161 4.167-1.353z"
            />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :width="size * 0.85"
            :height="size * 0.85"
            viewBox="0 0 24 24"
            class="behind"
        >
            <defs>
                <!-- Define the linear gradient -->
                <linearGradient
                    id="customGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="rgba(186,99,40,1)" />
                    <stop offset="50%" stop-color="rgba(186,99,40,1)" />
                    <stop offset="50%" stop-color="rgba(172,95,44,1)" />
                    <stop offset="100%" stop-color="rgba(172,95,44,1)" />
                </linearGradient>
            </defs>
            <path
                fill="url(#customGradient)"
                d="M10.557.472c.859-.628 2.026-.628 2.886 0 2.059 1.506 1.616 1.362 4.166 1.354 1.065-.003 2.009.683 2.334 1.696.78 2.427.507 2.052 2.575 3.544.863.623 1.224 1.733.892 2.745-.794 2.417-.798 1.953 0 4.38.333 1.011-.028 2.122-.892 2.745-2.068 1.491-1.794 1.116-2.575 3.544-.325 1.014-1.27 1.7-2.334 1.696-2.551-.008-2.108-.152-4.166 1.354-.859.628-2.026.628-2.886 0-2.059-1.505-1.616-1.363-4.166-1.354-1.065.003-2.009-.683-2.334-1.696-.78-2.43-.511-2.055-2.575-3.544-.863-.623-1.224-1.733-.892-2.745.795-2.417.798-1.953 0-4.38-.333-1.013.028-2.123.891-2.746 2.062-1.489 1.795-1.111 2.575-3.544.325-1.014 1.27-1.7 2.334-1.696 2.545.008 2.096.161 4.167-1.353z"
            />
        </svg>
        <div class="text">50</div>

              
    </div>
</template>
<style lang="scss" scoped>
.bronze__container {
    position: relative;
    width: v-bind(sizePx);
    height: v-bind(sizePx);
}
.text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-size: v-bind(fontSize);
    line-height: v-bind(sizePx);
    font-family: $font-family-header;
}

.behind {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
</style>
<script setup>
const size = ref(100);
const sizePx = computed(() => `${size.value}px`);
const fontSize = computed(() => `${size.value * 0.5}px`);
</script>
