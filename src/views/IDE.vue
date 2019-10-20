<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2">
        <FileBrowser
          :files="files"
          @pathChange="
            path => {
              browserPath = path;
            }
          "
        />
      </b-col>
      <b-col>
        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
          <b-button-group size="sm">
            <b-button @click="saveFile(tabIndex)">Save</b-button>
            <b-button @click="closeFile(tabIndex)">close</b-button>
            <b-button @click="deleteFile(tabIndex)">Delete</b-button>
          </b-button-group>

          <b-input-group size="sm">
            <b-form-input v-model="newFileName"></b-form-input>
          </b-input-group>
          <b-button-group size="sm">
            <b-button @click="newFile(newFileName)">New</b-button>
          </b-button-group>

          <b-dropdown size="sm" text="Run Script">
            <b-dropdown-item
              v-for="(script, index) in scripts"
              :key="index"
              @click="runScript(script.run)"
              >{{ script.name }}</b-dropdown-item
            >
          </b-dropdown>
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
      files: [],
      scripts: [],
      browserPath: "",
      newFileName: ""
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
    },
    async saveFile(index) {
      await fetch(this.files[index].url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(this.files[index])
      });
    },
    async deleteFile(index) {
      await fetch(this.files[index].url, {
        method: "DELETE"
      });
      this.closeFile(index);
    },
    async newFile(name) {
      console.log(this.browserPath);
      await fetch(this.browserPath + "/" + name, {
        method: "POST"
      });
    },
    async getScripts() {
      const path = "http://localhost:5000/scripts";
      const res = await fetch(path);
      this.scripts = await res.json();
    },
    async runScript(path) {
      await fetch(path);
    }
  },
  created() {
    this.getScripts();
  }
};
</script>
