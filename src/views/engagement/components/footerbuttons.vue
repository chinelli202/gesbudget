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

    // The engagement is closed
    this.entityIsClosed = this.entity.etat === AppModule.etatsEngagement.CLOT.code
  }

  private initializeButtons() {
    // We reset first all buttons
    this.resetButtons()

    // We re-evaluate the isCurrentUser... variables
    this.evaluateVariables()

    // PlusDactions button is always activated
    this.isbtnPlusDactions = true

    // Activer le bouton Ok d'abord. On le désactivera éventuellement par la suite si l'un des boutons principaux est activé
    this.isbtnOk = true

    // The current user has the right to perform the n+1 action so we activate the corresponding Validation and sendBack buttons
    if (this.userCanPerformNextAction() && !this.userHasPerformPreviousAction()) {
      this.activateBtnForCurrentAction()
      this.isbtnRenvoyer = true
    }

    // The current user has performed the current statut and one of n++ action has been performed
    if (this.userPerformedCurrentStatut() && this.superiorActionHasBeenPerformed()) {
      this.isbtnOptionsAnnuler = true
    }

    // The current statut is intermediary and none of n++ action has been performed
    if (this.statutIsIntermediary() && !this.superiorActionHasBeenPerformed()) {
      this.isbtnAnnulerValider = true
    }

    // The entity is at final statut and the user has the permission to perform NextEtat
    if (this.statutIsFinal() && this.userCanNextEtat()) {
      this.isbtnImputer = true
    }
    
    // If the current user is the one who performed the SAISI
    if (this.isCurrentUserSaisisseur) {

      // Tant qu'on n'a pas validé p ou plus, si l'utilisateur est celui qui a saisi alors il peut update
      if (!this.entityHasBeenValidatePOrMore()) {
        this.isbtnUpdate = true
      }

      // While there has been no final validation, the user who has performed the SAISI can still close
      if (!this.hasBeenValidatedF()) {
        this.isbtnClose = true
      }

      // If the entity is Closed, the user who has performed the SAISI can still close
      if (this.entityIsClosed) {
        this.isbtnRestaurer = true
      }

      // The entity hasn't been sent back, so we give the user who performed the Saisi to ResendUpdate
      if (this.entity.next_statut != null) {
        this.isResendUpdate = true
      }
    }

    // Si l'un des boutons principaux est activé, désactiver le bouton Ok
    if (this.isbtnImputer || this.isbtnUpdate || this.isResendUpdate || this.isbtnValiderp || this.isbtnValiders || this.isbtnValiderf) {
      this.isbtnOk = false
    }

    // Deactivate buttons in case the entity is closed or has been sent back for SAISI
    if (this.entityIsClosed || this.entity.next_statut != null) {
      this.isbtnUpdate = false
      this.isbtnValiderp = false
      this.isbtnValiders = false
      this.isbtnValiderf = false
      this.isbtnRenvoyer = false
      this.isbtnImputer = false

      if (this.entityIsClosed) {
        this.isbtnAnnulerValider = false
        this.isResendUpdate = false
      }
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
