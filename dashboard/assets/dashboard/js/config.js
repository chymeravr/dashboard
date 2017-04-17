export var config = {}

/**
 * 
 * Never change IDs in this class. Changing anything here will lead to changes everywhere the field is consumed
 */

config.jwt = {
    tokenKey: 'chym_token'
}

config.campaignTypes = {
    '1': 'Image 360',
    // '2': 'Video 360'
}

config.defaultCampaignType = 1;

config.pricings = {
    '1': 'CPC',
    '2': 'CPM'
}

config.defaultPricing = 1;

config.hmds = {
    '-1': null,
    '1': 'Gear VR',
    '2': 'Cardboard',
}

config.defaultHmd = '-1';

config.operatingSystems = {
    '-1': null,
    '1': 'Android'
}

config.defaultOperatingSystem = '-1';

config.appStores = {
    '1': 'Google Play Store',
    '2': 'Oculus'
}

config.defaultAppStore = '1'

config.creativeFormats = {
    '0': 'Equirectangular',
    '1': 'Cubemap'
}

config.defaultCreativeFormat = '0'

config.vision = {
    '0': 'Monoscopic',
    '1': 'Stereoscopic'
}
config.defaultVision = '0'