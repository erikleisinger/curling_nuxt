<template>
    <NuxtLayout name="login">
        <q-form class="login__form" @submit="onSubmit" ref="loginForm">
            <q-tabs
                v-model="tab"
                class="login-tabs"
                v-if="!showForgotPasswordMenu"
            >
                <q-tab label="Sign in" :name="TAB_NAMES.SIGN_IN" />
                <q-tab label="Sign up" :name="TAB_NAMES.SIGN_UP" />
            </q-tabs>
            <q-card-section
                class=" login-input__container"
                v-if="!showForgotPasswordMenu"
            >
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
                    filled
                    outlined
                    standout
                    dark
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
                    filled
                    outlined
                    standout
                    dark
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
                    filled
                    outlined
                    standout
                    dark
                />
                <q-input
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="[VALIDATION_RULES.REQUIRED]"
                    lazy-rules
                    standout
                    filled
                    outlined
                    dark
                />
                <q-input
                v-if="tab === TAB_NAMES.SIGN_IN"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="[
                        VALIDATION_RULES.REQUIRED,
                        VALIDATION_RULES.MIN_LENGTH(6),
                    ]"
                    lazy-rules
                    standout
                    :error="isError"
                    :error-message="errorMessage"
                    @update:modelValue="
                        () => {
                            isError = false;
                            errorMessage = null;
                        }
                    "
                    dark
                    filled
                />
                <LoginSetPassword v-else v-model="password"/>
                <!-- <q-input
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
                    standout
                    outlined
                    v-if="tab === TAB_NAMES.SIGN_UP"
                    dark
                    filled
                /> -->
            </q-card-section>
            <LoginPasswordRecovery
                v-else
                @close="showForgotPasswordMenu = false"
            />
            <q-card-actions
                v-if="!showForgotPasswordMenu"
                class="row justify-center q-pb-lg q-px-lg"
                style="padding-top: 0"
            >
                <Button
                    type="submit"
                    :disabled="loading"
                    style="padding: 0px 32px; min-width: 125px"
                    color="mint"
                    :loading="loading"
                    >Submit</Button
                >
            </q-card-actions>
            <div
                class="full-width row justify-center text-caption text-underline q-pb-sm clickable"
                style="
                    margin-top: calc(-1 * var(--space-md));
                    color: rgba(255, 255, 255, 0.6);
                "
                v-if="tab === TAB_NAMES.SIGN_IN && !showForgotPasswordMenu"
                @click="showForgotPasswordMenu = true"
            >
                Forgot password
            </div>
        </q-form>
    </NuxtLayout>
    <!-- <div
        class="full-width full-height row justify-center items-center login--container"
    >
        <div
            class="column items-center full-height q-pb-md q-pt-lg"
            :class="$q.screen.xs ? 'justify-center' : 'justify-end'"
        >
            <LogoFull width="125" />
        </div>
      

      
    </div> -->
</template>

<style lang="scss">
.login-tabs {
    //  background-color: $app-mint;

    font-family: $font-family-header;
    background-color: transparent;
    color: white;

    .q-tab--active {
        // background-color: white;
        color: white;
    }
    .q-tab__label {
        @include reg-text;
    }
    .q-tab__indicator {
        background-color: white;
    }
}
.login-input__container {
    padding-top: var(--space-lg);
    padding-bottom: var(--space-lg);
    
}
.login--container {
    display: grid;

    grid-auto-rows: 1fr;

    position: fixed;
    top: 0;
    left: 0;
    overflow: auto;

    @include bg-blue-side;
}
.login-card {
    border-radius: 16px;
    box-shadow: unset;
    background: rgba(0, 0, 0, 0.1);

    color: white;
}

@media all and (max-width: 600px) {
    .login__form {
        .q-card {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
<script setup>
import { ref } from "vue";
import { VALIDATION_RULES } from "@/presentation/constants/validation";
import { useAuthStore } from "@/store/auth";
import { useNotificationStore } from "@/store/notification";

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
const signUpSuccess = ref(false);

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
            return navigateTo("/gateway");
        } else if (error && error.message) {
            isError.value = true;
            errorMessage.value = error.message;
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
            text: "Sign up successful! Please check your email to verify your account. Follow the link provided and your account will be good to go.",
            state: "completed",
            timeout: 0,
        });
    }
    loading.value = false;
};
const showForgotPasswordMenu = ref(false);
</script>
