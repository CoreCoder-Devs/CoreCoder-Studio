<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { Options, Vue } from "vue-class-component";
import Label from "../components/Label.vue";
import ProjectButton from "@/components/ProjectButton.vue";
import Scaffold from "@/components/Scaffold.vue";

@Options({
    props: {},
    components: {
        BaseButton,
        Label,
        ProjectButton,
        Scaffold
    },
})
export default class ComponentTest extends Vue { }
</script>

<template>
    <Scaffold>
        <Label>Label</Label>
        <BaseButton>BaseButton</BaseButton>
        <BaseButton type="primary">BaseButton Primary</BaseButton>
        <BaseButton :borderless="true">Borderless BaseButton</BaseButton>
        <BaseButton type="qerqew">Hollow BaseButton</BaseButton>
        <BaseButton type="hollow" :borderless="true">
            Hollow and Borderless
        </BaseButton>

        <BaseButton type="confirm">Green BaseButton</BaseButton>

        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
        <ProjectButton name="my project" imageUrl="https://media.discordapp.net/attachments/1005310973348941935/1006536297730551838/Kingerious_javascript_e5e41011-9a53-4a5d-805e-101a296b2cfe.png"></ProjectButton>
    </Scaffold>
</template>
