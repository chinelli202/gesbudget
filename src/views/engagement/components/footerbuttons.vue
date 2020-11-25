<template>
  <div
    v-loading="footerLoading"
    style="padding: 1em;"
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
          @click="update"
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
          v-if="isNextEtatAction && isbtnNextEtatAction"
          type="primary"
          @click="nextEtatAction"
        >
          {{ nextEtatActionText }}
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
          @click="preRestorePreeng"
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
            @click="preCommentaireSubmit"
          >
            Envoyer un commentaire
          </el-button>
          <el-button
            v-if="isbtnClose"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="preClosePreeng"
          >
            Clôturer {{ entityLabel() }}
          </el-button>
          <el-button
            v-if="isbtnRenvoyer"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="preSendBackSubmit"
          >
            Renvoyer l'engagement
          </el-button>
          <el-button
            v-if="isbtnAnnulerValider"
            type="primary"
            :disabled="sendCommentDisabled"
            @click="preCancelValiderSubmit"
          >
            Annuler ma validation {{ annulerValiderText }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  detailEngagement, validationPreeng, cancelValidationPreeng
  , resendUpdateEngagement, addComment, sendBack
} from '@/api/engagements'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { Console } from 'console'

@Component({
  name: 'FooterButtons',
  components: {
  }
})

export default class FooterButtons extends Vue {
  @Prop({ required: true }) private entity!: any
  @Prop({ required: true }) private type!: any
  @Prop() private submitDisabled!: any
  @Prop() private nextEtatActionText!: any
  @Prop() private isNextEtatAction!: any

  @Prop() private onCancel!: any
  @Prop() private update!: any
  @Prop() private resendUpdate!: any
  @Prop() private validerpSubmit!: any
  @Prop() private validersSubmit!: any
  @Prop() private validerfSubmit!: any
  @Prop() private restore!: any
  @Prop() private optionsAnnulerValider!: any
  @Prop() private commentaireSubmit!: any
  @Prop() private close!: any
  @Prop() private sendBackSubmit!: any
  @Prop() private cancelValiderSubmit!: any
  @Prop() private nextEtatAction!: any

  /** Variables for buttons rendering */
  private footerLoading = true // TODO : this attribute is no more useful, to delete it in this class
  private footerEntity:any

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
  private isbtnNextEtatAction = false; // Display 'Imputer' button for engagement imputation

  private annulerValiderText = 'au 1er niveau'

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

  mounted() {
    this.$watch('entity', entity => {
      this.initializeButtons()
    }, { immediate: true })

    this.$watch('isbtnUpdate', entity => {
      this.$emit('updateBtnStateChanged', this.isbtnUpdate)
    }, { immediate: true })

    this.$watch('isResendUpdate', entity => {
      this.$emit('resendBtnStateChanged', this.isResendUpdate)
    }, { immediate: true })
  }

  private entityLabel() {
    if (this.type === "engagement") {
      return 'le pré-engagement'
    } else if (this.type === "imputation") {
      return 'l\'imputation'
    } else if (this.type === "apurement") {
      return 'l\'apurement'
    } else {
      return 'Unknown entity'
    }
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
    this.isbtnNextEtatAction = false

    this.plusDactionsDialogVisible = false
  }

  private evaluateVariables() {
    this.isCurrentUserSaisisseur = UserModule.matricule === this.entity.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.entity.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.entity.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.entity.valideur_final

    // The engagement is closed
    this.entityIsClosed = this.entity.etat === AppModule.etatsEngagement.CLOT.code

    this.annulerValiderLabel()
  }

  /** Pre handlers: functions used to preprocessed stuffs before executing Props function */
  private async sendComment() {
    if (!this.plusDactionsForm.commentaire || this.plusDactionsForm.commentaire === '') {
      return false
    }
    const response = await this.commentaireSubmit(this.entity.id, this.plusDactionsForm.commentaire)
    this.plusDactionsDialogVisible = false
    this.plusDactionsForm.commentaire = ''
    this.sendCommentDisabled = true
    this.plusDactionsForm.used = true
  }

  private async preCommentaireSubmit() {
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
          console.log('Error comment submit confirmation', error)
        })
    }
  }

  private preClosePreeng() {
    this.$confirm('Voulez-vous vraiment clôturer cet engagement ?'
      , 'Clôture de l\'engagement'
      , {
        confirmButtonText: 'Oui, clôturer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      this.close(this.entity.id, this.plusDactionsForm.commentaire).then((response:any) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.footerLoading = false
      }).catch((error:any) => {
        this.footerLoading = false
        console.log('Error close', error)
      })
    })
      .catch(error => {
        console.log('Error when closing engagement', error)
      })
  }

  private preRestorePreeng() {
    this.$confirm('Voulez-vous vraiment restaurer cet engagement ?'
      , 'Restauration de l\'engagement'
      , {
        confirmButtonText: 'Oui, restaurer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      this.restore(this.entity.id, this.plusDactionsForm.commentaire).then((response:any) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.footerLoading = false
      }).catch((error:any) => {
        this.footerLoading = false
        console.log('Error restore', error)
      })
    })
      .catch(error => {
        console.log('Error when restoring engagement', error)
      })
  }

  private preSendBackSubmit() {
    this.$confirm('Voulez-vous vraiment renvoyer cet engagement ?'
      , 'Renvoi de l\'engagement'
      , {
        confirmButtonText: 'Oui, renvoyer cet engagement',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      this.sendBackSubmit(this.entity.id, this.plusDactionsForm.commentaire).then((response:any) => {
        this.plusDactionsDialogVisible = false
        this.plusDactionsForm.commentaire = ''
        this.plusDactionsForm.used = true
        this.sendCommentDisabled = true
        this.footerLoading = false
      }).catch((error:any) => {
        this.footerLoading = false
        console.log('Error sendBack', error)
      })
    })
      .catch(error => {
        console.log('Error when sending back engagement', error)
      })
  }

  private preCancelValiderSubmit() {
    this.$confirm('Voulez-vous vraiment annuler votre validation ?'
      , 'Annulation de validation'
      , {
        confirmButtonText: 'Oui, annuler ma validation',
        cancelButtonText: 'Retour',
        type: 'warning'
      }
    ).then(_ => {
      this.footerLoading = true
      console.log('Annuler valider statut:', this.entity.statut)
      this.cancelValiderSubmit(this.entity.id, this.plusDactionsForm.commentaire, this.entity.statut)
        .then((response:any) => {
          this.plusDactionsDialogVisible = false
          this.plusDactionsForm.commentaire = ''
          this.plusDactionsForm.used = true
          this.sendCommentDisabled = true
          this.footerLoading = false
        }).catch((error:any) => {
          this.footerLoading = false
          console.log('Error cancelValidationpPreeng', error)
        })
    })
      .catch((error:any) => {
        console.log('Error when canceling validationp on Pre-engagement', error)
      })
  }

  /** Utilities functions */
  private annulerValiderLabel() {
    switch (this.entity.statut) {
      case AppModule.statutsEngagement.SAISI.code:
        this.annulerValiderText = ''
        break
      case AppModule.statutsEngagement.VALIDP.code:
        this.annulerValiderText = 'au 1er niveau'
        break
      case AppModule.statutsEngagement.VALIDS.code:
        this.annulerValiderText = 'au 2nd niveau'
        break
      case AppModule.statutsEngagement.VALIDF.code:
        this.annulerValiderText = 'au niveau final'
        break
      default:
        this.annulerValiderText = ''
    }
  }

  private userPerformedCurrentStatut() {
    switch (this.entity.statut) {
      case AppModule.statutsEngagement.SAISI.code:
        return this.isCurrentUserSaisisseur
      case AppModule.statutsEngagement.VALIDP.code:
        return this.isCurrentUserValideurp
      case AppModule.statutsEngagement.VALIDS.code:
        return this.isCurrentUserValideurs
      case AppModule.statutsEngagement.VALIDF.code:
        return this.isCurrentUserValideurf
      default:
        return false
    }
  }

  private activateBtnForNextAction() {
    const nextStatut:string[] = this.nextStatut(this.entity.statut)
    if (nextStatut.indexOf(AppModule.statutsEngagement.VALIDP.code) !== -1) {
      this.isbtnValiderp = true
      return null
    } else if (nextStatut.indexOf(AppModule.statutsEngagement.VALIDS.code) !== -1) {
      this.isbtnValiders = true
      return null
    } else if (nextStatut.indexOf(AppModule.statutsEngagement.VALIDF.code) !== -1) {
      this.isbtnValiderf = true
      return null
    } else {
      return null
    }
  }

  private statutIsFinal() {
    return this.entity.statut === AppModule.statutsEngagement.VALIDF.code
  }

  private userCanNextEtat() {
    let nextEtat = ''
    // find the next etat
    switch (this.entity.etat) {
      case AppModule.etatsEngagement.INIT.code:
        nextEtat = AppModule.etatsEngagement.PEG.code
        break
      case AppModule.etatsEngagement.PEG.code:
        nextEtat = AppModule.etatsEngagement.IMP.code
        break
      case AppModule.etatsEngagement.IMP.code: // IMP is the last state where actions are possible so there is no 'nextEtat' possible
        return false
      case AppModule.etatsEngagement.APUR.code: // No action possible when the entity is at the APUR state
        return false
    }

    if (nextEtat === '') {
      return false
    }
    // Test if the user has the permission
    return this.hasPermission(PermissionModule.permissionCodes.engagement[nextEtat].SAISI)
  }

  private nextStatut(statut:string): string[] {
    const next:string[] = []
    switch (statut) {
      case AppModule.statutsEngagement.SAISI.code:
        next.push(AppModule.statutsEngagement.VALIDP.code)
        break
      case AppModule.statutsEngagement.VALIDP.code:
        next.push(AppModule.statutsEngagement.VALIDS.code)
        next.push(AppModule.statutsEngagement.VALIDF.code)
        break
      case AppModule.statutsEngagement.VALIDS.code:
        next.push(AppModule.statutsEngagement.VALIDF.code)
        break
      case AppModule.statutsEngagement.VALIDF.code:
        break
    }
    return next
  }

  private userCanNextStatut() {
    const nextStatut:string[] = this.nextStatut(this.entity.statut)
    if (nextStatut.length === 0) {
      return false
    }
    let canNextStatut = false
    nextStatut.forEach(statut => {
      canNextStatut = canNextStatut || this.hasPermission(PermissionModule.permissionCodes.engagement[this.entity.etat][statut])
    })
    // Test if the user has the permission
    return canNextStatut
  }

  private superiorActionHasBeenPerformed() {
    switch (this.entity.statut) {
      case AppModule.statutsEngagement.SAISI.code:
        return this.entity.valideur_first || this.entity.valideur_second || this.entity.valideur_final
      case AppModule.statutsEngagement.VALIDP.code:
        return this.entity.valideur_second || this.entity.valideur_final
      case AppModule.statutsEngagement.VALIDS.code:
        return this.entity.valideur_final
      case AppModule.statutsEngagement.VALIDF.code:
        return true
      default:
        return false
    }
  }

  private statutIsIntermediary() {
    return !(this.entity.statut === AppModule.statutsEngagement.SAISI.code || this.entity.statut === AppModule.statutsEngagement.VALIDF.code)
  }

  private etatIsClosed() {
    return this.entity.etat === AppModule.etatsEngagement.CLOT.code
  }

  private entityHasBeenValidatePOrMore() {
    return this.entity.valideur_first || this.entity.valideur_second || this.entity.valideur_final
  }

  private hasBeenValidatedF() {
    return this.entity.statut === AppModule.statutsEngagement.VALIDF.code
  }

  /** Buttons initializations */
  private initializeButtons() {
    // 1.We reset first all buttons
    this.resetButtons()

    // 2.We re-evaluate the isCurrentUser... variables
    this.evaluateVariables()

    // 3.PlusDactions button is always activated
    this.isbtnPlusDactions = true

    // 4.Activer le bouton Ok d'abord. On le désactivera éventuellement par la suite si l'un des boutons principaux est activé
    this.isbtnOk = true

    // 5.The entity is at final statut and the user has the permission to perform NextEtat
    if (this.statutIsFinal() && this.userCanNextEtat() && this.isNextEtatAction) {
      this.isbtnNextEtatAction = true
    }

    // 6.The current user has the right to perform the n+1 action so we activate the corresponding Validation and sendBack buttons
    if (!this.statutIsFinal() && this.userCanNextStatut() && !this.userPerformedCurrentStatut()) {
      this.activateBtnForNextAction()
      this.isbtnRenvoyer = true
    }

    // 7.The current user has performed the current statut and one of n++ action has been performed
    if (this.userPerformedCurrentStatut() && this.superiorActionHasBeenPerformed()) {
      this.isbtnOptionsAnnuler = true
    }

    // 8.The current statut is intermediary and none of n++ action has been performed
    if (this.statutIsIntermediary() && !this.superiorActionHasBeenPerformed() && this.userPerformedCurrentStatut()) {
      this.isbtnAnnulerValider = true
    }

    // 9.If the current user is the one who performed the SAISI
    if (this.isCurrentUserSaisisseur) {
      // 9.a.Tant qu'on n'a pas validé p ou plus, si l'utilisateur est celui qui a saisi alors il peut update
      if (!this.entityHasBeenValidatePOrMore()) {
        this.isbtnUpdate = true
      }

      // 9.c.While there has been no final validation, the user who has performed the SAISI can still close
      if (!this.hasBeenValidatedF() && !this.etatIsClosed()) {
        this.isbtnClose = true
      }

      // 9.d.If the entity is Closed, the user who has performed the SAISI can still close
      if (this.entityIsClosed) {
        this.isbtnRestaurer = true
      }

      // 9.e.The entity hasn't been sent back, so we give the user who performed the Saisi to ResendUpdate
      if (this.entity.next_statut != null) {
        this.isResendUpdate = true
      }
    }

    // 10.Deactivate buttons in case the entity is closed or has been sent back for SAISI
    if (this.entityIsClosed || this.entity.next_statut != null) {
      this.isbtnUpdate = false
      this.isbtnValiderp = false
      this.isbtnValiders = false
      this.isbtnValiderf = false
      this.isbtnRenvoyer = false
      this.isbtnNextEtatAction = false

      if (this.entityIsClosed) {
        this.isbtnAnnulerValider = false
        this.isResendUpdate = false
      }
    }

    // 11.Si l'un des boutons principaux est activé, désactiver le bouton Ok
    if (this.isbtnNextEtatAction || this.isbtnUpdate || this.isResendUpdate || this.isbtnValiderp || this.isbtnValiders || this.isbtnValiderf || this.isbtnAnnulerValider) {
      this.isbtnOk = false
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
