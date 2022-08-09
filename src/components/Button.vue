<template>
    <div class="button">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

type ButtonStyles = "default" | "main" | "warn" | "error";

@Options({
    props: {
        style: { type: String as () => ButtonStyles },
    },
})
export default class Button extends Vue {}
</script>

<style scoped>
.button {
    background-color: var(--color-button);
    color: var(--color-textcolor);
    padding: 8px;
    border-radius: 4px;
    margin: 6px 6px 6px 6px;
    user-select: none;
    transition: box-shadow .25s;
}

.button:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.669);
    cursor: pointer;
    background-color: var(--color-button-hover);
}
.button:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.669);
    cursor: pointer;
    background-color: var(--color-button-active);
}



.button.primary {
    background: var(--gradient-accent);
}

.button.primary:hover {
    background: var(--gradient-accent-lighter);
}
.button.primary:active {
    background: var(--gradient-accent-darker);
}
</style>
