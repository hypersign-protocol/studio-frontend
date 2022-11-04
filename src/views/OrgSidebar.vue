<template>
  <div class="">
    <div class="" style="display:flex">
      <h3 v-if="orgList.length > 0" class="mt-4" style="text-align: left;">
      <i class="fa fa-university mr-2"></i>Organizations</h3>
      <h4 v-else class="mt-4" style="text-align: left;">Create your first organization!</h4>

      <hf-buttons 
      name="+ Create"
      style="text-align: right;"
      class="ml-auto mt-4"
      @executeAction="openSlider()"
      ></hf-buttons>
    </div>
    <StudioSideBar :title="edit? 'Edit Organization' : 'Add Organization'">
      <div class="container">

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Organization DID"></tool-tip>
          <label for="orgDid"><strong>Org DID<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="orgStore.orgDid" aria-describedby="orgNameHelp"
            disabled>
          <small id="orgNameHelp" class="form-text text-muted">
            <a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.DID_RESOLVE_EP}${orgStore.orgDid}:`"
              target="_blank">Resolve DID</a>
          </small>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Your Organization Name"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>          
          <input type="text" class="form-control" id="orgName" v-model="orgStore.name" aria-describedby="orgNameHelp"
            placeholder="Enter your org name">
          <!-- <small id="orgNameHelp" class="form-text text-muted">Some help text</small> -->
        </div>
        <div class="form-group">
          <tool-tip infoMessage="Your Organization Domain Name"></tool-tip>
          <label for="domain"><strong>Domain<span style="color: red">*</span>:</strong></label>        
          <input type="text" class="form-control" id="domain" v-model="orgStore.domain" aria-describedby="domainHelp"
            placeholder="Enter your domain name">
        </div>
        <!-- <div class="form-group">
          <label for="logo"><strong>Logo URL:</strong></label>
          <input type="text" class="form-control" id="logo" v-model="orgStore.logo" aria-describedby="logoHelp"
            placeholder="Enter logo URL">
        </div> -->
        <!-- <div class="form-group">
          <label for="region"><strong>Region:</strong></label>
          <input type="text" class="form-control" id="region" v-model="orgStore.region" aria-describedby="regionHelp"
            placeholder="Select your region">
        </div> -->
        <!-- <div class="form-group">
                      <label for="region"><strong>Network:</strong></label>
                      <input type="text" class="form-control" id="region" v-model="orgStore.network" aria-describedby="regionHelp" placeholder="Select your region">
                  </div> -->
        <div class="form-group" v-if="edit">
         <hf-buttons name="Update" class="btn btn-primary" @executeAction="createAnOrg()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnOrg()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>
    <div class="row scroll" v-if="orgList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in orgList" :key="eachOrg._id">

        <b-card :title="truncate(eachOrg.name,20)" tag="article" style="max-width: 30rem; margin-top: 10px; height:13rem"
          class="mb-2 eventCard" img-top>
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">            
            <img style="float:right;" :src="`${getProfileIcon(eachOrg.name)}`" class="mr-2" alt="center" width="70px"/>            
            <li v-if="eachOrg.status ==='Registered'">
              <i class="fa fa-user mr-2"></i>
              <span class="card-title"><a target="_blank" :href="`${$config.explorer.BASE_URL}identity/${eachOrg.orgDid}`">{{ truncate(eachOrg.orgDid,45) }}</a></span>
              <span v-if="eachOrg.status === 'Registered'" @click="copyToClip(eachOrg.orgDid,'Org DID')"
              ><i class="far fa-copy"></i></span>
            </li>
            <div v-if="eachOrg.status ==='Registered'">
            <li>
              <span class="card-title"><i class="fa fa-id-card mr-2"></i>Credentials: {{(eachOrg.credentialsCount)}}</span>
            </li>
            <li>
              <span class="card-title"><i class="fa fa-table mr-2"></i>Schemas: {{eachOrg.schemasCount}}</span>
            </li>
            <li>
              <span class="card-title"><i class="fa fa-desktop mr-2"></i>Templates: {{eachOrg.templatesCount}}</span>
            </li>
            </div>
          </ul>
          <footer>
            <div class="form-group row" style="margin-bottom: 0rem;">
              <div class="col-sm-10">
              <ul style="list-style-type: none;padding-left: 0px;">
              <li v-if="eachOrg.status === 'Failed'">
              <span class="card-title" >
                <img :src="images.redcross" height="25" width="25" /> Failed
              </span>
            </li>
            <li v-else-if="eachOrg.status === 'Registered'">
              <span class="card-title" >
                <img :src="images.greentick" height="21" width="21"/> Registered
              </span>
            </li>
            <li v-else>
              <span class="card-title" >
                <img :src="images.loader"  height="25" width="25"/> Processing ..... 
              </span>
            </li>
            </ul>
            </div>
                <div class="pl-2" v-if="eachOrg.status === 'Registered'">            
                <i class="fas fa-pencil-alt"
                @click="editOrg(eachOrg._id)" title="Click to edit this event" style="cursor: pointer"
                ></i>
                <span class="ml-3"></span>
                <i class="fas fa-sync" aria-hidden="true"
                @click="switchOrg(eachOrg._id)" title="Click to switch to org" style="cursor: pointer"
                ></i>
                </div>
            </div> 
          </footer>
        </b-card>
      </div>
    </div>
  </div>
</template>
  <style scoped>
  .far{
cursor: pointer;
color: grey;
display: inline;
padding-left: 5px;
}
  
  .container {
    padding: 20px;
    text-align: left;
  }
  
  .eventCard {
    border-left: 10px solid var(--ds-background-accent-red-subtler, rgba(241, 179, 25, 0.24));
  }
  
  .eventCard:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
    cursor: pointer;
  }
  
  .card {}
  
  .card-body {
    -ms-flex: 1 1 auto;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
  
  }
  .scroll{
    padding-top: 1em;
    overflow: auto;
    height:490px;
  }
  </style>

  <script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from '../mixins/utils';
import {isEmpty, isValidURL} from '../mixins/fieldValidation'
import 'vue-loading-overlay/dist/vue-loading.css';
import validator from 'validator';
import Loading from "vue-loading-overlay";
import HfButtons from '../components/element/HfButtons.vue'
import ToolTip from '../components/element/ToolTip.vue'
import messages from '../mixins/messages'
export default {
  computed: {
    orgList() {
      return this.$store.state.orgList;
    },

  },
  data() {
    return {
      edit: false,
      orgStore: {
        name: "Hypermine Pvt Ltd",
        domain: "hypermine.in",
        // logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5EZ51foyo3QBV2FHnKq1cwHaEc%26pid%3DApi&f=1",
        // region: "US EAST",
        network: "Jagrat",
        orgDid: "",
        userDid: "",
        status: "",
      },
      authToken: localStorage.getItem("authToken"),
      isLoading: true,
      isProcessFinished: true,
      images: {
        greentick: require("../assets/green-tick.png"),
        redcross: require("../assets/red-cross.png"),
        loader: require("../assets/small-loader.gif"),
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, ToolTip },
  methods: {
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/"+name+".svg"
    },
    ssePopulateOrg(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.ORG_SSE}${id}`);
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "Registered" || data.status === "Failed") {

          sse.close();
          store.commit("insertAnOrg", data)
          store.commit('increaseOrgCount')
        }
        // store.commit("updateCredStatus", data);
      };

      sse.onopen = function (e) {
        console.log("Connection to server opened.", e);
      };

      sse.onerror = function (e) {
        console.log(e)
        sse.close();
      }
      return

    },
    openWallet(url) {
      if (url != "") {


        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
        this.isProcessFinished = false;


      }
    },
    copyToClip(textToCopy,contentType) {
        if (textToCopy) {
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    this.notifySuccess(
                        `${contentType} copied!`
                    );
                })
                .catch((err) => {
                    this.notifyErr(
                        'Error while copying',
                        err
                    );
                });
        }
    },
    switchOrg(orgDid) {
      localStorage.setItem('selectedOrg',orgDid)
      this.$store.commit('updateSideNavStatus',true)
      this.$store.commit('selectAnOrg', orgDid)
      this.$router.push('/studio/credential')
      this.$store.dispatch('fetchAllOrgDataOnOrgSelect')
      this.$store.commit('shiftContainer',false)
      
    },
    openSlider() {
      this.edit = false
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    editOrg(orgDid) {
      this.edit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      Object.assign(this.orgStore, { ...this.$store.getters.findOrgByOrgID(orgDid) })
    },
    createAnOrg() {
      if(isEmpty(this.orgStore.name)) {
       return this.notifyErr(messages.ORGANIZATION.ORGANIZATION_NAME_EMPTY)
      } else if(isValidURL(this.orgStore.name)){
        return this.notifyErr(messages.ORGANIZATION.INVALID_ORG_NAME)
      } else if(isEmpty(this.orgStore.domain)) {
        return this.notifyErr(messages.ORGANIZATION.DOMAIN_NAME_EMPTY)
       } else if (!this.orgStore.domain.includes('http://localhost') && !validator.isURL(this.orgStore.domain)){
        return this.notifyErr(messages.ORGANIZATION.INVALID_DOMAIN_NAME)
      }
      let url
      let method
      if (this.edit) {
        method = "PUT"
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`

      } else {
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`
        method = "POST"

      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
      this.orgStore.userDid = JSON.parse(localStorage.getItem("user")).id

      const body = { orgData: this.orgStore }

      this.isLoading = true;
      fetch(url, {
        method,
        body: JSON.stringify(body),
        headers,
      }).then((res) => res.json())
        .then((j) => {
  
          const { org } = j.data
          if (!this.edit) {
            let QR_DATA = j.data.QrData
            let URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

            this.openWallet(URL)
          }
          if (j.error === false) {
            if(!this.edit) {
            this.$store.commit('insertAnOrg', j.data.org);
            this.$store.commit('selectAnOrg', j.data.org._id)
            this.isProcessFinished = true;
            this.openSlider();

            this.notifySuccess("Org Created successfull");
            this.ssePopulateOrg(org._id, this.$store)
            }
            
            if (this.edit === true) {
              this.$store.commit('updateAnOrg', j.data.org)
              this.notifySuccess("Org Edited successfull");
              this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            }
          }


        }).catch((e) => {
          console.log(e);
          this.notifyError("Something went wrong");
        }).finally(() => {
          this.isLoading = false;
        })

      // TODO: Implement API to create an organization

      // TODO: Make a POST request to ORG API
      // Once the ORG is created just store the org in store
      //this.$store.commit('insertAnOrg', payload);
      // Close the sideba
    },
    clearAll() {
      this.orgStore = {
        name: "",
        domain: "",
        // logo: "",
        // region: "",
        network: "",
        orgDid: "",
        userDid: "",
        status: "",
      }
    },
  },
  mixins: [UtilsMixin]
}
</script>