<template>
  <div class="clearfix">
    <div class="app-container max-w-600 center">
      <el-card shadow="always">
        <el-container>
          <el-header>
            <h1 align="center">Detail Engagement - {{ engagement.id }} </h1>
          </el-header>
          <el-main
            v-loading="listLoading"
          >
            <el-form ref="form" :model="engagement" :rules="rules" label-width="100px">
              <el-form-item label="Code">
                <el-input 
                  v-model="engagement.code"
                  :disabled="true">
                </el-input>
              </el-form-item>
              
              <el-form-item label="Libellé">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="engagement.libelle"
                  @change="formAttributeChange">
                </el-input>
              </el-form-item>
              <el-form-item label="Montant HT">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-form-item label="">
                      <el-select v-model="engagement.devise" placeholder="Devise">
                        <el-option
                            v-for="(obj) in deviseOptions"
                            :key="obj.code"
                            :label="obj.code"
                            :value="obj.code"
                          />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="20">
                    <el-input 
                      v-model="engagement.montant_ht"
                      @change = "changeMontantHT"
                      >
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="Montant TTC">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <strong>TVA {{tva.toLocaleString('fr-FR')}}%</strong>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      :disabled="true"
                      v-model="engagement.montant_ttc"
                      >
                    </el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-row :gutter="10">
                  <el-col :span="10" :offset="3">
                    <span class="span-label">Type
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="10" :offset="3">
                      <el-select v-model="engagement.type" placeholder="Type" class="type-select" @change="formAttributeChange">
                        <el-option
                            v-for="(obj) in typeOptions"
                            :key="obj.code"
                            :label="obj.libelle"
                            :value="obj.code"
                        >
                          <span style="float: left">{{ obj.libelle }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                        </el-option>
                      </el-select>
                      
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <el-row :gutter="10">
                  <el-col :span="10" :offset="3">
                    <span class="span-label">Nature
                    </span>
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <span class="span-label">Etat
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="10" :offset="3">
                      <el-input 
                        v-model="engagement.nature_libelle"
                        :disabled="true">
                      </el-input>
                  </el-col>
                  <el-col :span="10" :offset="1">
                      <el-input 
                        v-model="engagement.etat_libelle"
                        :disabled="true">
                      </el-input>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item class="notes">
                <el-row :gutter="10">
                  <el-col :span="3" :offset="3">Créé le </el-col>
                  <el-col :span="15">{{ engagement.created_at | dateFormatLong }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="3" :offset="3">Saisi par </el-col>
                  <el-col :span="15">{{engagement.saisisseur_name}}</el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="notes">
                  <el-row type="flex" class="row-bg" justify="end">
                    <el-col :span="9">
                      <el-button @click="onCancel">
                        Annuler
                      </el-button>
                      <el-button 
                        v-if="hasPermission(permissionCodes.engagement.SAISI)" 
                        type="primary" 
                        @click="updateSubmit" 
                        :disabled="submitDisabled"
                      >
                        Mettre à jour
                      </el-button>
                      <el-button 
                        v-else-if="hasPermission(permissionCodes.engagement.VALIDP)" 
                        type="primary" 
                        @click="validerpSubmit"
                        :disabled="validerpDisabled"
                      >
                        Valider au 1er niveau
                      </el-button>
                      <!-- <el-button 
                        v-else 
                        type="primary" 
                        @click="onCancel"
                      >
                        Ok
                      </el-button> -->
                      <el-button
                        type="primary" 
                        @click="validerpSubmit"
                      >
                        Valider second niveau
                      </el-button>
                    </el-col>
                  </el-row>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-card>
      {{ permissionCodes.engagement.SAISI }}<br>
      hasPermission {{ hasPermission("profile-read") }}<br>
      hasnotPermission {{ hasnotPermission("profile-read") }}<br>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { detailEngagement, updateEngagement, validerpPreEngagement } from '@/api/engagements'
import { getVariables } from '@/api/variables'
import { IEngagementData } from '@/api/types'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'DetailEngagement',
  components: {
    
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fallbackUrl = from.path;
    });
  }
})

export default class extends Vue {
  private listLoading = true
  private deviseOptions = {}
  private typeOptions = {}
  private tva: number = 0
  private fallbackUrl = { path: '/'}

  private submitDisabled = true;
  private validerpDisabled = true;
  private validersDisabled = true;
  private validerfDisabled = true;

  private permissions : any[] = []
  private permissionCodes = {}
  private engagement = {
    montant_ht: 0,
    montant_ttc: 0
  }
  private rules = {
          montant_ttc: [
            { required: true, message: 'Veuillez saisir un montant', trigger: 'blur' },
            { type: 'number', message: 'Veuillez saisir un nombre', trigger: 'blur' }
          ], 
  }

  created(){
    const id = this.$route.params && this.$route.params.id;
    this.permissions = UserModule.permissions
    this.permissionCodes = PermissionModule.permissionCodes
    this.fetchData(parseInt(id));
  }

  private async fetchData(engagementId: number){
    this.listLoading = true;
    let response = await detailEngagement({ id: engagementId });
    this.engagement = response.data;
    
    this.deviseOptions = AppModule.devises;
    this.typeOptions = AppModule.typesEngagement;
    this.tva = AppModule.tva;

    this.listLoading = false
  }

  private changeMontantHT(value: number){
    this.engagement.montant_ttc = Math.ceil(value*(1 + this.tva/100));
    this.formAttributeChange();
  }

  private formAttributeChange(){
    this.submitDisabled = false;
    this.validerpDisabled = false;
    this.validersDisabled = false;
    this.validerfDisabled = false;
  }

  private async updateSubmit(){
    let response = await updateEngagement(this.engagement);
    window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/';
  }

  private async validerpSubmit(){
    let response = await validerpPreEngagement(this.engagement);
    window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/';
  }

  private onCancel(){
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/');
  }

  private hasPermission(permission: string){
    return UserModule.permissions.filter(item => item.code == permission).length > 0;
  }

  private hasnotPermission(permission: string){
    return UserModule.permissions.filter(item => item.code == permission).length == 0;
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  box-shadow: 2px;
}
.notes{
  color:gray;
}

.no-margin-bottom{
  margin-bottom: 0px;
}

.span-label{

}

.type-select .el-input__inner {
    padding-right: 149px;
}

.el-col-20{
    width: 86.7%;
  }

.max-w-600{
  max-width: 100vh;
}
.center{
  margin: auto;
}
</style>