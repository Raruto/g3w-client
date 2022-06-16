import Validator from './validator';

class DateTimePickerValidator extends Validator {
  // constructor(options = {}) {
  //   super(options);
  // }

  validate(value, options) {
    const { fielddatetimeformat } = options;
    return moment(value, fielddatetimeformat, true).isValid();
  }
}

export default DateTimePickerValidator;
