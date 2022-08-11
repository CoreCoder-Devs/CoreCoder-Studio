<!-- 
    Scaffold
    A base class for all screen for easy customization
    plan for future: supports menubar?
 -->
<!-- Template -->
<template>
    <div class="scaffold"><slot></slot></div>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // Insert your code here
    name: "Scaffold"
});
</script>

<!-- Styles -->
<style scoped>
.scaffold {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    position: absolute;
    top: 32px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
}
</style>
