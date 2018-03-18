import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: ActivatePNKForm,
  isInvalid: getActivatePNKFormIsInvalid,
  submit: submitActivatePNKForm
} = form('activatePNKForm', {
  header: {
    type: 'header',
    props: { title: 'ACTIVATE PNK' }
  },
  amount: {
    type: 'text',
    validate: [required, number]
  }
})
