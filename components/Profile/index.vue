<template>
    <div class="profile__container items-center">
        <header class="q-pa-lg column justify-center items-center ">
           <div class="profile-picture row justify-center items-center">
                <q-icon name="person" size="md" color="grey"/>
            </div>
            <h1 class="q-mt-xs text-black">My Profile</h1>
            <h2>#{{username}}</h2>
       <!-- <q-chip icon="content_copy">Friend ID</q-chip> -->
        </header>
        <main class="main-content__wrap">
          <section name="profile information" class="profile__section">
            <label for="memberSince">Member since</label>
            <div id="memberSince" class="q-mb-sm"> {{toTimezone(created_at)}}</div>
              <label for="timezone">Timezone</label>
            <div id="timezone" class="q-mb-sm"> {{timezone}}</div>
          </section>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.profile__container {
    display: grid;
    grid-template-rows: 40vh 1fr;
    grid-template-columns: 1fr;
    //   background-color: rgba(49, 169, 216, 0.8);
    // // color: rgb(49, 169, 216);
    // color: rgba(49, 169, 216, 1);
    background-color:rgba(246, 247, 252, 0.1);
    color:rgba(246, 247, 252, 1);
    height: calc(100vh - 50px);
    overflow:scroll;
    header {
        position: relative;
        z-index: 1;
    
        .profile-picture {
            height: 100px;
            width: 100px;
            border: 1px solid #ddd;
    border-radius: 50%;
    background: #eee;
        }
        h2 {
            color: rgba(0,0,0,0.7)
        }
    }
    .main-content__wrap {
        background-color:white;
        min-height: calc(60vh - 50px);
       box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        margin: 0px 8px 0px 8px;
       
        .profile__section {
            padding: 32px;
             color: black;
             label {
                font-weight: bold;
             }
        }
    }
}
</style>
<script setup>
const client = useSupabaseAuthClient();
const { data } = await client.rpc("get_profile");
const {username, created_at, timezone} = data;
const {toTimezone} = useTime();
</script>
