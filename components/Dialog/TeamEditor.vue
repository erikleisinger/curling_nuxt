<template>
    <DialogFloating @close="close">
        <div class="row">
        <div>Lead</div><TableTeamPlayer :parsedAvatar="{}" :player="{}" position="lead" />
        </div>
    </DialogFloating>
</template>
<script setup lang="ts"></script>
