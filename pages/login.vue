<template>
  <div class="window-height window-width row justify-center items-center">
    <q-form class="login__form q-pa-lg" @submit="onSubmit" ref="loginForm">
      <q-card :flat="$q.screen.lt.sm" >
        <q-tabs v-model="tab" class="q-px-lg q-px-sm-none text-primary" >
          <q-tab label="Sign in" :name="TAB_NAMES.SIGN_IN" />
          <q-tab label="Sign up" :name="TAB_NAMES.SIGN_UP" />
        </q-tabs>
        <q-card-section class="q-px-lg">
          <q-input
            name="email"
            label="Email"
            type="email"
            v-model="email"
            :rules="[VALIDATION_RULES.REQUIRED]"
            lazy-rules
          />
          <q-input
            name="password"
            label="Password"
            type="password"
            v-model="password"
            :rules="[VALIDATION_RULES.REQUIRED, VALIDATION_RULES.MIN_LENGTH(6)]"
            lazy-rules
          />
        </q-card-section>
        <q-card-actions class="row justify-center q-mb-lg  q-pb-lg q-px-lg">
          <q-btn
            label="Submit"
            color="primary"
            type="submit"
            :disabled="loading"
            :loading="loading"
            style="width: 100%"
            unelevated
            rounded
          />
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
    .q-card {
      height: inherit;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
<script setup>
import {ref} from "vue";
import {VALIDATION_RULES} from "@/constants/validation";
import {useAuthStore} from '@/store/auth'

const TAB_NAMES = ref({
  SIGN_IN: 'signin',
  SIGN_UP: 'signup'
})

const $q = useQuasar()

const email = ref(null);
const password = ref(null);
const loading = ref(false);
const tab = ref(TAB_NAMES.value.SIGN_IN);
const loginForm = ref(null)

const authStore = useAuthStore();



const {setBanner} = useBanner();

const onSubmit = async (e) => {
  loading.value = true;
  const client = useSupabaseAuthClient();
  const formData = [...new FormData(e.target).entries()].reduce(
    (all, [key, value]) => {
      return {...all, [key]: value};
    },
    {}
  );
  if (tab.value === TAB_NAMES.value.SIGN_IN) {
    const {error} = await client.auth.signInWithPassword(formData);
    if (!error) {
      authStore.setLoggedIn(true)
    } else if(error?.message) {
      setBanner(error.message)
    } else {
      console.log('error logging in: ', error)
    }
  } else if (tab.value === TAB_NAMES.value.SIGN_UP) {
    const {error} = await client.auth.signUp(formData);
    if (error?.message) {
        setBanner(error.message)
    }
    else if (!error) {
      
      setBanner("Sign up successful. A verification email has been sent to your email address.");
      password.value = null;
      email.value = null;
      loginForm.value.reset();
    }
  }
  loading.value = false;
};
</script>
