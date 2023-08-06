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
                        class="q-px-lg q-px-sm-none text-primary"
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
                            class="q-mb-md"
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
                            class="q-mb-md"
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
                            class="q-mb-md"
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
                            class="q-mb-md"
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
                        />
                        <q-input
                            name="password verification"
                            label="Verify your password"
                            class="q-mt-md"
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
import { ref } from "vue";
import { VALIDATION_RULES } from "@/constants/validation";
import { useAuthStore } from "@/store/auth";
import { BannerColors } from "@/types/color";

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

const authStore = useAuthStore();

const validatePassword = (val) => {
    return val === password.value || "Passwords do not match";
};

const { setBanner } = useBanner();

const onSubmit = async (e) => {
    loading.value = true;
    const client = useSupabaseAuthClient();
    if (tab.value === TAB_NAMES.value.SIGN_IN) {
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        console.log('error logging in: ', error)
        if (!error) {
            authStore.setLoggedIn(true);
            reloadNuxtApp({
                path: '/gateway'
            })
        } else if (error && error.message) {
            setBanner(error.message, BannerColors.Negative);
        } else {
            setBanner(
                "Error logging in (Unknown error)",
                BannerColors.Negative
            );
        }
    } else if (tab.value === TAB_NAMES.value.SIGN_UP) {
        const { error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                emailRedirectTo: "http://localhost:3000/?newuser=true",
                data: {
                    username: username.value,
                    first_name: firstName.value,
                    last_name: lastName.value,
                },
            },
        });
        if (error?.message) {
            setBanner(error.message, BannerColors.Negative);
        } else if (!error) {
            setBanner(
                "Sign up successful. A verification email has been sent to your email address.",
                BannerColors.Primary
            );
            password.value = null;
            email.value = null;
            username.value = null;
            passwordCheck.value = null;
            firstName.value = null;
            lastName.value = null;
            tab.value = TAB_NAMES.SIGN_IN;
            loginForm.value.reset();
        }
    }
    loading.value = false;
};
</script>
