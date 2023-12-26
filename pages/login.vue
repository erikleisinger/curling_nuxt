<template>
        <div class="window-height window-width row justify-center items-center">
            <q-form
                class="login__form q-pa-lg"
                @submit="onSubmit"
                ref="loginForm"
            >
                <q-card :flat="$q.screen.lt.sm">
                    <q-tabs
                        v-model="tab"
                                   active-bg-color="white"
            active-color="deep-purple"
            color="deep-purple"
                        class="q-px-lg q-px-sm-none text-deep-purple"
                    >
                        <q-tab label="Sign in" :name="TAB_NAMES.SIGN_IN" />
                        <q-tab label="Sign up" :name="TAB_NAMES.SIGN_UP" />
                    </q-tabs>
                    <q-card-section class="q-px-lg">
                        <q-input
                            name="first name"
                            label="First name"
                            v-model.trim="firstName"
                            :rules="[
                                VALIDATION_RULES.REQUIRED,
                                VALIDATION_RULES.MIN_LENGTH(2),
                                VALIDATION_RULES.MAX_LENGTH(25),
                                VALIDATION_RULES.ALPHA_ONLY,
                            ]"
                            lazy-rules
                            v-if="tab === TAB_NAMES.SIGN_UP"
                            rounded
                            outlined
                        />
                        <q-input
                            name="last name"
                            label="Last name"
                            v-model.trim="lastName"
                            :rules="[
                                VALIDATION_RULES.REQUIRED,
                                VALIDATION_RULES.MIN_LENGTH(2),
                                VALIDATION_RULES.MAX_LENGTH(25),
                                VALIDATION_RULES.ALPHA_ONLY,
                            ]"
                            lazy-rules
                            v-if="tab === TAB_NAMES.SIGN_UP"
                            rounded
                            outlined

                        />
                        <q-input
                            name="username"
                            label="Username"
                            v-model.trim="username"
                            :rules="[
                                VALIDATION_RULES.REQUIRED,
                                VALIDATION_RULES.MIN_LENGTH(6),
                                VALIDATION_RULES.MAX_LENGTH(16),
                                VALIDATION_RULES.NO_SPECIAL,
                            ]"
                            lazy-rules
                            v-if="tab === TAB_NAMES.SIGN_UP"
                            rounded
                            outlined
                        />
                        <q-input
                            name="email"
                            label="Email"
                            type="email"
                            v-model="email"
                            :rules="[VALIDATION_RULES.REQUIRED]"
                            lazy-rules
                            rounded
                            outlined
                        />
                        <q-input
                            name="password"
                            label="Password"
                            type="password"
                            v-model="password"
                            :rules="[
                                VALIDATION_RULES.REQUIRED,
                                VALIDATION_RULES.MIN_LENGTH(6),
                            ]"
                            lazy-rules
                            rounded
                            outlined
                            :error="isError"
                            :error-message="errorMessage"
                            @update:modelValue="() => {
                                isError = false;
                                errorMessage = null
                            }"
                        />
                        <q-input
                            name="password verification"
                            label="Verify your password"
                            type="password"
                            v-model="passwordCheck"
                            :rules="[
                                VALIDATION_RULES.REQUIRED,
                                VALIDATION_RULES.MIN_LENGTH(6),
                                validatePassword,
                            ]"
                            lazy-rules
                            rounded
                            outlined
                            v-if="tab === TAB_NAMES.SIGN_UP"
                        />
                    </q-card-section>
                    <q-card-actions
                        class="row justify-center q-mb-lg q-pb-lg q-px-lg"
                    >
                        <q-btn
                            label="Submit"
                            color="deep-purple"
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
import { ref } from "vue";
import { VALIDATION_RULES } from "@/constants/validation";
import { useAuthStore } from "@/store/auth";
import {useNotificationStore} from '@/store/notification'

const TAB_NAMES = ref({
    SIGN_IN: "signin",
    SIGN_UP: "signup",
});

const $q = useQuasar();

const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const password = ref(null);
const passwordCheck = ref(null);
const username = ref(null);
const loading = ref(false);
const tab = ref(TAB_NAMES.value.SIGN_IN);
const loginForm = ref(null);
const isError = ref(false);
const errorMessage = ref(null);
const signUpSuccess = ref(false)

const authStore = useAuthStore();

const validatePassword = (val) => {
    return val === password.value || "Passwords do not match";
};

const onSubmit = async (e) => {
    loading.value = true;
    const client = useSupabaseClient();
    if (tab.value === TAB_NAMES.value.SIGN_IN) {
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (!error) {
            authStore.setLoggedIn(true);
            navigateTo('/gateway')
        } else if (error && error.message) {
            isError.value = true;
            errorMessage.value = error.message
        } else {
           
        }
    } else if (tab.value === TAB_NAMES.value.SIGN_UP) {
        const { error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                emailRedirectTo: "https://erikleisinger.com/?newuser=true",
                data: {
                    username: username.value,
                    first_name: firstName.value,
                    last_name: lastName.value,
                },
            },
        });
        if (error) return;
        tab.value = TAB_NAMES.SIGN_IN;
        const notStore = useNotificationStore();
         notStore.addNotification({
            text: 'Sign up successful! Please check your email to verify your account. Follow the link provided and your account will be good to go.',
            state: 'completed',
            timeout: 0
        })

    }
    loading.value = false;
};
</script>
