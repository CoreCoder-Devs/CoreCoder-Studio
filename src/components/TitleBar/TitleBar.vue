<!-- Script -->
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Label from "../Generic/Label.vue";
import TitleBarButton from "./TitleBarButton.vue";

@Options({
    components: {
        Label,
        TitleBarButton,
    },
})
export default class TitleBar extends Vue {}
</script>

<!-- Style -->
<style>
.titlebar {
    min-height: 32px;
    background-color: var(--color-titlebar);
    -webkit-app-region: drag;

    display: flex;
    flex-direction: row;
}

.titlebar > img {
    height: 24px;
    margin: 4px;
}
</style>

<!-- Template -->
<template>
    <div class="titlebar">
        <img src="icon-noBG.ico" />
        <Label style="line-height: 32px">CoreCoder:Studio</Label>
        <div style="flex: 1"></div>
        <TitleBarButton class="minimizebtn" action="minimize"></TitleBarButton>
        <TitleBarButton class="maximizebtn" action="maximize"></TitleBarButton>
        <TitleBarButton class="closebtn" action="close"></TitleBarButton>
        <slot></slot>
    </div>
</template>
