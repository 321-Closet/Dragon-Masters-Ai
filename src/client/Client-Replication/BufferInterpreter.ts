const ReplicatedStorage = game.GetService("ReplicatedStorage");

let NetworkPort = ReplicatedStorage.WaitForChild("NetworkPort");

if (NetworkPort.IsA("RemoteEvent")) {
    NetworkPort.OnClientEvent.Connect(function(packet: buffer){
        // decipher render tags, render objects or move if no tag
    })
}