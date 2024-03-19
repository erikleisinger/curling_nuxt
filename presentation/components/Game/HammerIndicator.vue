<template>
     <div
                                class="hammer__container"
                                @click="emit('select')"
                                :class="{
                                    selected:
                                        hasHammer,
                                        clickable
                                }"
                            >
                                <q-icon
                                    clickable
                                    :name="
                                        hasHammer
                                            ? 'hardware'
                                            : 'o_hardware'
                                    "
                                    class="hammer-icon"
                                />
                            </div>
</template>
<style lang="scss" scoped>
     .hammer__container {
            z-index: 1;
            transition: transform 0.2s;
            &.clickable {
 &:hover {
                transform: scale(1.1);
            }
            }
           

              width: v-bind(size);
            height: v-bind(size);
            position: absolute;
            bottom: -5px;
            left: -10px;
            z-index: 3;
            background-color: white;
            aspect-ratio: 1/1;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.3);

            color: gray;

            &.selected {
                border: 1px solid $app-mint;
                color: white;
                .hammer-icon {
                    background-color: $app-mint;
                    transform: rotate(45deg);
                }
            }

              .hammer-icon {
                transition: all 0.2s linear;
                font-size: v-bind(iconSize);
                padding: 2px;
                border-radius: inherit;
            }
        }
</style>
<script setup>
    const props = defineProps({
        clickable: Boolean,
        hasHammer: Boolean,
        size: {
            type: String,
            default: '3em'
        },
    })

    const emit = defineEmits(['select'])

    const iconSize = computed(() => `calc(${props.size} - 6px)`)

  
</script>