<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2">
        <FileBrowser :files="files" />
      </b-col>
      <b-col>
        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-button-group size="sm">
            <b-button>Save</b-button>
            <b-button @click="closeFile(tabIndex)">close</b-button>
          </b-button-group>
        </b-button-toolbar>

        <b-tabs v-model="tabIndex">
          <b-tab v-for="(file, index) in files" :key="index" :title="file.name">
            <editor
              v-model="file.contents"
              @init="editorInit"
              lang="python"
              height="400"
            ></editor>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FileBrowser from "@/components/FileBrowser.vue";

export default {
  name: "IDE",
  components: {
    editor: require("vue2-ace-editor"),
    FileBrowser
  },
  data() {
    return {
      tabIndex: 1,
      files: []
    };
  },
  methods: {
    editorInit() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/python"); //language
      require("brace/theme/chrome");
      require("brace/snippets/python"); //snippet
    },
    closeFile(index) {
      this.files = this.files.filter((val, i) => i != index);
    }
  }
};
</script>
