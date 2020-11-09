<template>
  <div class="clearfix">
    <div class="app-container max-w-600 center">
      <el-card shadow="always">
        <el-container>
          <el-header>
            <h1 align="center">
              Detail Engagement - {{ engagement.id }}
            </h1>
          </el-header>
          <el-main
            v-loading="listLoading"
          >
            <el-form
              ref="form"
              :model="engagement"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="Code">
                <el-input
                  v-model="engagement.code"
                  :disabled="true"
                />
              </el-form-item>

              <el-form-item label="Libellé">
                <el-input
                  v-model="engagement.libelle"
                  type="textarea"
                  :rows="2"
                  @change="formAttributeChange"
                  :disabled="!isbtnUpdate && !isResendUpdate"
                />
              </el-form-item>
              <el-form-item label="Montant HT">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-form-item label="">
                      <el-select
                        v-model="engagement.devise"
                        placeholder="Devise"
                        :disabled="!isbtnUpdate && !isResendUpdate"
                      >
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
                      @input="changeMontantHT"
                      :disabled="!isbtnUpdate && !isResendUpdate"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="Montant TTC">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <strong>TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="engagement.montant_ttc"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Type
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Statut
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-select v-if="isbtnUpdate || isResendUpdate"
                      v-model="engagement.type"
                      placeholder="Type"
                      class="type-select"
                      @change="formAttributeChange"
                    >
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
                    <el-input v-else
                      v-model="engagement.type_libelle"
                      :disabled="true"
                    />
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <el-input
                      v-model="engagement.statut_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Nature
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Etat
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <!-- <el-input
                      v-model="engagement.nature_libelle"
                      :disabled="true"
                    /> -->
                    <el-select v-if="isbtnUpdate || isResendUpdate"
                      v-model="engagement.nature"
                      placeholder="Nature"
                      class="type-select"
                      @change="formAttributeChange"
                    >
                      <el-option
                        v-for="(obj) in natureOptions"
                        :key="obj.code"
                        :label="obj.libelle"
                        :value="obj.code"
                      >
                        <span style="float: left">{{ obj.libelle }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                      </el-option>
                    </el-select>
                    <el-input v-else
                      v-model="engagement.nature_libelle"
                      :disabled="true"
                    />
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <!-- <el-input
                      v-model="engagement.etat_libelle"
                      :disabled="true"
                    /> -->
                    <el-input
                      v-model="engagement.etat_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item class="notes" style="line-height: 25px;">
                <el-row :gutter="10">
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Créé le
                  </el-col>
                  <el-col :span="15">
                    {{ engagement.created_at | dateFormatLong }}
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Saisi par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserSaisisseur) ? "Vous même" : engagement.saisisseur_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_first && engagement.valideur_first !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 1ère par
                  </el-col>
                  <el-col :span="15">
                    {{ engagement.valideurp_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_second && engagement.valideur_second !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 2nde par
                  </el-col>
                  <el-col :span="15">
                    {{ engagement.valideurs_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_final && engagement.valideur_final !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation finale par
                  </el-col>
                  <el-col :span="15">
                    {{ engagement.valideurf_name }}
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item
                v-if="isResendUpdate"
                label="Ajouter un commentaire"
              >
                <el-input
                  v-model="engagement.commentaire"
                  type="textarea"
                  prop="commentaire"
                  :rows="3"
                />
              </el-form-item>
              <el-form-item class="notes">
                <el-row
                  type="flex"
                  class="row-bg"
                  justify="end"
                >
                  <el-col :span="9">
                    <el-button @click="onCancel">
                      Annuler
                    </el-button>
                    <el-button
                      v-if="isbtnUpdate"
                      type="primary"
                      :disabled="submitUpdateDisabled"
                      @click="updateSubmit"
                    >
                      Mettre à jour
                    </el-button>
                    <el-button
                      v-if="isResendUpdate"
                      type="primary"
                      :disabled="resendUpdateDisabled"
                      @click="resendUpdate"
                    >
                      Mettre à jour
                    </el-button>
                    <el-button
                      v-if="isbtnValiderp"
                      type="primary"
                      :disabled="validerpDisabled"
                      @click="validerpSubmit"
                    >
                      Valider au 1er niveau
                    </el-button>
                    <el-button
                      v-if="isbtnValiders"
                      type="primary"
                      :disabled="validersDisabled"
                      @click="validersSubmit"
                    >
                      Valider au second niveau
                    </el-button>
                    <el-button
                      v-if="isbtnValiderf"
                      type="primary"
                      :disabled="validerfDisabled"
                      @click="validerfSubmit"
                    >
                      Valider au niveau final
                    </el-button>
                    <el-button
                      v-if="isbtnImputer"
                      type="primary"
                      @click="imputer"
                    >
                      Imputer
                    </el-button>
                    <el-button
                      v-if="isbtnOk"
                      type="primary"
                      @click="onCancel"
                    >
                      Okay
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <el-row :gutter="10">
              <el-col
                :span="6"
                :offset="1"
              >
                <el-button
                  v-if="isbtnAnnulerValider"
                  type="text"
                  @click="annulerValider"
                >
                  Annuler ma validation
                </el-button>
                <el-button
                  v-if="isbtnRestaurer"
                  type="text"
                  @click="restaurer"
                >
                  Restaurer
                </el-button>
                <el-button
                  v-if="isbtnClose"
                  type="text"
                  @click="closePreeng"
                >
                  Clôturer le pré-engagement
                </el-button>
                <el-button
                  v-if="isbtnOptionsAnnuler"
                  type="text"
                  @click="validerpSubmit"
                >
                  Je veux annuler ma validation
                </el-button>
              </el-col>
              <el-col
                :span="6"
                :offset="9"
              >
                <el-button
                  v-if="isbtnPlusDactions"
                  type="text"
                  @click="plusDactionsDialogVisible = true"
                >
                  Plus d'actions...
                </el-button>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-card>

      <el-dialog
        v-loading="true"
        title="Actions supplémentaires"
        :visible.sync="plusDactionsDialogVisible"
        width="50%"
      >
        <el-form
          ref="plusDactionsForm"
          :model="plusDactionsForm"
          :rules="rulesPlusDactionsForm"
        >
          <el-form-item label="Ajouter un commentaire">
            <el-input
              v-model="plusDactionsForm.commentaire"
              @input="commentFieldChange"
              type="textarea"
              prop="commentaire"
              :rows="3"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              @click="plusDactionsDialogVisible = false"
            >
              Annuler
            </el-button>
            <el-button
              type="info"
              @click="commentaireSubmit"
              :disabled="sendCommentDisabled"
            >
              Envoyer un commentaire
            </el-button>
            <el-button
              v-if="isbtnRenvoyer"
              type="primary"
              @click="sendBackSubmit"
            >
              Renvoyer l'engagement
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      {{ permissionCodes.engagement.enregistrer.SAISI }}<br>
      hasPermission {{ hasPermission("profile-read") }}<br>
      hasnotPermission {{ hasnotPermission("profile-read") }}<br><br>
      isbtnUpdate : {{ isbtnUpdate }}<br>
      isbtnValiderp : {{ isbtnValiderp }}<br>
      isbtnValiders : {{ isbtnValiders }}<br>
      isbtnValiderf : {{ isbtnValiderf }}<br>
      isbtnOk : {{ isbtnOk }}<br>
      isbtnClose : {{ isbtnClose }}<br>
      isbtnRestaurer : {{ isbtnRestaurer }}<br>
      isbtnRenvoyer : {{ isbtnRenvoyer }}<br>
      isbtnOptionsAnnuler : {{ isbtnOptionsAnnuler }}<br>
      isbtnAnnulerValider : {{ isbtnAnnulerValider }}<br>
      isbtnPlusDactions : {{ isbtnPlusDactions }}<br>
      isbtnImputer : {{ isbtnImputer }}<br><br>
      {{ typeOptions }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  detailEngagement
  , updateEngagement, validerpPreEngagement, resendUpdateEngagement
  , addComment
} from '@/api/engagements'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'DetailEngagement',
  components: {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fallbackUrl = from.path
    })
  }
})

export default class extends Vue {
  private listLoading = true
  private deviseOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0
  private fallbackUrl = { path: '/' }

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private submitUpdateDisabled = true;
  private resendUpdateDisabled = true;
  private validerpDisabled = true;
  private validersDisabled = true;
  private validerfDisabled = true;
  private sendCommentDisabled = true;

  private isbtnUpdate = false; // Display 'Mettre à jour' button, when the current user is the owner of the engagement. In other for him to update.
  private isbtnValiderp = false; // Display 'ValiderP' button, for the first level of validation
  private isbtnValiders = false; // Display 'ValiderS' button, for the second level of validation
  private isbtnValiderf = false; // Display 'ValiderF' button, for the final level of validation
  private isbtnOk = false; // Display 'Ok' button, which does nothing. A redirection to the previous route.
  private isbtnClose = false; // Display 'Clôturer le pré-engagement' button to close the pre-engagement
  private isbtnRestaurer = false; // Display 'Restaurer le pré-engagement' button to restore closed pre-engagement
  private isbtnRenvoyer = false; // Display 'Renvoyer' button, for the n+1th user to send back the engagement to the nth user with some comment
  private isResendUpdate = false; /* Display 'Mettre à jour' section, when the current user is the owner of the engagement.
    and his/her superior has sent back the engagement (with comments) for update. In other for him to update. */
  private isbtnOptionsAnnuler = false; /** Display a 'Je veux annuler ma validation' button associated with a dialog box : when the nth user want to
    cancel the validation he/she has done but the n+1th user has already proceed to a n+1's validation. */
  private isbtnAnnulerValider = false; // Display 'Annuler Validation' button to cancel a validation.
  private isbtnPlusDactions = false; // Display a 'Plus d'actions...' button for the user to have some actions like writing only a comment and others.
  private isbtnImputer = false; // Display 'Imputer' button for engagement imputation

  private plusDactionsDialogVisible = false
  private plusDactionsForm = {
    commentaire: '',
    used: false
  }

  private rulesPlusDactionsForm = {
    commentaire: [
      { required: true, message: 'Veuillez saisir un commentaire.', trigger: 'blur' }
    ]
  }

  private permissions : any[] = []
  private permissionCodes = {}
  private engagement = {
    id: null,
    code: '',
    montant_ht: 0,
    montant_ttc: 0,
    saisisseur: '',
    saisisseur_name: '',
    statut: '',
    next_statut: '',
    etat: '',
    valideur_first: '',
    valideur_second: '',
    valideur_final: '',
    commentaire: ''
  }

  private rules = {
    montant_ttc: [
      { required: true, message: 'Veuillez saisir un montant', trigger: 'blur' },
      { type: 'number', message: 'Veuillez saisir un nombre', trigger: 'blur' }
    ]
  }

  created() {
    const id = this.$route.params && this.$route.params.id
    this.permissions = UserModule.permissions
    this.permissionCodes = PermissionModule.permissionCodes
    this.fetchData(parseInt(id))
  }

  private async fetchData(engagementId: number) {
    this.listLoading = true
    const response = await detailEngagement({ id: engagementId })
    this.engagement = response.data
    this.deviseOptions = AppModule.devises
    this.typeOptions = AppModule.typesEngagement
    this.natureOptions = AppModule.naturesEngagement
    this.etatOptions = AppModule.etatsEngagement
    this.statutOptions = AppModule.statutsEngagement
    this.tva = AppModule.tva

    this.isCurrentUserSaisisseur = UserModule.matricule === this.engagement.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.engagement.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.engagement.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.engagement.valideur_final

    this.initializeButtons()
    this.listLoading = false
  }

  private sendBackSubmit() {
    console.log("Renvoyer l'engagement code:", this.engagement.code)

    this.$refs.plusDactionsForm.validate((valid: any) => {
      if (valid) {
        this.engagement.commentaire = this.plusDactionsForm.commentaire
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
      } else {
        console.log('error submit!!')
        return false
      }
    })
    this.plusDactionsDialogVisible = false
  }

  private async sendComment() {
    if (!this.plusDactionsForm.commentaire || this.plusDactionsForm.commentaire === '') {
      return false
    }
    const response = await addComment({id: this.engagement.id, comment: this.plusDactionsForm.commentaire})
    this.plusDactionsForm.commentaire = ''
    this.plusDactionsForm.used = true
  }

  private commentaireSubmit() {
    if (!this.plusDactionsForm.used) {
      this.sendComment().then(() => {
        this.plusDactionsDialogVisible = false
      })
    } else {
      this.$confirm('Vous venez d\'ajouter un commentaire à cette entité. Êtes vous sûr(e) de vouloir ajouter ce nouveau commentaire ?')
        .then(_ => {
          this.sendComment().then(() => {
            this.plusDactionsDialogVisible = false
          })
        })
        .catch(error => {
          console.log('Error comment submit confirmation', error)
        })
    }
  }

  private closePreeng(){

  }

  private initializeButtons() {
    if (this.engagement.etat === AppModule.etatsEngagement.INIT.code) {
      // The engagement is at the state of an initiated pré-engagement

      if (this.engagement.statut === AppModule.statutsEngagement.SAISI.code) {
        // The engagement have just been initiated

        if (!this.isCurrentUserSaisisseur) {
          // The current user is not the one who initiated the engagement

          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDP)) {
            /* The current user has the permission to validate at the first level
             So we'll give him/her :
             1- the 'Valider P' button to validate the engagement
             2- the 'Renvoyer' button to send back the engagement to  the n-1th user
             3- the 'Plus d'actions...' button if he/she just wants to add a comment */

            this.isbtnValiderp = true
            this.isbtnRenvoyer = true
            this.isbtnPlusDactions = true
          } else {
            /* The current user doesn't have the permission to validate at the first level
             So we'll give him/her :
             1- the 'Ok' button
             2- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log("The current user doesn't have the permission to validate at the first level")
            this.isbtnOk = true
            this.isbtnPlusDactions = true
          }
        } else {
          // The current user is the one who initiated the engagement

          if (this.engagement.next_statut === 'INIT') {
            /** The engagement has been sent back by the current user superior.
             * He/She needs to correct the engagement and re-submit it for the superior to validate.
             * So he/she will needs :
             * 1- to edit and resend the engagement to his superior. With the 'Mettre à jour' secion
             * 2- also to close the engagement. Withe the 'Cloturer' button
             * 3- the 'Plus d'actions...' button if he/she wants to add a comment
             */
            this.isResendUpdate = true
            this.isbtnClose = true
            this.isbtnPlusDactions = true
          } else {
            // The engagement has not been sent back by the current user superior.

            if (this.engagement.valideur_first === null && this.engagement.valideur_second === null && this.engagement.valideur_final === null) {
              /** The engagement has not yet been validated by one of current user superiors
              * So, he/she :
              * 1- can still edit the engagement. With the 'Mettre à jour' button
              * 2- can also close the engagement. Withe the 'Cloturer' button
              * 3- the 'Plus d'actions...' button if he/she wants to add a comment
              */

              console.log("The engagement has not yet been validated by one of current user superiors, '"+ this.engagement.valideur_first + "'")
              this.isbtnUpdate = true
              this.isbtnClose = true
              this.isbtnPlusDactions = true
            } else {
              /* The engagement has already been validated by one of current user superiors. So, he/she can no more edit the engagement.
              So we'll give him/her :
               1- the 'Ok' button
               2- the 'Je veux annuler ma validation' button, which will display a message on how to proceed for annulation in this particular scenario.
                It'll be handled off system.
               3- the 'Plus d'actions...' button if he/she wants to add a comment */

              console.log("The engagement has been validated by one of current user superiors, '"+ this.engagement.valideur_first + "'")
              this.isbtnOk = true
              this.isbtnPlusDactions = true
            }
          }
        }
      } else if (this.engagement.statut === AppModule.statutsEngagement.VALIDP.code) {
        // The engagement has been validated at the first level

        if (!this.isCurrentUserValideurp) {
          // The current user is not the one who validated the engagement at the first level

          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDS) &&
            !this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /* The user has the permission to validate at the second level but not at the final level
            So we'll give him/her:
            1- The 'Validate S' button, to validate at the second level
            2- the 'Renvoyer' button to send back the engagement to  the n-1th user
            3- the 'Plus d'actions...' button if he/she just wants to add a comment */

            this.isbtnValiders = true
            this.isbtnRenvoyer = true
            this.isbtnPlusDactions = true
          } else if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /** The user has the permission to validate at the final level
            * So we'll give him/her:
            * 1- The 'Validate F' button, to validate at the final level. If the user validate at final level,
            * there'll be no more need of validation at second level
            * 2- the 'Renvoyer' button to send back the engagement to  the n-1th user
            * 3- the 'Plus d'actions...' button if he/she just wants to add a comment */

            this.isbtnValiderf = true
            this.isbtnRenvoyer = true
            this.isbtnPlusDactions = true
          } else {
            /** The user has no permission to validate neither at the second or the final level
             * We'll just give him/her :
             * 1- the 'Ok' button
             * 2- the 'Plus d'actions...' button for comments
             */

            console.log("The user has no permission to validate neither at the second or the final level")
            this.isbtnOk = true
            this.isbtnPlusDactions = true
          }
        } else {
          // The current user is the one who validated the engagement at the first level

          if (this.engagement.valideur_second === null && this.engagement.valideur_final === null) {
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still cancel his validation. With the 'Annuler Validation' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */

            this.isbtnAnnulerValider = true
            this.isbtnPlusDactions = true
          } else {
            /** The engagement has not been validated by one of current user superiors.
            * So, he/she :
            * 1- will have the 'Ok' button
            * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
            * 3- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log("The engagement has not been validated by one of current user superiors")
            this.isbtnOk = true
            this.isbtnOptionsAnnuler = true
            this.isbtnPlusDactions = true
          }
        }
      } else if (this.engagement.statut === AppModule.statutsEngagement.VALIDS.code) {
        if (!this.isCurrentUserValideurs) {
          // The current user is not the one who validated the engagement at the second level
          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /** The user has the permission to validate at the final level.
             * we'll give him/her :
             * 1- The 'Validate F' button for final validation
             * 2- the 'Renvoyer' button to send back the engagement to the n-1th user
             * 3- the 'Plus d'action button' if he/she wants to add a comment
             */
            this.isbtnValiderf = true
            this.isbtnRenvoyer = true
            this.isbtnPlusDactions = true
          } else {
            /** The user doesn't have the permission to validate at the final level.
             * we'll give him/her :
             * 1- the 'Ok' button
             * 2- the 'Plus d'actions..' button for adding a comment
             */

            console.log("The user doesn't have the permission to validate at the final level. ")
            this.isbtnOk = true
            this.isbtnPlusDactions = true
          }
        } else {
          // The current user is the one who validated the engagement at the second level

          if (this.engagement.valideur_final === null) {
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still cancel his validation. With the 'Annuler Validation' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */

            this.isbtnAnnulerValider = true
            this.isbtnPlusDactions = true
          } else {
            /** The engagement has been validated by one of current user superiors.
            * So, he/she :
            * 1- will have the 'Ok' button
            * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
            * 3- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log("The engagement has been validated by one of current user superiors.")
            this.isbtnOk = true
            this.isbtnOptionsAnnuler = true
            this.isbtnPlusDactions = true
          }
        }
      } else if (this.engagement.statut === AppModule.statutsEngagement.VALIDF.code) {
        /** The final level validation cannot be canceled.
         * So the user :
         * 1- will have the 'Ok' button
         * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
         *
         * TODO : make the final level validation cancelable when no 'imputation' have'nt been created for the engagement
         *        This could be handled with a 'nb_imputations_en_suspens' & 'cumul_imputations_en_suspens' attributes on the engagement.
         *        These 2 attributes will aggregate the count and cumul of imputation that have been initiated for the engagement.
         */
        
        console.log("The final level validation cannot be canceled.")
        this.isbtnOk = true
        this.isbtnOptionsAnnuler = true
      }
    } else if (this.engagement.etat === AppModule.etatsEngagement.CLOT.code) {
      /** The engagement is closed
       * The user could :
       * 1- either restore it via the 'Restaurer' button
       * 2- Just notice with the 'Ok' button
       */

      console.log("The engagement is closed")
      this.isbtnRestaurer = true
      this.isbtnOk = true
    } else if (this.engagement.etat === AppModule.etatsEngagement.PEG.code) {
      // TODO
    } else if (this.engagement.etat === AppModule.etatsEngagement.IMP.code) {
      // TODO
    } else if (this.engagement.etat === AppModule.etatsEngagement.REA.code) {
      // TODO
    }
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitUpdateDisabled = false
    this.resendUpdateDisabled = false
    this.validerpDisabled = false
    this.validersDisabled = false
    this.validerfDisabled = false
  }

  private commentFieldChange() {
    if(this.plusDactionsForm.commentaire && this.plusDactionsForm.commentaire !== '') {
      this.sendCommentDisabled = false
    } else {
      this.sendCommentDisabled = true
    }
  }

  private async updateSubmit() {
    const response = await updateEngagement(this.engagement)
    window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private async resendUpdate() {
    const response = await resendUpdateEngagement(this.engagement)
    window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private async validerpSubmit() {
    const response = await validerpPreEngagement(this.engagement)
    window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private onCancel() {
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private hasPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length > 0
  }

  private hasnotPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length === 0
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
