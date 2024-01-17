<template>
    <div class="welcome-container row justify-center items-center">

        <div class="welcome__content">
            <header class="full-width column items-center">
                <!-- <LogoFull :width="logoWidth" /> -->
                <h1 class="text-center md-text">Welcome!</h1>
                <h2>Let's get your profile all set up and ready to rumble.</h2>
            </header>
            <main class="checklist__container">
                <div class="instruction">
                    Click on one of the unchecked items:
                </div>
                <div class="checklist__item" @click="setAvatar">
                    <q-icon
                        :name="!avatar ? 'o_circle' : 'check_circle'"
                        :style="{ color: !avatar ? 'white' : getColor('mint') }"
                        size="2em"
                    />
                    <h3>Create a personal avatar</h3>
                </div>
                <div class="checklist__item" @click="setAvatar">
                     <q-icon
                        :name="!rink_id ? 'o_circle' : 'check_circle'"
                        :style="{ color: !rink_id ? 'white' : getColor('mint') }"
                        size="2em"
                    />
                    <h3>Choose a home rink</h3>
                </div>
                <div class="checklist__item">
                    <q-icon name="o_circle" color="white" size="2em" />
                    <h3>Join or create a team</h3>
                </div>
            </main>
            <footer class="welcome__footer row justify-center">
                <Button color="mint" @click="logout">Logout</Button>
            </footer>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.welcome-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: white;
    z-index: 1000;
    // @include bg-blue-side;
    color: white;
    .welcome__content {
        background-color: white;
        padding: var(--space-sm);
        border-radius: 16px;
        @include chunky-border(4px);
        position: relative;
    }
    h1 {
        color: $app-slate;
    }
    h2 {
        font-family: $font-family-secondary;
        color: $app-slate;
    }

    .checklist__container {
        background-color: rgba(0, 0, 0, 0.3);
        padding: var(--space-sm);
        border-radius: 16px;
        margin-top: var(--space-md);
        .checklist__item {
            display: flex;
            align-items: center;
            margin-bottom: var(--space-sm);
            h3 {
                margin-left: var(--space-sm);
            }
            cursor: pointer;
        }
        .instruction {
            margin-bottom: var(--space-sm);
            @include text-caption;
        }
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
const $q = useQuasar();

const logoWidth = computed(() => ($q.screen.xs ? "100px" : "200px"));

const { user: userId } = useUser();
const { getColor } = useColor();

const player = computed(() =>
    useRepo(Player).where("id", userId.value).first()
);

const avatar = computed(() => player.value?.avatar);
const rink_id = computed(() => player.value?.rink_id);

const {userTeamIds} = useTeam()

const setAvatar = () => {
    if (!!avatar.value) return;
    return navigateTo(`/player/${userId.value}?tab=settings`);
};

const { logout } = useSession();

onMounted(() => {
    if (!!avatar.value && !!rink_id.value && !!userTeamIds?.value?.length) return navigateTo('/')
})
</script>
