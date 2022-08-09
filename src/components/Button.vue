
<template>
    <div class="button">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

type ButtonStyles = 'default' | 'main' | 'warn' | 'error'

@Options({
  props: {
    style: { type: String as () => ButtonStyles }
  }
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
}

.button:hover {
    box-shadow: 0 4px 4px black;
    cursor: pointer;
    background-color: var(--color-accent);
}
.button:active {
    box-shadow: 0 2px 4px black;
    cursor: pointer;
    background-color: var(--color-button);
}

</style>