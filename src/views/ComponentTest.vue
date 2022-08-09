<script lang="ts">
import CCButton from "@/components/CCButton.vue";
import { Options, Vue } from "vue-class-component";
import Label from "../components/Label.vue";

@Options({
    props: {},
    components: {
        CCButton,
        Label,
    },
})
export default class ComponentTest extends Vue {}
</script>

<template>
    <Label>Label</Label>
    <CCButton>CCButton</CCButton>
    <CCButton :borderless="true">Borderless CCButton</CCButton>
    <CCButton type="qerqew">Hollow CCButton</CCButton>
    <CCButton type="hollow" :borderless="true">
        Hollow and Borderless
    </CCButton>

    <CCButton type="confirm">Green CCButton</CCButton>
</template>
