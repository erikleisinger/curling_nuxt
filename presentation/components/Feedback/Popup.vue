<template>
    <q-dialog v-model="open" class="z-max"  @hide="emit('close')" >
        <q-card>

            <q-card-section>
                <h3>Submit feedback</h3>
                <h4 class="text-sm font-secondary">Let me know about any bugs, issues, or ideas you might have. I really appreciate it!</h4>
            </q-card-section>
            <q-card-section>
                <q-input counter type="textarea" v-model="text" outlined placeholder="Type your feedback here" :rules="[(val) => val.length < MAX_LENGTH || `Please limit your feedback to ${MAX_LENGTH} characters.`]" >
                <template v-slot:counter>
                    {{text?.length ?? 0}}/{{MAX_LENGTH}}
                </template>
                </q-input>
            </q-card-section>
            <q-card-actions class="row justify-between">
        <Button flat @click="emit('close')" color="white" text-color="slate">Close</Button>
                <Button color="mint" :disable="disabled" @click="submit">Submit</Button>
            </q-card-actions>

        </q-card>
    </q-dialog>
</template>
<script setup>
import {useNotificationStore} from '@/store/notification'
    const props = defineProps({
        modelValue: Boolean,
    })

    const open = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })

    const emit = defineEmits(['close', 'update:modelValue'])

    const text = ref(null)

    const textInput = ref(null);

    const MAX_LENGTH = 300;
    const disabled = computed(() => text.value?.length > 300);

    const notStore = useNotificationStore();

    const submit = async () => {
         const notId = notStore.addNotification({
            text: 'Submitting feedback...',
            state: 'pending'
        })
        const {user: userId} = useUser();
        const route = useRoute();
        const client = useSupabaseClient();
       const {errors} =  await client.from('feedback').insert({
            profile_id:  userId.value,
            text: text.value,
            page: route.fullPath
        })
        if (errors) {
             notStore.updateNotification(notId, {
                state: 'failed',
                text: `Error (ironically) submitting feedback: ${errors}`,
                timeout: 2000,
            })
              
        } else {
             notStore.updateNotification(notId, {
                state: 'completed',
                text: `Feedback submitted! Thank you!!`,
                timeout: 2000,
            })
            emit('close')
        }
      



    }

    watch(open, (val) => {
        if (!val) text.value = null;
    })

 
</script>