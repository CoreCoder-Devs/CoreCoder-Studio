<script lang="ts">
import Button from "@/components/Button.vue";
import { Options, Vue } from "vue-class-component";
import Label from "../components/Label.vue";

@Options({
  props: {
  },
  components: {
    Button,
    Label
  }
})

export default class ComponentTest extends Vue {}
</script>

<template>
  <Label>Label</Label>
  <Button>Hello</Button>
  <Button>Hello</Button>
</template>
