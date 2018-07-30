import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: TransferPNKForm,
  isInvalid: TransferPNKFormIsInvalid,
  submit: submitTransferPNKForm
} = form('transferPNKForm', {
  header: {
    type: 'header',
    props: { title: 'TRANSFER PNK' }
  },
  explaination: {
    type: 'info'
  },
  amount: {
    type: 'text',
    validate: [required, number],
    props: {
      type: 'number',
      className: 'Form-noMargins'
    }
  }
})
