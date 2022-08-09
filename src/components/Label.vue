<template>
    <div class="label">
        <slot></slot>
    </div>
</template>

<script>
import { Vue } from "vue-class-component";

export default class Label extends Vue{

}
</script>

<style>
.label{
    user-select: none;
    color: var(--color-textcolor);
}
</style>