let VariableStorage = [];

exports.Store = async function(UserId, VariableName, VariableValue)
{
    if (VariableStorage[UserId] == null) { VariableStorage[UserId] = []; }

    VariableStorage[UserId][VariableName] = VariableValue;
}

exports.GetUser = async function(userId) {
    if (VariableStorage[userId] == null) { return; } else {
        return VariableStorage[userId];
    }
}

exports.ResetUser = async function(userId) {
    VariableStorage[userId] = null;
}