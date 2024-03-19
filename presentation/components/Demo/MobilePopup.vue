<template>
  <div style="position: fixed; z-index: 10000; top: 0; bottom: 0; left: 0; right: 0; margin: auto; display: flex; justify-content: center; align-items: center; background-color: rgba(0,0,0,0.4)" v-if="showPopup">
 <DialogCard>
        <template v-slot:title>Welcome to Pebble!</template>
        <template v-slot:content>
            Pebble is best viewed on mobile.*
            
            <br/>
            <br/> To get the most out of Pebble, please <strong>view it on your phone</strong>, or simulate a mobile device in your browser.


            <br/>

            <br/>

            <span style="font-size: 0.8em; font-style: italic">* Pre-alpha only; desktop optimization is on its way! </span>
        </template>
            <template v-slot:footer>
                 
                   
                    <Button color="red" @click="showPopup = false">   Close</Button>
                    
                </template>
    </DialogCard>
    </div>

    
</template>
<script setup>
    const $q = useQuasar();

    const showPopup = ref(false);

    watch(() => $q.screen.gt.sm, (val) => {
        showPopup.value = val;
    }, {immediate: true})
</script>