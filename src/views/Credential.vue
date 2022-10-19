<style scoped>
.home{
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
}
.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}
.goschema{
  color: #339af0;
}
.goschema:hover {
    text-decoration: underline;
    cursor: pointer;
}
.far{
  color: gray;
  font-size: 20px;
  padding-top: 10px;
  cursor: pointer;
}
.datetime-picker{
   background-color: #fff;
    background-clip: content-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
}
.linkdiv{
  background-clip: content-box;
  background-color: rgba(173,232,255,.5607843137254902);
  border-radius: 0.25rem;
}
h5 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
}
h5 span {
  background: #fff;
  padding: 0 10px;
}
</style>
<template>
  <div class="home">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <Info :message="description" />
          <div class="form-group" style="display:flex">
           <h3 v-if="vcList.length > 0" class="mt-4" style="text-align: left;">Credentials</h3>
            <h3 v-else class="mt-4" style="text-align: left;">Issue your first credential!</h3>
            <hf-buttons 
              name="+ Create"
              style="text-align: right;"
              class="btn btn-primary ml-auto mt-4"
              @executeAction="openSlider()"
            ></hf-buttons>
          </div>    
            <StudioSideBar title="Issue Credential">
              <div class="container">
                <div class="form-group row">
                  <div class="col-md-12">
                    <form style="padding: 5px">
                    <div class="form-group">                      
                      <label for="fordid"><strong>Subject DID<span style="color: red">*</span>:</strong></label>
                      <tool-tip class="pl-2" infoMessage="Enter DID to whome you are issuing credential"></tool-tip>
                      <input type="text" class="form-control" placeholder="Issued To (did:hs:...)"
                        v-model="holderDid" />
                    </div>
                    <div class="form-group">                  
                      <label for="forselectschema"><strong>Select Schema<span style="color: red">*</span>:</strong></label>
                      <tool-tip class="pl-2" infoMessage="Select Schema to issue credential"></tool-tip>
                      <!-- <b-form-select v-model="selected" :options="selectOptions"
                        @change="OnSchemaSelectDropDownChange($event)" size="md" class="mt-3">
                      </b-form-select> -->
                      <hf-select-drop-down
                      :options="selectOptions"
                       @selected="e =>{OnSchemaSelectDropDownChange(e)}"
                      ></hf-select-drop-down>                      
                    </div>                  
                    <span class="goschema" v-if="selectOptions.length === 1" @click="goToSchema()">Create Schema</span>
                    <tool-tip class="pl-2" v-if="selectOptions.length === 1" infoMessage="Create Schema to issue credential"></tool-tip>
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr.name">
                      <label for="schDescription"><strong>{{ CapitaliseString(attr.name) }}<span v-if="attr.required===true" style="color: red">*</span>:</strong></label>                      
                      <Datepicker v-if="attr.type === 'DATE'"
                          class="datepicker"
                          name="toDate"
                          format="YYYY-MM-DD" 
                          v-model="attr.value"
                          />
                          <input v-else type="text" class="form-control" id="schemaName" v-model="attr.value" aria-describedby="schemaNameHelp" placeholder="Enter attribute value">
                    </div>
                    <div class="form-group pt-2">                  
                      <label for="fordid"><strong>Expiry Date<span style="color: red">*</span>:</strong></label>
                      <tool-tip class="pl-2" infoMessage="Enter expiry time for the credential"></tool-tip>
                      <!-- <input type="date" class="form-control"
                         /> -->
                      <!-- <div class="form-control"> -->
                          <Datepicker 
                          class="datepicker"
                          name="toDate"
                          format="YYYY-MM-DD h:i:s" 
                          v-model="expiryDateTime"
                          />
                      <!-- </div>   -->
                    </div>
                  </form>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-12">
                    <hr />    
                    <hf-buttons 
                      name="Save"
                      style="text-align: right;"
                      class="btn btn-primary ml-auto mt-4"
                      @executeAction="issueCredential()"
                    ></hf-buttons>
                  </div>
                </div>
              </div>
              </StudioSideBar>
      </div>
    </div>
    <div class="row" style="margin-top: 2%;" v-if="vcList.length > 0">
      <div class="col-md-12">
        <table class="table table-bordered" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>VC Id</th>
              <th>Schema Id</th>
              <th>Holder DID</th>
              <th>Issuance Date</th>
              <th>Expiration Date</th>
              <!-- <th>Credential Hash</th> -->
              <th>Status</th>
              <th>Status Reason</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row.vc_id">
            
              <td>
                <a :href="`${row.vc_id}:`" target="_blank>" v-if="row.vc_id">{{ removeUrl(row.vc_id) }}</a>
              </td>
              <td>
                <a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.SCHEMA_GET_REST}${row.schemaId}:`" target="_blank">{{ shorten(row.schemaId) }}</a>
              </td>
              <td>{{ shorten(row.subjectDid) }}</td>
              <td>{{ row.credStatus ? row.credStatus.issuanceDate: "-"}}</td>
              <td>{{ row.credStatus ? row.credStatus.expirationDate : "-"}}</td>
              <!-- <td>{{ row.credStatus ?  row.credStatus.credentialHash : "-"}}</td>  -->
              <td> {{ row.credStatus ? row.credStatus.claim.currentStatus : row.status}}</td>
              <td>{{ row.credStatus ? row.credStatus.claim.statusReason  : "-"}}</td>
              <td>               
                <hf-buttons
                  v-if="row.credStatus"
                  name="Send"
                  style="text-align: right;"
                  class="btn btn-primary"
                  @executeAction="generateCred(`${row._id}`)"
                ></hf-buttons>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
        <hf-pop-up Header="Accept Credential URL"> 
            <Info message="Scan QR code or Copy the link and send it to the credential owner so that they can accept in their wallet" />
            <div class="d-flex justify-content-center"><vue-qr margin="1" :text="credUrl" :size="200"
              logoBackgroundColor="white" logoCornerRadius="2"></vue-qr>
            </div>        
            <h5 class="pt-2"><span>OR</span></h5>
            <i
            style="float:right"
            class="far fa-copy pr-2"
            title="copy url"
            @click="copyToClip(credUrl,'URL')"
            ></i>
            <div class="linkdiv">
            <p style="max-width: 500px; word-wrap: break-word; padding:10px;">{{ truncate(credUrl,70)}}</p>
            </div>
        </hf-pop-up>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import Info from '@/components/Info.vue'
import UtilsMixin from '../mixins/utils';
import HfPopUp from "../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import HfButtons from "../components/element/HfButtons.vue"
import HfSelectDropDown from "../components/element/HfSelectDropDown.vue"
import EventBus from "../eventbus"
import ToolTip from "../components/element/ToolTip.vue"
import { isEmpty, isValidDid } from '../mixins/fieldValidation'
import message from '../mixins/messages'
import Datepicker from 'vuejs-datetimepicker'
import VueQr from "vue-qr"
export default {
  name: "Credential",
  components: { Info, HfPopUp, Loading, StudioSideBar, HfButtons, HfSelectDropDown, ToolTip, Datepicker, VueQr },
  computed: {
    vcList(){
      return this.$store.state.vcList;
    },
    selectOptions(){
      return this.$store.getters.listOfAllSchemaOptions;
    },
    selectedOrg(){
      return this.$store.getters.getSelectedOrg;
    }
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      description: "An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket (\"verfiable credential\") using schema (issued by DGCA) to the passenger.",
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
      attributeValues: {},
      vcCredStatusMap: {}, 
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "",
      expiryDateTime:null,
      schema_page: 1,
      credUrl:"",
      QrData: {
        "QRType": "ISSUE_CREDENTIAL",
        "serviceEndpoint": "",
        "schemaId": "",
        "appDid": "",
        "appName": "Hypersign Studio",
        "challenge": "",
        "provider": "",
        "data": ""
      }
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.$store.commit('updateSideNavStatus',true)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    CapitaliseString(string) {
    const spaced = string.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    },
    removeUrl(url) {
      const chars = url.split('credential/');
      return this.shorten(chars[1])      
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
    goToSchema() {
      this.$router.push('schema')
    },
    openSlider() {
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    ssePopulateCredStatus(id,store){
      const sse = new EventSource(`${this.$config.studioServer.CRED_SSE}${id}`);
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "Registered" || data.status === "Failed") {
          
          sse.close();
          store.dispatch("insertAcredential", data)
        }
        // store.commit("updateCredStatus", data);
      };

      sse.onopen = function (e) {
        console.log("Connection to server opened.",e);
      };

      sse.onerror = function (e) {
        console.log(e)
        sse.close();
      }
      return


    },
      
    
    async  generateCred(id) {
      this.credUrl = ''
      const body = {
        id,
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
      const URL = this.$config.studioServer.BASE_URL + this.$config.studioServer.ACCPCT_CRED_EP
      const res = await fetch(URL, options)
      const resp =await res.json()
      this.credUrl = resp.data.url;
      this.$root.$emit('modal-show')
      this.notifySuccess("Cred Url Generated Successfully")
    },
    openWallet(url) {
      if (url != "") {
        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
    },
    OnSchemaSelectDropDownChange(event) {  
      this.selected = event;
      if (event) {
        this.issueCredAttributes = [];        
        const id = this.issueCredAttributes.length;
        const selectedSchema = this.$store.getters.findSchemaBySchemaID(event);
        const schemaMap =  selectedSchema.schemaDetails.schema.properties;
        const requiredFields = selectedSchema.schemaDetails.schema.required  
        for (const e of Object.entries(schemaMap)) {
          this.issueCredAttributes.push({
            id: id + event,
            type: e[1].type,
            name: e[0],
            value: "",
          });
        }
        // this.issueCredAttributes.map((x)=>{
        //   requiredFields.filter((y)=>{
        //    if(x.name === y){
        //     x['required'] = true
        //    }
        //    else {
        //     x['required'] = false
        //    }
        //   })
        // })
        this.issueCredAttributes.map((x)=>{
          if(requiredFields.includes(x.name)){
            x['required'] = true
          } else {
            x['required'] = false
          }
        })
      } else {
        this.issueCredAttributes = [];
      }
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiableCredential),
        "vc.json"
      );
    },
    generateAttributeMap() {
      let attributesMap = [];
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          attributesMap[e.name] = e.value;
          if(e.required === true){
          if (isEmpty(e.value)) {
            console.log(e.type)
            throw new Error(`Please enter value in ${this.CapitaliseString(e.name)} field`)
            // return this.notifyErr(`Please enter value in ${e.name} field`)
          }
          }//else if(typeof(e.value)!== e.type){
          //   throw new Error(`Type mismatch`)
          // }
        });
      }
      return attributesMap;
    },
    async issueCredential() {
      try {
        const ToDate = new Date();
        if (isEmpty(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.EMPTY_HOLDER_DID)
        } else if (!isValidDid(this.holderDid)) {
          return this.notifyErr(message.CREDENTIAL.INVALID_DID)
        } else if (isEmpty(this.selected)) {
          return this.notifyErr(message.CREDENTIAL.SELECT_SCHEMA)
        }
        // generateAttributeMap
        const attributeMap = await this.generateAttributeMap();
        
          if(!this.expiryDateTime){
            return this.notifyErr('Enter Expiry Date for credential')
          }
          if (new Date(this.expiryDateTime).getTime() <= ToDate.getTime()) {          
          return this.notifyErr("Expiry time should be gretter than current date & time");
        }
        this.isLoading = true
        const fields = Object.assign({}, attributeMap)
        const schemaId = this.selected
        const issuerDid = this.user.id
        const subjectDid = this.holderDid
        const expiryDate = this.expiryDateTime

        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        const creadData = {
          fields,
          schemaId,
          issuerDid,
          subjectDid,
          expiryDate,
          orgDid:this.$store.state.selectedOrgDid
        };
        this.QrData.data = creadData
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ QR_DATA: this.QrData }),
        }).then((res) => res.json())
          .then(json => {
            const { QR_DATA, creadRecord } = json.data
            if (json.message === 'success') {
              this.notifySuccess("Credential creation initiated. Please approve the trancation from your wallet")
              this.$store.dispatch("insertAcredential", creadRecord)
              const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
              this.openWallet(URL)

              this.ssePopulateCredStatus(creadRecord._id, this.$store)
              this.openSlider();
             
           } else {
             console.log(json)
             throw new Error(`${json.message}`)
            }       
          })
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.notifyErr(`Error: ${e.message}`)
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {    
      this.holderDid = "";
      this.expiryDateTime = null
      this.issueCredAttributes = []
      EventBus.$emit("resetOption",this.selected)
    }
  },
  mixins: [UtilsMixin],

};
</script>


