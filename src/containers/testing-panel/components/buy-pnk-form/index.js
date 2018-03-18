import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: BuyPNKForm,
  isInvalid: getBuyPNKFormIsInvalid,
  submit: submitBuyPNKForm
} = form('buyPNKForm', {
  header: {
    type: 'header',
    props: { title: 'BUY PNK' }
  },
  rate: {
    type: 'info'
  },
  amount: {
    type: 'text',
    validate: [required, number],
    props: {
      className: 'Form-noMargins'
    }
  }
})
