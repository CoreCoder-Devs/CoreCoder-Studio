<!-- Template -->
<template>
    <div>EditorView</div>
    <BaseButton @click="goHome">Back</BaseButton>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import BaseButton from "@/components/Generic/BaseButton.vue";

export default defineComponent({
    components: { BaseButton },
    methods:{
        goHome(){
            this.$router.push("/");
        }
    }
});
</script>

<!-- Styles -->
<style scoped>
</style>