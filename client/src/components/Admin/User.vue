<template>
  <div>elo</div>
</template>

<script>
export default {
 data(){
     return{

     }
 },
 async mounted(){
     try {
        const headers = this.$header();
        const response = await this.axios.post(
          this.$api + "/admin/userinfo",
          {
            id: this.$route.params.id,
          },
          {
            headers,
          }
        );
        console.log(response.data)
      } catch (error) {
        console.log("error", error);
      }
 }
}
</script>

<style></style>
