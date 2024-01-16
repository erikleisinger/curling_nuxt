<template>
    <div
        class="full-width full-height row justify-center items-center login--container"
    >
        <div
            class="column  items-center full-height q-pb-md q-pt-lg"
            :class="$q.screen.xs ? 'justify-center' : 'justify-end'"
        >
            <LogoFull width="125" />
        </div>
        <q-form class="login__form q-pa-md" @submit="onSubmit" ref="loginForm">
            <q-card :flat="$q.screen.lt.sm" class="login-card" >
                <q-tabs v-model="tab" class=" login-tabs">
                    <q-tab label="Sign in" :name="TAB_NAMES.SIGN_IN" />
                    <q-tab label="Sign up" :name="TAB_NAMES.SIGN_UP" />
                </q-tabs>
                <q-card-section class="q-px-lg login-input__container">
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
                         standout
                        outlined
                        v-if="tab === TAB_NAMES.SIGN_UP"
                        dark
                        filled
                    />
                </q-card-section>
                <q-card-actions
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
            </q-card>
        </q-form>
        <div />
    </div>
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
    .q-field {
        &:not(:first-child) {
margin-top: var(--space-md)
        }
        
    }
}
.login--container {
    display: grid;
   

   grid-auto-rows: 1fr;

 
    position: fixed;
    top: 0;
    left: 0;

    @include bg-blue-side;
}
.login-card {
    border-radius: 16px;
    box-shadow: unset;
    background: rgba(0,0,0,0.1);
   
    color: white;
}
.login__form {
    width: min(400px, 100vw);
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
import { VALIDATION_RULES } from "@/constants/validation";
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
</script>
