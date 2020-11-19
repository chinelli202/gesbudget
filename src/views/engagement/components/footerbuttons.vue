<template>
  <div
    v-loading="footerLoading"
    style="padding: 1em;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-row
      type="flex"
      class="row-bg"
      justify="end"
    >
      <el-col :span="9">
        <el-button @click="onCancel">
          Retour
        </el-button>
        <el-button
          v-if="isbtnUpdate"
          type="primary"
          :disabled="submitDisabled"
          @click="updateSubmit"
        >
          Mettre à jour
        </el-button>
        <el-button
          v-if="isResendUpdate"
          type="primary"
          :disabled="submitDisabled"
          @click="resendUpdate"
        >
          Renvoyer la mise à jour
        </el-button>
        <el-button
          v-if="isbtnAnnulerValider"
          type="primary"
          @click="plusDactionsDialogVisible = true"
        >
          Annuler ma validation
        </el-button>
        <el-button
          v-if="isbtnValiderp"
          type="primary"
          @click="validerpSubmit"
        >
          Valider au 1er niveau
        </el-button>
        <el-button
          v-if="isbtnValiders"
          type="primary"
          @click="validersSubmit"
        >
          Valider au second niveau
        </el-button>
        <el-button
          v-if="isbtnValiderf"
          type="primary"
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
    <el-row :gutter="10">
      <el-col
        :span="7"
        :offset="1"
      >
        >
        <el-button
          v-if="isbtnRestaurer"
          type="text"
          @click="restorePreeng"
        >
          Restaurer
        </el-button>
        <el-button
          v-if="isbtnClose"
          type="text"
          @click="plusDactionsDialogVisible = true"
        >
          Clôturer {{ entityLabel() }}
        </el-button>
        <el-button
          v-if="isbtnOptionsAnnuler"
          type="text"
          @click="optionsAnnulerValider"
        >
          Je veux annuler ma validation
        </el-button>
      </el-col>
      <el-col
        :span="6"
        :offset="8"
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
            type="textarea"
            prop="commentaire"
            :rows="3"
            @input="commentFieldChange"
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
            :disabled="sendCommentDisabled"
            @click="commentaireSubmit"
          >
            Envoyer un commentaire
          </el-button>
          <el-button
            v-if="isbtnClose"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="closePreeng"
          >
            Clôturer {{ entityLabel() }}
          </el-button>
          <el-button
            v-if="isbtnRenvoyer"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="sendBackSubmit"
          >
            Renvoyer l'engagement
          </el-button>
          <el-button
            v-if="isbtnAnnulerValider"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="cancelValiderSubmit"
          >
            Annuler ma validation
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    next_statut : {{ entity.next_statut }}<br>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  detailEngagement
  , updateEngagement, validationpPreeng, validationPreeng, cancelValidationPreeng, cancelValidationpPreeng, validationsPreeng
  , resendUpdateEngagement, addComment, closePreeng, restorePreeng, sendBack
} from '@/api/engagements'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'FooterButtons',
  components: {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fallbackUrl = from.path
    })
  }
})

export default class FooterButtons extends Vue {
  @Prop({ required: true }) private entity!: any
  @Prop({ required: true }) private type!: any
  @Prop({ default: false, required: true }) private submitDisabled!: any
  mounted() {
    this.$watch('entity', entity => {
      this.footerLoading = true
      this.initializeButtons()
      this.footerLoading = false
    }, { immediate: true })
  }

  /** Variables for buttons rendering */
  private footerLoading = false
  private fallbackUrl = { path: '/' }

  private entityIsClosed = false

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private submitUpdateDisabled = true;
  private resendUpdateDisabled = true;
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

  created() {
    this.footerLoading = true
    const id = this.$route.params && this.$route.params.id
    this.permissions = UserModule.permissions
    this.permissionCodes = PermissionModule.permissionCodes
    this.footerLoading = false
  }

  private entityLabel() {
    if (this.entity.etat === AppModule.etatsEngagement.INIT.code) {
      return 'le pré-engagement'
    } else if (this.entity.etat === AppModule.etatsEngagement.PEG.code) {
      return "l'imputation"
    } else if (this.entity.etat === AppModule.etatsEngagement.IMP.code) {
      return "l'apurement"
    }
  }

  private async sendComment() {
    if (!this.plusDactionsForm.commentaire || this.plusDactionsForm.commentaire === '') {
      return false
    }
    const response = await addComment({ id: this.entity.id, comment: this.plusDactionsForm.commentaire })
    this.plusDactionsDialogVisible = false
    this.plusDactionsForm.commentaire = ''
    this.sendCommentDisabled = true
    this.plusDactionsForm.used = true
    this.entity = response.data
    this.initializeButtons()
  }

  private async commentaireSubmit() {
    if (!this.plusDactionsForm.used) {
      this.sendComment()
    } else {
      this.$confirm('Vous venez d\'ajouter un commentaire à cette entité. Êtes vous sûr(e) de vouloir ajouter ce nouveau commentaire ?'
        , 'Commentaire existant'
        , {
          confirmButtonText: 'Oui, ajouter ce commentaire',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }
      ).then(_ => {
        this.sendComment()
      })
        .catch(error => {
          console.log('fb ->Error comment submit confirmation', error)
        })
    }
  }

  private closePreeng() {
    this.$confirm('Voulez-vous vraiment clôturer cet engagement ?'
      , 'Clôture de l\'engagement'
      , {
        confirmButtonText: 'Oui, clôturer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      closePreeng({ id: this.entity.id, comment: this.plusDactionsForm.commentaire }).then((response) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.entity = response.data
        this.initializeButtons()
        this.footerLoading = false
      }).catch(error => {
        this.footerLoading = false
        console.log('fb ->Error close', error)
      })
    })
      .catch(error => {
        console.log('fb ->Error when closing engagement', error)
      })
  }

  private restorePreeng() {
    this.$confirm('Voulez-vous vraiment restaurer cet engagement ?'
      , 'Restauration de l\'engagement'
      , {
        confirmButtonText: 'Oui, restaurer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      restorePreeng({ id: this.entity.id, comment: this.plusDactionsForm.commentaire }).then((response) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.entity = response.data
        this.initializeButtons()
        this.footerLoading = false
      }).catch(error => {
        this.footerLoading = false
        console.log('fb ->Error restore', error)
      })
    })
      .catch(error => {
        console.log('fb ->Error when restoring engagement', error)
      })
  }

  private async updateSubmit() {
    this.footerLoading = true
    updateEngagement(this.entity).then((response) => {
      this.initializeButtons()
      this.footerLoading = false
    }).catch(error => {
      this.footerLoading = false
      console.log('fb ->Error update', error)
    })
    // window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private async resendUpdate() {
    this.footerLoading = true
    resendUpdateEngagement(this.entity).then((response) => {
      this.entity = response.data
      this.initializeButtons()
      this.footerLoading = false
    }).catch(error => {
      this.footerLoading = false
      console.log('fb ->Error resendUpdate', error)
    })
  }

  private sendBackSubmit() {
    this.$confirm('Voulez-vous vraiment renvoyer cet engagement ?'
      , 'Renvoi de l\'engagement'
      , {
        confirmButtonText: 'Oui, renvoyer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      sendBack({ id: this.entity.id, comment: this.plusDactionsForm.commentaire }).then((response) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.entity = response.data
        this.initializeButtons()
        this.footerLoading = false
      }).catch(error => {
        this.footerLoading = false
        console.log('fb ->Error sendBack', error)
      })
    })
      .catch(error => {
        console.log('fb ->Error when sending back engagement', error)
      })
  }

  private validerpSubmit() {
    this.validerSubmit('VALIDP')
  }

  private validersSubmit() {
    this.validerSubmit('VALIDS')
  }

  private validerfSubmit() {
    this.validerSubmit('VALIDF')
  }

  private validerSubmit(statut: string) {
    this.footerLoading = true
    validationPreeng({ id: this.entity.id, statut: statut }).then((response) => {
      this.entity = response.data
      this.initializeButtons()
      this.footerLoading = false
    }).catch(error => {
      this.footerLoading = false
      console.log('fb ->Error validationsPreeng', error)
    })
  }

  private cancelValiderSubmit() {
    this.$confirm('Voulez-vous vraiment annuler votre validation au 1er niveau ?'
      , 'Annulation de validation au 1er niveau'
      , {
        confirmButtonText: 'Oui, annuler ma validation',
        cancelButtonText: 'Retour',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      cancelValidationPreeng({ id: this.entity.id, comment: this.plusDactionsForm.commentaire, statut: this.entity.statut }).then((response) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.entity = response.data
        this.initializeButtons()
        this.footerLoading = false
      }).catch(error => {
        this.footerLoading = false
        console.log('fb ->Error cancelValidationpPreeng', error)
      })
    })
      .catch(error => {
        console.log('fb ->Error when canceling validationp on Pre-engagement', error)
      })
  }

  private onCancel() {
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private changeMontantHT(value: number) {
    this.entity.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitUpdateDisabled = false
    this.resendUpdateDisabled = false
  }

  private commentFieldChange() {
    if (this.plusDactionsForm.commentaire && this.plusDactionsForm.commentaire !== '') {
      this.sendCommentDisabled = false
    } else {
      this.sendCommentDisabled = true
    }
  }

  private hasPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length > 0
  }

  private hasnotPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length === 0
  }

  private resetButtons() {
    this.submitUpdateDisabled = true
    this.resendUpdateDisabled = true
    this.sendCommentDisabled = true

    this.isbtnUpdate = false
    this.isbtnValiderp = false
    this.isbtnValiders = false
    this.isbtnValiderf = false
    this.isbtnOk = false
    this.isbtnClose = false
    this.isbtnRestaurer = false
    this.isbtnRenvoyer = false
    this.isResendUpdate = false
    this.isbtnOptionsAnnuler = false
    this.isbtnAnnulerValider = false
    this.isbtnPlusDactions = false
    this.isbtnImputer = false

    this.plusDactionsDialogVisible = false
  }

  private evaluateVariables() {
    this.isCurrentUserSaisisseur = UserModule.matricule === this.entity.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.entity.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.entity.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.entity.valideur_final
  }

  private initializeButtons() {
    // We reset first all buttons
    this.resetButtons()

    // We re-evaluate the isCurrentUser... variables
    this.evaluateVariables()

    // The engagement is closed
    this.entityIsClosed = this.entity.etat === AppModule.etatsEngagement.CLOT.code
    if (this.type === AppModule.etatsEngagement.INIT.code) {
      // The engagement is at the state of an initiated pré-engagement
      console.log('fb ->The engagement is at the state of an initiated pré-engagement')

      if (this.entity.statut === AppModule.statutsEngagement.SAISI.code) {
        // The engagement have just been initiated
        console.log('fb ->The engagement have just been initiated')

        if (!this.isCurrentUserSaisisseur) {
          // The current user is not the one who initiated the engagement
          console.log('fb ->The current user is not the one who initiated the engagement')

          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDP)) {
            /* The current user has the permission to validate at the first level
             So we'll give him/her :
             1- the 'Valider P' button to validate the engagement
             2- the 'Plus d'actions...' button if he/she just wants to add a comment
             3- the 'Renvoyer' button to send back the engagement to  the n-1th user.
             This button is to display only if the engagement hasn't been sent back yet.
            */

            console.log('fb ->The current user has the permission to validate at the first level')
            this.isbtnPlusDactions = true
            if (this.entity.next_statut !== null) {
              /** The current engagement has been sent back to SAISI for updating
               * So the current user can't do no validation
               */
              this.isbtnOk = true
            } else {
              /** The current engagement has not been sent back to SAISI for updating
               * So the current user can
               * 1- Validate at the first level with the 'Valider P' button
               * 2- Send back with the 'Renvoyer' button
               */
              this.isbtnRenvoyer = true
              this.isbtnValiderp = true
            }
          } else {
            /* The current user doesn't have the permission to validate at the first level
             So we'll give him/her :
             1- the 'Ok' button
             2- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log("fb ->The current user doesn't have the permission to validate at the first level")
            this.isbtnOk = true
            this.isbtnPlusDactions = true
          }
        } else {
          // The current user is the one who initiated the engagement
          console.log('fb ->The current user is the one who initiated the engagement')

          if (this.entity.next_statut === 'SAISI') {
            /** The engagement has been sent back by the current user superior.
             * He/She needs to correct the engagement and re-submit it for the superior to validate.
             * So he/she will needs :
             * 1- to edit and resend the engagement to his superior. With the 'Mettre à jour' secion
             * 2- also to close the engagement. Withe the 'Cloturer' button
             * 3- the 'Plus d'actions...' button if he/she wants to add a comment
             */

            console.log('fb ->The engagement has been sent back by the current user superior.')
            this.isResendUpdate = true
            this.isbtnClose = true
            this.isbtnPlusDactions = true
          } else {
            // The engagement has not been sent back by the current user superior.
            console.log('fb ->The engagement has not been sent back by the current user superior.')

            if (this.entity.valideur_first === null && this.entity.valideur_second === null && this.entity.valideur_final === null) {
              /** The engagement has not yet been validated by one of current user superiors
              * So, he/she :
              * 1- can still edit the engagement. With the 'Mettre à jour' button
              * 2- can also close the engagement. Withe the 'Cloturer' button
              * 3- the 'Plus d'actions...' button if he/she wants to add a comment
              */

              console.log('fb ->The engagement has not yet been validated by one of current user superiors, \'' + this.entity.valideur_first + "'")
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

              console.log("fb ->The engagement has been validated by one of current user superiors, '" + this.entity.valideur_first + "'")
              this.isbtnOk = true
              this.isbtnPlusDactions = true
            }
          }
        }
      } else if (this.entity.statut === AppModule.statutsEngagement.VALIDP.code) {
        // The engagement has been validated at the first level
        console.log('fb ->The engagement has been validated at the first level')

        if (!this.isCurrentUserValideurp) {
          // The current user is not the one who validated the engagement at the first level
          console.log('fb ->The current user is not the one who validated the engagement at the first level')

          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDS) &&
            !this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /* The user has the permission to validate at the second level but not at the final level
            So we'll give him/her:
            1- The 'Validate S' button, to validate at the second level
            2- the 'Plus d'actions...' button if he/she just wants to add a comment
             3- the 'Renvoyer' button to send back the engagement to  the n-1th user.
             This button is to display only if the engagement hasn't been sent back yet.
            */
            console.log('fb ->The user has the permission to validate at the second level but not at the final level')

            this.isbtnValiders = true
            this.isbtnPlusDactions = true
            if (this.entity.next_statut === null) {
              this.isbtnRenvoyer = true
            }
          } else if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /** The user has the permission to validate at the final level
            * So we'll give him/her:
            * 1- The 'Validate F' button, to validate at the final level. If the user validate at final level,
            * there'll be no more need of validation at second level
            * 2- the 'Plus d'actions...' button if he/she just wants to add a comment
            * 3- the 'Renvoyer' button to send back the engagement to  the n-1th user.
            * This button is to display only if the engagement hasn't been sent back yet.
            */
            console.log('fb ->The user has the permission to validate at the final level')

            this.isbtnValiderf = true
            this.isbtnPlusDactions = true
            if (this.entity.next_statut === null) {
              this.isbtnRenvoyer = true
            }
          } else {
            /** The user has no permission to validate neither at the second or the final level */

            console.log('fb ->The user has no permission to validate neither at the second or the final level')
            if (!this.isCurrentUserSaisisseur) {
              /** The user is not the one who initiated the engagement
               * We'll just give him/her :
               * 1- the 'Ok' button
               * 2- the 'Plus d'actions...' button for comments
              */

              console.log('fb ->The user is not the one who initiated the engagement')
              this.isbtnOk = true
              this.isbtnPlusDactions = true
            } else {
              /** The user is the one who initiated the engagement
               * We'll just give him/her :
               * 1- the 'Ok' button
               * 2- the 'Plus d'actions...' button for comments
               * 3- the 'Clôturer l'engagement' button
              */

              console.log('fb ->The user is the one who initiated the engagement')
              this.isbtnOk = true
              this.isbtnPlusDactions = true
              this.isbtnClose = true
            }
          }
        } else {
          // The current user is the one who validated the engagement at the first level
          console.log('fb ->The current user is the one who validated the engagement at the first level')

          if (this.entity.valideur_second === null && this.entity.valideur_final === null) {
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still cancel his validation. With the 'Annuler Validation' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */
            console.log('fb ->The engagement has not yet been validated by one of current user superiors.')

            this.isbtnAnnulerValider = true
            this.isbtnPlusDactions = true
          } else {
            /** The engagement has been validated by one of current user superiors.
            * So, he/she :
            * 1- will have the 'Ok' button
            * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
            * 3- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log('fb ->The engagement has been validated by one of current user superiors')
            this.isbtnOk = true
            this.isbtnOptionsAnnuler = true
            this.isbtnPlusDactions = true
          }
        }
      } else if (this.entity.statut === AppModule.statutsEngagement.VALIDS.code) {
        // The engagement's statut is VALIDS
        console.log('fb ->The engagement\'s statut is VALIDS')

        if (!this.isCurrentUserValideurs) {
          // The current user is not the one who validated the engagement at the second level
          console.log('fb ->The current user is not the one who validated the engagement at the second level')
          if (this.hasPermission(PermissionModule.permissionCodes.engagement.enregistrer.VALIDF)) {
            /** The user has the permission to validate at the final level.
             * we'll give him/her :
             * 1- The 'Validate F' button for final validation
             * 2- the 'Plus d'actions...' button if he/she just wants to add a comment
             * 3- the 'Renvoyer' button to send back the engagement to  the n-1th user.
             * This button is to display only if the engagement hasn't been sent back yet.
            */
            console.log('fb ->The user has the permission to validate at the final level.')
            this.isbtnValiderf = true
            this.isbtnPlusDactions = true
            if (this.entity.next_statut === null) {
              this.isbtnRenvoyer = true
            }
          } else {
            /** The user doesn't have the permission to validate at the final level.
             * we'll give him/her :
             * 1- the 'Ok' button
             * 2- the 'Plus d'actions..' button for adding a comment
             */

            console.log("fb ->The user doesn't have the permission to validate at the final level. ")
            this.isbtnOk = true
            this.isbtnPlusDactions = true
          }
        } else {
          // The current user is the one who validated the engagement at the second level
          console.log('fb ->The current user is the one who validated the engagement at the second level')

          if (this.entity.valideur_final === null) {
            /* The engagement has not yet been validated by one of current user superiors.
            So, he/she :
            * 1- can still cancel his validation. With the 'Annuler Validation' button
            * 2- the 'Plus d'actions...' button if he/she wants to add a comment
            */

            console.log('fb ->The engagement has not yet been validated by one of current user superiors.')
            this.isbtnAnnulerValider = true
            this.isbtnPlusDactions = true
          } else {
            /** The engagement has been validated by one of current user superiors.
            * So, he/she :
            * 1- will have the 'Ok' button
            * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
            * 3- the 'Plus d'actions...' button if he/she wants to add a comment */

            console.log('fb ->The engagement has been validated by one of current user superiors.')
            this.isbtnOk = true
            this.isbtnOptionsAnnuler = true
            this.isbtnPlusDactions = true
          }
        }
      } else if (this.entity.statut === AppModule.statutsEngagement.VALIDF.code) {
        /** The final level validation cannot be canceled.
         * So the user :
         * 1- will have the 'Ok' button
         * 2- can just see how to proceed off system to initiate the cancelation process. With the 'Je veux annuler ma validation' button
         *
         * TODO : make the final level validation cancelable when no 'imputation' have'nt been created for the engagement
         *        This could be handled with a 'nb_imputations_en_suspens' & 'cumul_imputations_en_suspens' attributes on the engagement.
         *        These 2 attributes will aggregate the count and cumul of imputation that have been initiated for the engagement.
         */

        console.log('fb ->The final level validation cannot be canceled.')
        this.isbtnOk = true
        this.isbtnOptionsAnnuler = true
      }
    } else if (this.entity.etat === AppModule.etatsEngagement.CLOT.code) {
      /** The engagement is closed
       * The user could :
       * 1- either restore it via the 'Restaurer' button. If the user is the one who created it.
       * 2- Just notice with the 'Ok' button
       */

      console.log('fb ->The engagement is closed')
      if (this.isCurrentUserSaisisseur) {
        this.isbtnRestaurer = true
      }
      this.isbtnOk = true
    } else if (this.entity.etat === AppModule.etatsEngagement.PEG.code) {
      // TODO
      console.log('fb ->The engagement is etat PEG')
    } else if (this.entity.etat === AppModule.etatsEngagement.IMP.code) {
      // TODO
      console.log('fb ->The engagement is etat IMP')
    } else if (this.entity.etat === AppModule.etatsEngagement.REA.code) {
      // TODO
      console.log('fb ->The engagement is etat REA')
    } else {
      console.log('fb ->we dont know this ', this.entity.etat)
    }
  }
}

</script>

<style lang="scss" scoped>
.el-container{
  box-shadow: 2px;
}

.cascade-extra-lg{
      width: 58.5vw;
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
  max-width: 70vw;
}
.center{
  margin: auto;
}

</style>
