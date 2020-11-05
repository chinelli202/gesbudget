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
                            v-for="(_, code) in deviseOptions"
                            :key="code"
                            :label="code"
                            :value="code"
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
                            v-for="(libelle, code) in typeOptions"
                            :key="code"
                            :label="libelle"
                            :value="code"
                        >
                          <span style="float: left">{{ libelle }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ code }}</span>
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
                  <el-col :span="6" :offset="3">Créé le </el-col>
                  <el-col :span="15">{{ engagement.created_at | dateFormatLong }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6" :offset="3">Saisi par </el-col>
                  <el-col :span="15">{{ (isCurrentUserSaisisseur) ? "Vous même" : engagement.saisisseur_name }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6" :offset="3">Validation 1ère par </el-col>
                  <el-col :span="15">{{ "TODO" }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6" :offset="3">Validation 2nde par </el-col>
                  <el-col :span="15">{{ "TODO" }}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6" :offset="3">Validation finale par </el-col>
                  <el-col :span="15">{{ "TODO" }}</el-col>
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
      {{typeOptions}}
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

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private submitDisabled = true;
  private validerpDisabled = true;
  private validersDisabled = true;
  private validerfDisabled = true;

  private isbtnUpdate = false;  // Display 'Mettre à jour' button, when the current user is the owner of the engagement. In other for him to update.
  private isbtnValiderp = false; // Display 'ValiderP' button, for the first level of validation
  private isbtnValiders = false; // Display 'ValiderS' button, for the second level of validation
  private isbtnValiderf = false; // Display 'ValiderF' button, for the final level of validation
  private isbtnOk = false; // Display 'Ok' button, which does nothing. A redirection to the previous route.
  private isbtnRenvoyer = false; // Display 'Renvoyer' button, for the n+1th user to send back the engagement to the nth user with some comment
  private isbtnOptionsAnnuler = false; // Display a 'Je veux annuler ma validation' button associated with a dialog box : when the nth user want to
                                        // cancel the validation he/she has done but the n+1th user has already proceed to a n+1's validation.
  private isbtnPlusDactions = false;  // Display a 'Plus d'actions...' button for the user to have some actions like writing only a comment and others.
  private isbtnAnnulerValider = false; // Display 'Annuler Validation' button to cancel a validation.
  private isbtnImputer = false;

  private permissions : any[] = []
  private permissionCodes = {}
  private engagement = {
    montant_ht: 0,
    montant_ttc: 0,
    saisisseur: '',
    saisisseur_name: '',
    statut : '',
    etat: '',
    valideur_first: '',
    valideur_second: '',
    valideur_final: ''
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
    this.isCurrentUserSaisisseur = UserModule.matricule == this.engagement.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule == this.engagement.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule == this.engagement.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule == this.engagement.valideur_final
    // this.saisisseur_label = UserModule.matricule;

    this.initializeButtons();
    this.listLoading = false
  }

  private initializeButtons(){
    if(this.engagement.etat = AppModule.etatsEngagement.INIT){
      // The engagement is at the state of an initiated pré-engagement

      if(this.engagement.statut == AppModule.statutsEngagement.SAISI){
        // The engagement have just been initiated

        if(!this.isCurrentUserSaisisseur){
          // The current user is not the one who initiated the engagement

          if(this.hasPermission(PermissionModule.permissionCodes.engagement.VALIDP)){
            /* The current user has the permission to validate at the first level
             So we'll give him/her :
             1- the 'Valider P' button to validate the engagement
             2- the 'Renvoyer' button to send back the engagement to  the n-1th user
             3- the 'Plus d'actions...' button if he/she just wants to add a comment*/

            this.isbtnValiderp = true;
            this.isbtnRenvoyer = true;
            this.isbtnPlusDactions = true;
          }else{
            /* The current user doesn't have the permission to validate at the first level
             So we'll give him/her :
             1- the 'Ok' button
             2- the 'Plus d'actions...' button if he/she wants to add a comment*/

            this.isbtnOk = true;
            this.isbtnPlusDactions = true;
          }
        }else{
          // The current user is the one who initiated the engagement

          if(this.engagement.valideur_first == '' && this.engagement.valideur_second == '' && this.engagement.valideur_final == ''){
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still edit the engagement. With the 'Mettre à jour' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */

            this.isbtnUpdate = true;
            this.isbtnPlusDactions = true;

          }else{
            /*The engagement has already been validated by one of current user superiors. So, he/she can no more edit the engagement.
            So we'll give him/her :
             1- the 'Ok' button
             2- the 'Je veux annuler ma validation' button, which will display a message on how to proceed for annulation in this particular scenario.
                It'll be handled off system.
             3- the 'Plus d'actions...' button if he/she wants to add a comment*/

            this.isbtnOk = true;
            this.isbtnPlusDactions = true;
          }
        }
      }
      else if (this.engagement.statut == AppModule.statutsEngagement.VALIDP){
        // The engagement has been validated at the first level

        if(!this.isCurrentUserValideurp){
          // The current user is not the one who validated the engagement at the first level

          if(this.hasPermission(PermissionModule.permissionCodes.engagement.VALIDS) && !this.hasPermission(PermissionModule.permissionCodes.engagement.VALIDF)){
            /* The user has the permission to validate at the second level but not at the final level
            So we'll give him/her:
            1- The 'Validate S' button, to validate at the second level
            2- the 'Renvoyer' button to send back the engagement to  the n-1th user
            3- the 'Plus d'actions...' button if he/she just wants to add a comment*/

            this.isbtnValiders = true;
            this.isbtnRenvoyer = true;
            this.isbtnPlusDactions = true;

          }else if(this.hasPermission(PermissionModule.permissionCodes.engagement.VALIDF)){
            /* The user has the permission to validate at the final level
            So we'll give him/her:
            1- The 'Validate F' button, to validate at the final level. If the user validate at final level, 
                there'll be no more need of validation at second level
            2- the 'Renvoyer' button to send back the engagement to  the n-1th user
            3- the 'Plus d'actions...' button if he/she just wants to add a comment */

            this.isbtnValiderf = true;
            this.isbtnRenvoyer = true;
            this.isbtnPlusDactions = true;
          }else{
            /** The user has no permission to validate neither at the second or the final level
             * We'll just give him/her :
             * 1- the 'Ok' button
             * 2- the 'Plus d'actions...' button for comments
             */

            this.isbtnOk = true;
            this.isbtnPlusDactions = true;
          }
        }else {
          // The current user is the one who validated the engagement at the first level

          if(this.engagement.valideur_second == ''  && this.engagement.valideur_final == ''){
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still cancel his validation. With the 'Annuler Validation' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */
              this.isbtnAnnulerValider = true;
              this.isbtnPlusDactions = true;

          }else{
              /** The engagement has not been validated by one of current user superiors.
              * So, he/she :
              * 1- will have the 'Ok' button
              * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
              * 3- the 'Plus d'actions...' button if he/she wants to add a comment */
            
            this.isbtnOk = true;
            this.isbtnOptionsAnnuler = true;
            this.isbtnPlusDactions = true;
          }
        }
      }else if(this.engagement.statut == AppModule.statutsEngagement.VALIDS){
        if(!this.isCurrentUserValideurs ){
          // The current user is not the one who validated the engagement at the second level
          if(this.hasPermission(PermissionModule.permissionCodes.engagement.VALIDF)){
            this.isbtnValiderf = true;
            this.isbtnRenvoyer = true;
            this.isbtnPlusDactions = true;
          }else{
            this.isbtnOk = true;
            this.isbtnPlusDactions = true;
          }
        }else{
          // The current user is the one who validated the engagement at the second level

        }
      }
    } else if(this.engagement.etat = AppModule.etatsEngagement.PEG){
      // TODO
    }
    
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