<template>
  <b-row>
    <h1>Scripts</h1>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(script, index) in scripts" :key="index">
          <td>{{ script.name }}</td>
          <td>
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-warning btn-sm"
                v-on:click="runScript(script.run)"
              >
                Run
              </button>
              <b-button
                variant="danger"
                :v-b-modal="'modalDelete'.concat(script.name)"
              >
                Delete
              </b-button>
              <b-modal
                :id="'modalDelete'.concat(script.name)"
                @ok="deleteScript(script.url)"
              >
                Are you sure?
              </b-modal>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <input v-model="newScriptName" placeholder="Script name" />
          </td>
          <td>
            <button
              type="button"
              class="btn btn-warning btn-sm"
              v-on:click="addScript(newScriptName)"
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </b-row>
</template>

<script>
export default {
  data() {
    return {
      scripts: [],
      newScriptName: ""
    };
  },
  methods: {
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
    async addScript(name) {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/scripts"
          : "/scripts";
      const res = await fetch(path, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ name: name })
      });
      if (await res.ok) this.getScripts();
    },
    async deleteScript(path) {
      const res = await fetch(path, {
        method: "DELETE"
      });
      if (await res.ok) this.getScripts();
    }
  },
  created() {
    this.getScripts();
  }
};
</script>
