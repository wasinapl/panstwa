<template>
  <v-container>
    <h2>Zgłoszenia</h2>
    <v-row style="margin-top: 50px;">
      <v-col cols="5">
        <v-row>
          <v-col class="el-names">Od</v-col>
          <v-col class="el-names">Dla</v-col>
        </v-row>
        <v-row>
          <v-col class="table">
            <v-row v-for="(report, i) in reports" :key="i">
              <v-col class="el" @click="go(report.from.id)">{{
                report.from.email
              }}</v-col>
              <v-col class="el" @click="go(report.to.id)">{{
                report.to.email
              }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      reports: [],
    };
  },
  methods: {
    go(id) {
      console.log(id);
      this.$router.push({ name: "user", params: { id } });
    },
  },
  async mounted() {
    try {
      const headers = this.$header();
      const response = await this.axios.get(this.$api + "/admin/getreports", {
        headers,
      });
      this.reports = response.data;
    } catch (error) {
      console.log("error", error);
    }
  },
};
</script>

<style>
.table {
  height: 400px;
  overflow-y: scroll;
}
.el-names {
  border: 2px solid #000;
}
.el {
  cursor: pointer;
}
.el:hover {
  background-color: gray;
}
</style>
