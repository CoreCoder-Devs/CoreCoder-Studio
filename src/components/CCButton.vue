<template>
    <div class="button" :class="[$props.type, { borderless: borderless }]">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Options, Vue } from "vue-class-component";

type ButtonTypes =
    | "primary"
    | "danger"
    | "warn"
    | "confirm"
    | "hollow"
    | "selected";

export default defineComponent({
    name: "CCButton",
    props: {
        type: { type: String as PropType<ButtonTypes> },
        borderless: { type: Boolean, default: false },
    },
})
</script>

<style scoped>
.button {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-tertiary);
    color: var(--foreground-primary);
    box-shadow: none;
    padding: 7px;
    border-radius: 4px;
    border: 1px solid var(--foreground-border);
    outline: none;
    display: inline-block;
    transition: filter 0.4s, border-color 0.4s, background-color 0.4s;
    text-decoration: none;
}

/* This will invert the button colours to highlight it. */
.button.selected {
    color: var(--background-primary);
    background-color: var(--foreground-primary);
}

.button.primary,
.button.danger,
.button.warn,
.button.confirm {
    border-color: transparent;
}

.button.primary {
    background-color: var(--blue);
}

.button.danger {
    background-color: var(--red);
}

.button.warn {
    background-color: var(--yellow);
}

.button.confirm {
    background-color: var(--green);
}

.button.hollow {
    background: none;
    border: 1px solid var(--foreground-border);
}

.button.borderless {
    border: none;
}

.button:hover {
    filter: brightness(130%);
    cursor: pointer;
}

.button.hollow:hover {
    border: 1px solid var(--foreground-primary);
}

.button.borderless:hover {
    border: none
}
.button[disabled], .button[disabled]:hover {
    filter: brightness(70%);
    border: none;
    cursor: default;
}
</style>
