<template>
  <b-list-group>
    <b-list-group-item v-for="(file, index) in fileList" :key="index"
      ><b-link @click="getFiles(file.url)">{{
        file.name
      }}</b-link></b-list-group-item
    >
    <b-list-group-item
      ><b-link @click="getFiles(lastFolder)">Back</b-link></b-list-group-item
    >
  </b-list-group>
</template>

<style scoped>
.list-group {
  max-height: 450px;
  margin-bottom: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

<script>
import Vue from "vue";

export default {
  props: {
    files: Array,
    path: {
      type: String,
      default: "http://localhost:5000/browser"
    }
  },
  data() {
    return {
      fileList: [],
      currentFolder: "/",
      lastFolder: "/"
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
    this.getFiles("http://localhost:5000/browser");
  }
};
</script>
