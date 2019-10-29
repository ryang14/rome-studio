<template>
  <b-container fluid>
    <b-row>
      <b-col col lg="2" md="3" sm="3" class="p-0">
        <FileBrowser
          :files="files"
          @pathChange="
            path => {
              browserPath = path;
            }
          "
        />
      </b-col>
      <b-col col lg="10" md="9" sm="9" class="p-0">
        <b-button-toolbar key-nav aria-label="Toolbar" class="m-2">
          <b-button-group size="sm">
            <b-button @click="saveFile(tabIndex)">Save</b-button>
            <b-button @click="closeFile(tabIndex)">Close</b-button>
            <b-button v-b-modal.modalDelete>Delete</b-button>
            <b-modal id="modalDelete" @ok="deleteFile(tabIndex)">
              Are you sure?
            </b-modal>
            <b-button @click="newFile(newFileName)">New file:</b-button>
          </b-button-group>

          <b-input-group size="sm">
            <b-form-input v-model="newFileName"></b-form-input>
          </b-input-group>

          <b-dropdown size="sm" text="Run Script" v-if="status.script==''">
            <b-dropdown-item
              v-for="(script, index) in scripts"
              :key="index"
              @click="runScript(script.run)"
              >{{ script.name }}</b-dropdown-item
            >
          </b-dropdown>

          <b-button @click="stopScript()" v-if="status.script!=''">Stop {{status.script}}</b-button>

          <b-dropdown size="sm" text="Select Driver">
            <b-dropdown-item
              v-for="(driver, index) in drivers"
              :key="index"
              @click="selectDriver(driver.select)"
              >{{ driver.name }}</b-dropdown-item
            >
          </b-dropdown>
        </b-button-toolbar>

        <b-tabs v-model="tabIndex" class="m-2">
          <b-tab v-for="(file, index) in files" :key="index" :title="file.name">
            <editor
              v-model="file.contents"
              @init="editorInit"
              lang="python"
              height="calc(100vh - 100px);"
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
      drivers: [],
      status: {},
      browserPath: "",
      newFileName: ""
    };
  },
  methods: {
    editorInit(editor) {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/python"); //language
      require("brace/theme/chrome");
      require("brace/snippets/python"); //snippet

      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
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
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/scripts"
          : "/scripts";
      const res = await fetch(path);
      this.scripts = await res.json();
    },
    async runScript(path) {
      await fetch(path);
    },
    async stopScript() {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/scripts/stop"
          : "/scripts/stop";
      await fetch(path);
    },
    async getDrivers() {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/drivers"
          : "/drivers";
      const res = await fetch(path);
      this.drivers = await res.json();
    },
    async selectDriver(path) {
      await fetch(path);
    },
    async getStatus() {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/status"
          : "/status";
      const res = await fetch(path);
      this.status = await res.json();
    }
  },
  created() {
    this.getScripts();
    this.getDrivers();
    setInterval(this.getStatus, 100);
  }
};
</script>
