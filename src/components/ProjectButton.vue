<!-- Template -->
<template>
    <div class="project-button">
        <img :src="$props.imageUrl" />
        <Label>{{ $props.name }}</Label>
    </div>
</template>

<!-- Script -->
<script lang="ts">
import { defineComponent } from "vue";
import Label from "./Generic/Label.vue";

export default defineComponent({
    // Insert your code here
    props: {
        name: String,
        imageUrl: String,
    },
    methods: {},
    components: { Label },
});
</script>

<!-- Styles -->
<style>
.project-button {
    min-width: 96px;
    min-height: 128px;
    max-width: 96px;
    max-height: 128px;
    margin: 8px;
    filter: none;
    background-color: var(--color-button);
    outline: 2px solid var(--color-button-hover);
    transition: filter 0.4s, outline 0.1s, box-shadow 0.25s, transform 0.2s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    -webkit-user-drag: none;
    user-select: none;
}
.project-button:hover {
    filter: brightness(125%);
    transform: scale(1.05);
    background-color: var(--color-button);
    box-shadow: 0 2px 12px black;
    outline: 2px solid var(--color-accent);
}
.project-button:active {
    transition: transform 0.1s;
    filter: brightness(75%);
    transform: scale(1.01);
    background-color: var(--color-button);
    box-shadow: 0 2px 4px black;
    outline: 2px solid var(--color-accent);
}

.project-button > img {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    user-select: none;
    -webkit-user-drag: none;
}
</style>
