<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft{
  float: left;
}

.floatRight{
  float: right;
}

.noBullet{
  list-style-type:none;
}

.title {
  color: grey;
  font-size: 18px;
}


</style>
<template>
   <div class="home">
     <h2>Welcome, {{user.name}} !</h2>
     <Metrics/>
     <org-sidebar/>
   </div>
</template>


<script>
import Dashboard from '@/components/Dashboard.vue'
import Metrics from '@/components/Metrics.vue'
import OrgSidebar from './OrgSidebar.vue';
import EventBus from '../eventbus'
export default {
  name: "PanelPage",
  components: { 
    Dashboard,
    Metrics,
    OrgSidebar,
  },
  data() {
    return {
      appList: [],
      user: {},
      appName: "",
      authToken: localStorage.getItem('authToken')
    };
  },
  created() {
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
    this.$store.commit('updateSideNavStatus',false)
    this.$store.commit('selectAnOrg', '')
    localStorage.removeItem('selectedOrg')
    EventBus.$emit('closeSideNav')
  },
  methods: {
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
      
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push('/login')
                }
    },
  },
};
</script>
