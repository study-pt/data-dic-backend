const setting = {
  database: '',
  static: ''
}

exports.setting = setting

exports.update = (newSetting) => {
  Object.assign(setting, newSetting)
}