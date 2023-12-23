<template>
<div class="schedule-widget__outer">
    <div class="schedule-widget__container">
        <ScheduleCalendar/>
    </div>
</div>
</template>
<style lang="scss" scoped>
.schedule-widget__outer {
    .tabs-container {
        background-color: white;
        padding: var(--space-xs);
        box-shadow: $pretty-shadow;
        margin-right: var(--space-xs);
    }
    .schedule-widget__container {
  box-shadow: $pretty-shadow;
  border-radius: 16px;
  overflow: hidden;
    }
}

</style>