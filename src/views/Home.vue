<template>
  <b-container>
    <Scripts />
    <Drivers />
  </b-container>
</template>

<script>
// @ is an alias to /src
import Scripts from "@/components/Scripts.vue";
import Drivers from "@/components/Drivers.vue";

export default {
  name: "home",
  components: {
    Scripts,
    Drivers
  }
};
</script>
