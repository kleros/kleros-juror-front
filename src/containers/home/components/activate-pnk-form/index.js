import { form } from '../../../../utils/form-generator'
import { required, number, positiveNumber } from '../../../../utils/validation'

export const {
  Form: ActivatePNKForm,
  isInvalid: getActivatePNKFormIsInvalid,
  submit: submitActivatePNKForm
} = form('activatePNKForm', {
  amount: {
    type: 'text',
    validate: [required, number, positiveNumber],
    props: {
      type: 'number',
      className: 'Form-fullWidth'
    }
  }
})
