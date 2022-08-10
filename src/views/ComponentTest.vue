<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { Options, Vue } from "vue-class-component";
import Label from "../components/Label.vue";

@Options({
    props: {},
    components: {
        BaseButton,
        Label,
    },
})
export default class ComponentTest extends Vue {}
</script>

<template>
    <Label>Label</Label>
    <BaseButton>BaseButton</BaseButton>
    <BaseButton type="primary">BaseButton Primary</BaseButton>
    <BaseButton :borderless="true">Borderless BaseButton</BaseButton>
    <BaseButton type="qerqew">Hollow BaseButton</BaseButton>
    <BaseButton type="hollow" :borderless="true">
        Hollow and Borderless
    </BaseButton>

    <BaseButton type="confirm">Green BaseButton</BaseButton>
</template>
