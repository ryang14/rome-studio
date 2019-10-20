<template>
  <b-row>
    <h1>Drivers</h1>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(driver, index) in drivers" :key="index">
          <td>{{ driver.name }}</td>
          <td>
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-warning btn-sm"
                v-on:click="selectDriver(driver.select)"
              >
                Select
              </button>
              <b-button
                variant="danger"
                :v-b-modal="'modalDelete'.concat(driver.name)"
              >
                Delete
              </b-button>
              <b-modal
                :id="'modalDelete'.concat(driver.name)"
                @ok="
                  deleteScript(script.url);
                  return true;
                "
              >
                Are you sure?
              </b-modal>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <input v-model="newDriverName" placeholder="Driver name" />
          </td>
          <td>
            <button
              type="button"
              class="btn btn-warning btn-sm"
              v-on:click="addDriver(newDriverName)"
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
      drivers: [],
      newDriverName: ""
    };
  },
  methods: {
    async getDrivers() {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/drivers"
          : "/api/drivers";
      const res = await fetch(path);
      this.drivers = await res.json();
    },
    async selectDriver(path) {
      await fetch(path);
    },
    async addDriver(name) {
      const path =
        process.env.NODE_ENV == "development"
          ? "http://localhost:5000/drivers"
          : "/api/drivers";
      const res = await fetch(path, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ name: name })
      });
      if (await res.ok) this.getDrivers();
    },
    async deleteDriver(path) {
      const res = await fetch(path, {
        method: "DELETE"
      });
      if (await res.ok) this.getDrivers();
    }
  },
  created() {
    this.getDrivers();
  }
};
</script>
