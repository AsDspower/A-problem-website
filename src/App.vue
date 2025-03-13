<template>

  <div>
    <router-view>

    </router-view>
    <!-- <main-view></main-view> -->
  </div>
  <!-- <div>
    <login-view></login-view>
  </div> -->
</template>



<script>




// import LoginView from './views/Components/LoginView.vue';


export default{
  components : {},
  data(){
    const item = {
      date : '2015-05-02',
      name : 'nothing',
      address : 'address'
    };
    return {
      tableData: Array(20).fill(item)
    }
  },
  methods : {

  }
}


</script>




<style>


</style>