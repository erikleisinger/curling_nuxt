<template>
    <q-dialog v-model="isOpen" class="z-max info__dialog" :class="{'hide-overlay': noOverlay}" @hide="emit('close')" >
           <div class="overlay">
            <slot name="overlay"/>
           </div>   
        <q-card style="max-width: 400px; width: 90vw">
            <q-card-section>
                <slot />
            </q-card-section>
            <slot name="buttons">
                <q-card-actions
                    align="right"
                    class="row"
                    :class="{
                        'justify-between': !!showCancel && !!showConfirm,
                        'justify-end': !showCancel || !showConfirm,
                    }"
                >
                    <q-btn
                        flat
                        :label="props.cancelButtonText"
                        :color="cancelColor"
                        @click="emit('cancel')"
                        v-close-popup
                        v-if="showCancel"
                    ></q-btn>
                    <q-btn
                        flat
                        :label="props.confirmButtonText"
                        :color="confirmColor"
                        @click="emit('confirm')"
                        v-close-popup
                        v-if="showConfirm"
                    ></q-btn>
                </q-card-actions>
            </slot>
        </q-card>
    </q-dialog>
</template>
<style lang="scss" >
.info__dialog {
    &.hide-overlay {
        .q-dialog__backdrop {
            opacity: 0;
        }
    }
    .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        pointer-events: none;
        overflow: hidden;
        max-height: unset!important;
    }
}
.close-button__floating {
    position: absolute;
    right: 0;
}
</style>
<script setup lang="ts">
const isOpen = ref(true);
const emit = defineEmits(["close", "confirm"]);
const props = defineProps({
    confirmButtonText: {
        type: String,
        default() {
            return "Delete";
        },
    },
    confirmColor: {
        type: String,
        default() {
            return "negative";
        },
    },
    cancelButtonText: {
        type: String,
        default() {
            return "Cancel";
        },
    },
    cancelColor: {
        type: String,
        default() {
            return "primary";
        },
    },
    noOverlay: Boolean,
    showConfirm: Boolean,
    showCancel: Boolean,
});

</script>
