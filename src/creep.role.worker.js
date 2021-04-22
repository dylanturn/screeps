const constants = require('./constants')
const creep_util = require('./creep.util')

function getSpec(){
	let role_spec = creep_util.GetBaseRoleSpec()
    role_spec.primary_role = constants.CREEP_ROLES.WORKER
    role_spec.valid_secondary_roles = [constants.CREEP_ROLES.TRANSPORTER]
	role_spec.parts = [ WORK, CARRY, MOVE ]
    role_spec.active_role = role_spec.primary_role
    return role_spec
}

function run(creep){
    creep.say(creep.memory.active_role, false)
    return creep
}

module.exports = {
    GetSpec(){
        return getSpec()
    },
    Run(creep){
        return run(creep)
    }
}
