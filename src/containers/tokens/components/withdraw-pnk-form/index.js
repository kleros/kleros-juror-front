import { form } from '../../../../utils/form-generator'
import { required, number, positiveNumber } from '../../../../utils/validation'

export const {
  Form: WithdrawPNKForm,
  isInvalid: WithdrawPNKFormIsInvalid,
  submit: submitWithdrawPNKForm
} = form('withdrawPNKForm', {
  header: {
    type: 'header',
    props: { title: 'WITHDRAW PNK' }
  },
  explaination: {
    type: 'info'
  },
  amount: {
    type: 'text',
    validate: [required, number, positiveNumber],
    props: {
      type: 'number',
      className: 'Form-noMargins'
    }
  }
})
