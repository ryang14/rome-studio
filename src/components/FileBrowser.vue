<template>
  <b-list-group class="m-2">
    <b-list-group-item
      v-for="(file, index) in fileList"
      :key="index"
      class="p-2"
      ><b-link @click="getFiles(file.url)">{{
        file.name
      }}</b-link></b-list-group-item
    >
    <b-list-group-item v-if="lastFolder != ''"
      ><b-link @click="getFiles(lastFolder)">Back</b-link></b-list-group-item
    >
  </b-list-group>
</template>

<style scoped>
.list-group {
  max-height: 95vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

<script>
import Vue from "vue";

export default {
  name: "FileBrowser",
  props: {
    files: Array,
    path: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fileList: [],
      currentFolder: "/",
      lastFolder: ""
    };
  },
  methods: {
    async getFiles(path) {
      const res = await fetch(path);
      const jsonRes = await res.json();
      if (jsonRes["url"]) this.$emit("pathChange", jsonRes["url"]);
      if (jsonRes.type == "folder") {
        this.fileList = jsonRes.contents;
        if (jsonRes["url"]) {
          this.lastFolder = jsonRes.url
            .split("/")
            .slice(0, -1)
            .join("/");
        } else {
          this.lastFolder = "";
        }
      } else if (jsonRes.type == "file") {
        Vue.set(this.files, this.files.length, {
          name: path.split("/").slice(-1)[0],
          url: path,
          contents: jsonRes.contents
        });
      }
    }
  },
  created() {
    const path =
      process.env.NODE_ENV == "development"
        ? "http://localhost:5000/browser"
        : "/browser";
    this.getFiles(path);
  }
};
</script>
