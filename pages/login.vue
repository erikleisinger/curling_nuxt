<template>
<div class="fullscreen row justify-center items-center">
    <q-form class="login__form" @submit="onSubmit">
        <q-card>
            <q-tabs v-model="tab">
                <q-tab label="Sign in" name="signin"/>
                <q-tab label="Sign up" name="signup"/>
            </q-tabs>
        <q-card-section>
        <q-input name="email" label="Email" type="email" v-model="email" :rules="[VALIDATION_RULES.REQUIRED]"/>
        <q-input name="password" label="Password" type="password" v-model="password" :rules="[VALIDATION_RULES.REQUIRED]"/>
        </q-card-section>
        <q-card-actions class="row justify-center q-mb-lg">
            <q-btn label="Submit" color="primary" type="submit" :disabled="loading" :loading="loading" style="width:100%" unelevated rounded/>
        </q-card-actions>
        </q-card>
    </q-form>
    </div>
</template>
<style lang="scss">
.login__form {
            width: 400px;
        }
    @media all and (max-width: 600px) {
        .login__form {
            width: 100vw;
            height: 100vh;
            .q-card {
                height: inherit;
                display: flex;
                flex-direction: column;
                .q-card__section {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
            }
        }
    }
</style>
<script setup>
    import { ref } from 'vue'
    import { VALIDATION_RULES } from '@/constants/validation'
    const email = ref(null);
    const password = ref(null);
     const loading = ref(false)
     const tab = ref('signin')
    

    const onSubmit = async (e) => {
        loading.value = true;
        const client = useSupabaseAuthClient();
        const formData = [...new FormData(e.target).entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})
        if (tab.value === 'signin') {
   const {data, error} = await client.auth.signInWithPassword(formData)
        if (!error) navigateTo('/')
        } else  if (tab.value === 'signup') {
             const {data, error} = await client.auth.signUp(formData)
        console.log(data, error)
        }
     
        loading.value = false;
        
    }
</script>