const setting = {
  database: '',
  static: '',
  prefix: ''
}

exports.setting = setting

exports.update = (newSetting) => {
  Object.assign(setting, newSetting)
}